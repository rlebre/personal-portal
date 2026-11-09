import { pageMetadata } from "@/lib/meta";
import { AllTrailsPage } from "@/views/AllTrailsPage";

export const metadata = pageMetadata("trails", "pt");

export default function Page() {
  return <AllTrailsPage locale="pt" />;
}
