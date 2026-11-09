import { pageMetadata } from "@/lib/meta";
import { HobbiesPage } from "@/views/HobbiesPage";

export const metadata = pageMetadata("hobbies", "en");

export default function Page() {
  return <HobbiesPage locale="en" />;
}
