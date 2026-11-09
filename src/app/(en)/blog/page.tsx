import { pageMetadata } from "@/lib/meta";
import { BlogPage } from "@/views/BlogPage";

export const metadata = pageMetadata("blog", "en");

export default function Page() {
  return <BlogPage locale="en" />;
}
