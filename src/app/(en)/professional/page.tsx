import { pageMetadata } from "@/lib/meta";
import { ProfessionalPage } from "@/views/ProfessionalPage";

export const metadata = pageMetadata("professional", "en");

export default function Page() {
  return <ProfessionalPage locale="en" />;
}
