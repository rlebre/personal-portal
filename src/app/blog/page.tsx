import Link from "next/link";
import type { Metadata } from "next";
import { getPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Blog posts by Rui Lebre.",
};

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Blog</h1>
      <ul className="space-y-6">
        {posts.map((post) => (
          <li key={post.slug} className="border-b pb-4">
            <Link
              href={`/blog/posts/${post.slug}`}
              className="text-xl font-semibold hover:underline"
            >
              {post.title}
            </Link>
            <div className="text-sm text-muted-foreground mt-1">
              {post.date}
            </div>
            <div className="mt-2 text-base text-muted-foreground">
              {post.summary}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
