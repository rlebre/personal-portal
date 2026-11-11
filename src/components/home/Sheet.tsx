import type { ComponentPropsWithoutRef } from "react";
import s from "./Sheet.module.css";

/**
 * Full-bleed opaque layer for everything below the hero. While scrolling it lifts over the hero
 * (rounded top, shadow) as the hero's layers recede behind it (see Hero.module.css).
 */
export function Sheet(props: ComponentPropsWithoutRef<"div">) {
  return <div className={s.sheet} {...props} />;
}
