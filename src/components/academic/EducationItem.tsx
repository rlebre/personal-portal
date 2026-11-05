import type { Education } from "@/data/education";

export default function EducationItem({ item }: { item: Education }) {
  return (
    <li>
      <strong>{item.institution}</strong>
      <br />
      {item.degree}
      {item.details && (
        <>
          <br />
          {item.details}
        </>
      )}
      <br />
      <span className="text-muted-foreground">{item.period}</span>
    </li>
  );
}
