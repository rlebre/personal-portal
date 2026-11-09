import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/content";
import { sitemapEntries } from "@/lib/meta";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries(getPosts());
}
