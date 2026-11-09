// Worker entry: serves the static site from ASSETS, and proxies side projects hosted elsewhere
// so they live under ruilebre.com. Only paths listed in `run_worker_first` (wrangler.jsonc) reach
// this script; everything else is served straight from the assets (with _headers/_redirects).

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

// Path prefix on ruilebre.com → upstream origin serving the same path.
// The apps use relative asset URLs, so they work unchanged under the prefix.
const PROXIES: Record<string, string> = {
  "/lightlex": "https://rlebre.github.io",
};

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
};

async function proxy(request: Request, url: URL, prefix: string, upstream: string): Promise<Response> {
  // /lightlex → /lightlex/, so the app's relative asset paths resolve under the prefix
  if (url.pathname === prefix) {
    return Response.redirect(`${url.origin}${prefix}/${url.search}`, 301);
  }
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  }

  const target = new URL(url.pathname + url.search, upstream);
  const headers = new Headers();
  for (const name of ["accept", "accept-language", "if-none-match", "if-modified-since", "range"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const upstreamResponse = await fetch(target, { method: request.method, headers, redirect: "manual" });
  const response = new Response(upstreamResponse.body, upstreamResponse);

  // Keep upstream redirects (e.g. a missing trailing slash) on ruilebre.com
  const location = response.headers.get("location");
  if (location) {
    const resolved = new URL(location, target);
    if (resolved.origin === new URL(upstream).origin) {
      response.headers.set("location", `${url.origin}${resolved.pathname}${resolved.search}${resolved.hash}`);
    }
  }

  for (const [name, value] of Object.entries(SECURITY_HEADERS)) response.headers.set(name, value);
  return response;
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    for (const [prefix, upstream] of Object.entries(PROXIES)) {
      if (url.pathname === prefix || url.pathname.startsWith(`${prefix}/`)) {
        return proxy(request, url, prefix, upstream);
      }
    }
    return env.ASSETS.fetch(request);
  },
};

export default worker;
