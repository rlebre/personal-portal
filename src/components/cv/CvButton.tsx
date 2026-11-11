import { FileText } from "@/components/ui/icons";
import { ToastButton } from "@/components/ui/Toast";
import { t, type Locale } from "@/lib/i18n";
import { cvPage } from "@/lib/images";
import { site } from "@/lib/site";
import { CvViewer, type CvLabels } from "./CvViewer";

/** The primary "View CV" action (home hero, Professional): the in-page viewer, or a "coming soon"
 *  toast while there's no PDF. */
export function CvButton({ locale }: { locale: Locale }) {
  const icon = <FileText />;
  if (!site.cvUrl)
    return (
      <ToastButton variant="primary" message={t(locale, "toast.cv")}>
        {icon}
        <span>{t(locale, "work.cv")}</span>
      </ToastButton>
    );
  const k = ["title", "back", "download", "copy", "copied", "copyfail", "share", "open", "alt", "note"] as const;
  return (
    <CvViewer
      pdf={site.cvUrl}
      url={new URL(site.cvUrl, site.url).href}
      page={{ src: cvPage.src, width: cvPage.width, height: cvPage.height }}
      labels={{ view: t(locale, "work.cv"), ...Object.fromEntries(k.map((key) => [key, t(locale, `cv.${key}`)])) } as CvLabels}
      icon={icon}
    />
  );
}
