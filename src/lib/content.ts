import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { postFrontmatter, type PostFrontmatter } from "./schemas";

const DIR = path.join(process.cwd(), "content/blog");

export type Post = PostFrontmatter & {
  slug: string;
  body: string;
  minutes: number;
  headings: { id: string; text: string }[];
};

export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** ~220 words per minute, rounded up, at least 1. */
export function readingTime(text: string): number {
  const words = text
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`[\]()-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function extractHeadings(body: string) {
  return [...body.matchAll(/^##\s+(.+)$/gm)].map((m) => ({ id: slugify(m[1].trim()), text: m[1].trim() }));
}

/** Drafts are listed in `next dev` (so they can be previewed) and left out of production builds. */
export const includeDrafts = () => process.env.NODE_ENV !== "production";

/** The posts a build publishes, newest first. Pure, so tests can feed it fixtures. */
export function visiblePosts<P extends Pick<Post, "draft" | "date">>(all: P[], drafts = includeDrafts()): P[] {
  return all.filter((p) => drafts || !p.draft).sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * The blog (nav item, home "Latest posts", sitemap entry, indexing) only shows once there is at
 * least one visible post. Adding a non-draft post brings it all back on the next build.
 */
export function isBlogVisible(posts: readonly unknown[]): boolean {
  return posts.length > 0;
}

/**
 * `output: "export"` refuses a dynamic route whose generateStaticParams() is empty, so while there
 * are no posts the post routes emit one placeholder slug that renders the 404 page (noindex).
 */
export const NO_POSTS_SLUG = "_";

export function postStaticParams(posts: Pick<Post, "slug">[]): { slug: string }[] {
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: NO_POSTS_SLUG }];
}

function loadAll(): Post[] {
  return readdirSync(DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = readFileSync(path.join(DIR, file), "utf8");
      const { data, content } = matter(raw);
      const parsed = postFrontmatter.safeParse(data);
      if (!parsed.success) throw new Error(`Invalid frontmatter in content/blog/${file}: ${parsed.error.message}`);
      return {
        ...parsed.data,
        slug: file.replace(/\.mdx$/, ""),
        body: content,
        minutes: readingTime(content),
        headings: extractHeadings(content),
      };
    });
}

let cache: Post[] | null = null;

/** Every post in content/blog, drafts included, unsorted. */
export function getAllPosts(): Post[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  cache = loadAll();
  return cache;
}

/** The posts this build publishes (see visiblePosts), newest first. */
export function getPosts(): Post[] {
  return visiblePosts(getAllPosts());
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

export function blogVisible(): boolean {
  return isBlogVisible(getPosts());
}
