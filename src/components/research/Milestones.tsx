import { Label } from "@/components/ui/Label";
import s from "./Milestones.module.css";

export type Milestone = { when: string; title: string; detail: string; summit?: boolean };

/** Waypoints along the academic path; the summit (PhD) gets the --mark diamond. */
export function Milestones({ items }: { items: Milestone[] }) {
  return (
    <ol className={s.list}>
      {items.map((m) => (
        <li key={m.when + m.title} className={m.summit ? s.summit : undefined}>
          <Label tabular>{m.when}</Label>
          <h3>{m.title}</h3>
          <p>{m.detail}</p>
        </li>
      ))}
    </ol>
  );
}
