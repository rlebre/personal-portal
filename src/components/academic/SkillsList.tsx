import type { SkillCategory } from "@/data/skills";

export default function SkillsList({ skills }: { skills: SkillCategory[] }) {
  return (
    <>
      {skills.map((skill) => (
        <div key={skill.category} className="mb-2">
          <strong>{skill.category}:</strong> {skill.items}
        </div>
      ))}
    </>
  );
}
