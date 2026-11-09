import { z } from "zod";
import pubsJson from "@/data/publications.json";
import trailsJson from "@/data/trails.json";
import allTrailsJson from "@/data/allTrails.json";
import routesJson from "@/data/routes.json";
import projectsJson from "@/data/projects.json";
import sideJson from "@/data/sideProjects.json";
import photoAltJson from "@/data/photoAlt.json";
import { loggedTrail, project, publication, route, sideProject, trail } from "./schemas";

// Parsed at build time: a malformed data file fails the build instead of rendering broken cards.
export const publications = z.array(publication).parse(pubsJson);
export const trails = z.array(trail).parse(trailsJson);
export const trailRoutes = z.array(route).parse(routesJson);
/** Every trail on Wikiloc, most viewed first. */
export const allTrails = z.array(loggedTrail).parse(allTrailsJson).sort((a, b) => b.views - a.views);
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

/** Totals over the whole Wikiloc log: the stats line on Hobbies and All trails. */
export const trailStats = {
  count: allTrails.length,
  km: Math.round(allTrails.reduce((sum, x) => sum + x.distanceKm, 0)),
  gain: allTrails.reduce((sum, x) => sum + x.gainM, 0),
  countries: new Set(allTrails.map((x) => x.country)).size,
};

/** How many trails get a full card on Hobbies; the rest are on All trails. */
export const FEATURED_TRAILS = 5;
