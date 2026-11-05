import { Chip, ChipList } from "@/components/ui/Chip";
import s from "./SkillGroups.module.css";

/** `lang`: language of the items when it differs from the page (English skill names on /pt). */
export type SkillGroup = { title: string; items: string[]; lang?: string };

/** Three columns of skill chips (domains, technologies, languages). */
export function SkillGroups({ groups }: { groups: SkillGroup[] }) {
  return (
    <div className={s.skills}>
      {groups.map((g) => (
        <div key={g.title}>
          <h3>{g.title}</h3>
          <ChipList lang={g.lang}>
            {g.items.map((x) => (
              <Chip as="li" key={x}>
                {x}
              </Chip>
            ))}
          </ChipList>
        </div>
      ))}
    </div>
  );
}
