import type { Experience } from "@/data/experience";

export default function ExperienceItem({ item }: { item: Experience }) {
  return (
    <li>
      <strong>{item.role}</strong> – {item.organization}
      <br />
      {item.description}
      <br />
      <span className="text-muted-foreground">{item.period}</span>
    </li>
  );
}
