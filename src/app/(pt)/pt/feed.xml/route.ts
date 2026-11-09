import { rss } from "@/lib/feed";

export const dynamic = "force-static";

export function GET() {
  return rss("pt");
}
