import { pageMetadata } from "@/lib/meta";
import { ProfessionalPage } from "@/views/ProfessionalPage";

export const metadata = pageMetadata("professional", "pt");

export default function Page() {
  return <ProfessionalPage locale="pt" />;
}
