import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "public/blog/posts");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
};

export async function getValidSlugs(): Promise<string[]> {
  const files = await fs.readdir(postsDirectory);
  return files
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx?$/, ""));
}

export async function getPosts(): Promise<PostMeta[]> {
  const files = await fs.readdir(postsDirectory);
  const posts = await Promise.all(
    files
      .filter((f) => f.endsWith(".mdx"))
      .map(async (file) => {
        const filePath = path.join(postsDirectory, file);
        const source = await fs.readFile(filePath, "utf8");
        const { data } = matter(source);
        return {
          slug: file.replace(/\.mdx?$/, ""),
          title: data.title,
          date: data.date,
          summary: data.summary,
        };
      })
  );
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string) {
  const validSlugs = await getValidSlugs();
  if (!validSlugs.includes(slug)) return null;

  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  const source = await fs.readFile(filePath, "utf8");
  const { content, data } = matter(source);
  return { content, data };
}
