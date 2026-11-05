import { z } from "zod";
import pubsJson from "@/data/publications.json";
import trailsJson from "@/data/trails.json";
import routesJson from "@/data/routes.json";
import projectsJson from "@/data/projects.json";
import sideJson from "@/data/sideProjects.json";
import photoAltJson from "@/data/photoAlt.json";
import { project, publication, route, sideProject, trail } from "./schemas";

// Parsed at build time: a malformed data file fails the build instead of rendering broken cards.
export const publications = z.array(publication).parse(pubsJson);
export const trails = z.array(trail).parse(trailsJson);
export const trailRoutes = z.array(route).parse(routesJson);
export const projects = z.array(project).parse(projectsJson);
export const sideProjects = z.array(sideProject).parse(sideJson);
export const photoAlt = z.object({ en: z.array(z.string()), pt: z.array(z.string()) }).parse(photoAltJson);

export function routeFor(trailUrl: string) {
  return trailRoutes.find((r) => trailUrl.endsWith(r.id));
}

export const pubStats = {
  total: publications.length,
  journal: publications.filter((p) => p.type === "journal").length,
  conference: publications.filter((p) => p.type === "conference").length,
};
