import { pageMetadata } from "@/lib/meta";
import { ResearchPage } from "@/views/ResearchPage";

export const metadata = pageMetadata("research", "en");

export default function Page() {
  return <ResearchPage locale="en" />;
}
