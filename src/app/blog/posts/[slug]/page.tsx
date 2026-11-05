import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getValidSlugs, getPostBySlug } from "@/lib/blog";

export async function generateStaticParams() {
  const slugs = await getValidSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.data.title,
    description: post.data.summary ?? post.data.title,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Link
        href="/blog"
        className="text-muted-foreground text-sm hover:underline"
      >
        &larr; Back to Blog
      </Link>
      <h1 className="text-3xl font-bold mt-4 mb-2">{post.data.title}</h1>
      <div className="text-muted-foreground mb-8">{post.data.date}</div>
      <article className="prose prose-neutral dark:prose-invert">
        <MDXRemote source={post.content} />
      </article>
    </div>
  );
}
