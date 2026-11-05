import { pageMetadata } from "@/lib/meta";
import { HomePage } from "@/views/HomePage";

export const metadata = pageMetadata("home", "pt");

export default function Page() {
  return <HomePage locale="pt" />;
}
