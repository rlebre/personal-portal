import { Github, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex flex-col h-full flex-1 min-w-0 rounded-lg shadow-lg border border-border bg-background hover:shadow-xl transition-shadow duration-200 overflow-hidden group">
      {project?.demo ? (
        <Link
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="aspect-[16/9] bg-muted flex items-center justify-center"
        >
          <Image
            src={project.image}
            alt={project.title}
            width={400}
            height={225}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
            style={{ aspectRatio: "16/9" }}
          />
        </Link>
      ) : (
        <div className="aspect-[16/9] bg-muted flex items-center justify-center">
          <Image
            src={project.image}
            alt={project.title}
            width={400}
            height={225}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
            style={{ aspectRatio: "16/9" }}
          />
        </div>
      )}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="text-lg font-semibold mb-1">{project.title}</div>
        <p className="text-muted-foreground text-sm leading-relaxed mb-2">
          {project.description}
        </p>
        <div className="flex gap-2 mt-auto">
          <Link
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border transition-colors"
          >
            <Github className="w-4 h-4 mr-1" /> GitHub
          </Link>
          {project.demo && (
            <Link
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-1" /> Live Demo
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
