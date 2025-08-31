import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "public/blog/posts");
  const files = await fs.readdir(postsDirectory);
  return files
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => ({ slug: file.replace(/\.mdx?$/, "") }));
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const postsDirectory = path.join(process.cwd(), "public/blog/posts");
  const filePath = path.join(postsDirectory, `${params.slug}.mdx`);
  const source = await fs.readFile(filePath, "utf8");
  const { content, data } = matter(source);
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Link
        href="/blog"
        className="text-muted-foreground text-sm hover:underline"
      >
        ← Back to Blog
      </Link>
      <h1 className="text-3xl font-bold mt-4 mb-2">{data.title}</h1>
      <div className="text-muted-foreground mb-8">{data.date}</div>
      <article className="prose prose-neutral dark:prose-invert">
        <MDXRemote source={content} />
      </article>
    </div>
  );
}
