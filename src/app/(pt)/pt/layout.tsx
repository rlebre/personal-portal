import { Shell } from "@/components/layout/Shell";
import { baseMetadata } from "@/lib/meta";

export const metadata = baseMetadata;

export default function Layout({ children }: LayoutProps<"/pt">) {
  return <Shell locale="pt">{children}</Shell>;
}
