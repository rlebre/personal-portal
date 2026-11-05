import { notFound } from "next/navigation";
import { getPost, getPosts, postStaticParams } from "@/lib/content";
import { postMetadata } from "@/lib/meta";
import { PostPage } from "@/views/PostPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return postStaticParams(getPosts());
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const post = getPost((await params).slug);
  return post ? postMetadata(post, "en") : { robots: { index: false } };
}

export default async function Page({ params }: PageProps<"/blog/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  return <PostPage post={post} locale="en" />;
}
