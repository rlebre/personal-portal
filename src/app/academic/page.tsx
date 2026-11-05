import Link from "next/link";
import type { Metadata } from "next";
import {
  journalPublications,
  bookChapterPublications,
  conferencePublications,
} from "@/data/publications";
import { experience } from "@/data/experience";
import { education } from "@/data/education";
import { skills } from "@/data/skills";
import Publication from "@/components/academic/Publication";
import ExperienceItem from "@/components/academic/ExperienceItem";
import EducationItem from "@/components/academic/EducationItem";
import SkillsList from "@/components/academic/SkillsList";

export const metadata: Metadata = {
  title: "Academic",
  description:
    "Academic background, publications, and experience of Rui Lebre.",
};

export default function AcademicPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Academic</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">About</h2>
        <p className="mb-2 font-mono">
          <Link href="mailto:ruilebre@ua.pt" className="underline">
            ruilebre@ua.pt
          </Link>
          <br />
          <span>PhD @ University of A Coruña</span>
        </p>
        <p className="mb-2">
          This section describes my academic journey, since the beginning of my
          studies until I graduated and obtained my PhD later on.
        </p>
        <p className="mb-2">
          My interests in engineering started at an early age and converged to
          computer fields at sixteen. Two years later, I began my academic
          journey, leading to a Masters degree. During my Masters at University
          of Aveiro, Portugal, my interests in medical informatics and software
          grew, and in 2016 I started collaborating with UA.PT Bioinformatics.
          The first project as a junior researcher was developing a web DICOM
          viewer for Digital Pathology. I also developed a Role-Based Access
          Control for general Picture Archiving and Communication Systems.
        </p>
        <p className="mb-2">
          I applied my experience exploring profile-based, decentralized, and
          blockchain systems to improve healthcare. While pursuing the PhD
          dream, I have also mentored Masters students and junior researchers.
        </p>
        <p className="mb-2">
          The journey ended in 2022, when after writing the thesis entitled{" "}
          <i>Profile-based sharing of medical imaging data</i>, I decided to
          switch gears and join in a company working in the streaming world.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Skills</h2>
        <SkillsList skills={skills} />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Publications</h2>

        <h3 className="text-lg font-bold mt-4 mb-1">Journal</h3>
        <ul className="list-disc ml-6 mb-2 text-sm space-y-4">
          {journalPublications.map((pub) => (
            <Publication key={pub.title} pub={pub} />
          ))}
        </ul>

        <h3 className="text-lg font-bold mt-4 mb-1">Book Chapter</h3>
        <ul className="list-disc ml-6 mb-2 text-sm space-y-4">
          {bookChapterPublications.map((pub) => (
            <Publication key={pub.title} pub={pub} />
          ))}
        </ul>

        <h3 className="text-lg font-bold mt-4 mb-1">Conference</h3>
        <ul className="list-disc ml-6 text-sm space-y-4">
          {conferencePublications.map((pub) => (
            <Publication key={pub.title} pub={pub} />
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Experience</h2>
        <ul className="list-disc ml-6 text-sm space-y-4">
          {experience.map((item) => (
            <ExperienceItem key={`${item.role}-${item.period}`} item={item} />
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Education</h2>
        <ul className="list-disc ml-6 text-sm space-y-4">
          {education.map((item) => (
            <EducationItem key={`${item.degree}-${item.period}`} item={item} />
          ))}
        </ul>
      </section>
    </div>
  );
}
