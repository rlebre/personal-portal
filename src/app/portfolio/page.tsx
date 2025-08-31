import { Github, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    title: "LightLex",
    image: "/images/portfolio/lightlex.png",
    description:
      "A lightweight app built to run in low end devices such as TVs. It mimics the former Plex TV app layout with a performant framework: LightningJS",
    github: "https://github.com/rlebre/lightlex",
    demo: "https://ruilebre.com/lightlex",
  },
  {
    title: "LightningJS TicTacToe",
    image: "/images/portfolio/lightningjs-tictactoe.png",
    description:
      "A fast, interactive Tic Tac Toe game for TV built with LightningJS.",
    github: "https://github.com/rlebre/lightningjs-tictactoe",
    demo: "https://rlebre.github.io/lightningjs-tictactoe/",
  },
  {
    title: "Dicoogle Website",
    image: "/images/portfolio/dicoogle-website.png",
    description: "Official website for Dicoogle, an open-source PACS archive.",
    github: "https://github.com/rlebre/dicoogle-website",
    demo: "https://dicoogle.com",
  },
  {
    title: "Lost Heritage",
    image: "/images/portfolio/lost-heritage.png",
    description:
      "A project to document and visualize lost cultural heritage sites in Portugal. This project was covered in the media and supported by Maria Manuel Leitão, a MEP in the period 2019-2024.",
    github: "https://github.com/rlebre/lost-heritage",
    demo: "https://lostheritage.ruilebre.com",
  },
  {
    title: "Old Website",
    image: "/images/portfolio/old-website.png",
    description:
      "The previous personal portal used in the domain ruilebre.com. Built with Next.JS.",
    github: "https://github.com/rlebre/personal-portal",
    demo: "https://ruilebre.com",
  },
];

function ProjectCard({ project }: { project: (typeof projects)[0] }) {
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
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 transition-colors"
          >
            <Github className="w-4 h-4 mr-1" /> GitHub
          </Link>
          {project.demo && (
            <Link
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-200 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-1" /> Live Demo
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-8">Portfolio</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {projects.map((project, idx) => (
          <ProjectCard key={idx} project={project} />
        ))}
      </div>
    </div>
  );
}
