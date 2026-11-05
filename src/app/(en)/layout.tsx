import { Shell } from "@/components/layout/Shell";
import { baseMetadata } from "@/lib/meta";

export const metadata = baseMetadata;

export default function Layout({ children }: LayoutProps<"/">) {
  return <Shell locale="en">{children}</Shell>;
}
