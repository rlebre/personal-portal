import { pageMetadata } from "@/lib/meta";
import { HobbiesPage } from "@/views/HobbiesPage";

export const metadata = pageMetadata("hobbies", "pt");

export default function Page() {
  return <HobbiesPage locale="pt" />;
}
