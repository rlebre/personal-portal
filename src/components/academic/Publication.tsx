import type { Publication as PublicationType } from "@/data/publications";

export default function Publication({ pub }: { pub: PublicationType }) {
  return (
    <li>
      {pub.authors.join(", ")} ({pub.year}).{" "}
      <strong>{pub.title}</strong>. <em>{pub.venue}</em>
      {pub.note && ` (${pub.note})`}.
    </li>
  );
}
