import { Label } from "@/components/ui/Label";
import s from "./NowStrip.module.css";

export type NowItem = { label: string; value: string; detail: string };

/** "Now" strip: three label → value pairs (a description list), divided by dashed rules. */
export function NowStrip({ items }: { items: NowItem[] }) {
  return (
    <dl className={s.now}>
      {items.map((it) => (
        <div key={it.label}>
          <Label as="dt">{it.label}</Label>
          <dd className={s.value}>{it.value}</dd>
          <dd className={s.detail}>{it.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
