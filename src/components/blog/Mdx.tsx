import { getImageProps } from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { isValidElement, type ReactNode } from "react";
import { slugify } from "@/lib/content";
import { photoAlt } from "@/lib/data";
import { photos, thumbOf } from "@/lib/images";

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

/** h2 with the same slug id that extractHeadings() gives the TOC. */
function H2({ children }: { children?: ReactNode }) {
  return <h2 id={slugify(textOf(children))}>{children}</h2>;
}

type PhotoProps = { n: string | number; caption?: string; lang?: "en" | "pt" };

/** Width of the prose column (Article.module.css + Container gutters): full width minus 16/32 px gutters, then 680 px beside the TOC. */
const PROSE_SIZES = "(max-width: 719px) calc(100vw - 32px), (max-width: 980px) calc(100vw - 64px), 680px";

/** A <Photo> this early in the source (characters) is likely in the first screen on desktop. */
const ABOVE_FOLD_CHARS = 700;

/**
 * Gallery photo by its 1-based number (a string: next-mdx-remote blocks JS expressions), with alt
 * text from data/photoAlt.json. Responsive: the 760 px thumbnail or the full photo, by column width
 * and DPR. `priority`: the post's first photo is never lazy (on desktop it's often the LCP element),
 * and gets fetchpriority=high when it sits near the top of the post.
 */
function Photo({ n: raw, caption, lang = "en", priority }: PhotoProps & { priority?: "eager" | "high" }) {
  const n = Number(raw);
  const img = photos[n - 1];
  if (!img) throw new Error(`<Photo n={${n}}>: no such photo`);
  const thumb = thumbOf(img);
  const { props } = getImageProps({
    src: img,
    alt: photoAlt[lang][n - 1],
    placeholder: "blur",
    loading: priority ? "eager" : "lazy",
    fetchPriority: priority === "high" ? "high" : undefined,
  });
  const srcSet = thumb === img ? undefined : `${thumb.src} ${thumb.width}w, ${img.src} ${img.width}w`;
  return (
    <figure>
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- getImageProps() output plus a srcset (images are unoptimized, so next/image has none); alt is in props */}
      <img {...props} srcSet={srcSet} sizes={srcSet && PROSE_SIZES} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/** The first <Photo> in a post and how eagerly to load it. */
function leadPhoto(source: string): { n: string; priority: "eager" | "high" } | undefined {
  const m = /<Photo\s[^>]*\bn=["']?(\d+)/.exec(source);
  return m ? { n: m[1], priority: m.index < ABOVE_FOLD_CHARS ? "high" : "eager" } : undefined;
}

/** Renders a post body. `lang` (the post's language) picks the alt text for <Photo>. */
export function Mdx({ source, lang }: { source: string; lang: "en" | "pt" }) {
  const lead = leadPhoto(source);
  return (
    <MDXRemote
      source={source}
      components={{ h2: H2, Photo: (p: PhotoProps) => <Photo lang={lang} {...p} priority={lead && String(p.n) === lead.n ? lead.priority : undefined} /> }}
    />
  );
}
