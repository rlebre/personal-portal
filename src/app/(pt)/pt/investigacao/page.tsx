import { pageMetadata } from "@/lib/meta";
import { ResearchPage } from "@/views/ResearchPage";

export const metadata = pageMetadata("research", "pt");

export default function Page() {
  return <ResearchPage locale="pt" />;
}
