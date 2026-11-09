import type { ReactNode } from "react";
import s from "./Crumbs.module.css";

/** Breadcrumb trail above a page title: links separated by " / ", the last item the current page. */
export function Crumbs({ children }: { children: ReactNode }) {
  return <p className={s.crumbs}>{children}</p>;
}
