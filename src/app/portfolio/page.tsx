import type { Metadata } from "next";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/portfolio/ProjectCard";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Projects and work by Rui Lebre.",
};

export default function PortfolioPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-8">Portfolio</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </div>
  );
}
