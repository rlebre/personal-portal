import { z } from "zod";

export const postFrontmatter = z.object({
  title: z.string().min(1),
  date: z.iso.date(),
  updated: z.iso.date().optional(),
  lang: z.enum(["en", "pt"]),
  tags: z.array(z.string()).default([]),
  summary: z.string().min(1),
  cover: z.string().optional(),
  draft: z.boolean().default(false),
  /** Placeholder content shown with a "Sample" badge until real posts exist. */
  sample: z.boolean().default(false),
});
export type PostFrontmatter = z.infer<typeof postFrontmatter>;

export const publication = z.object({
  y: z.number(),
  type: z.enum(["journal", "conference", "chapter"]),
  a: z.array(z.string()),
  ti: z.string(),
  v: z.string(),
  doi: z.string().optional(),
});
export type Publication = z.infer<typeof publication>;

export const trail = z.object({
  n: z.string(),
  sub: z.string(),
  where: z.string(),
  act: z.enum(["hike", "bike"]),
  type: z.enum(["loop", "oneway", "outback"]),
  km: z.number(),
  gain: z.number(),
  max: z.number(),
  min: z.number(),
  diff: z.enum(["Easy", "Moderate", "Difficult"]),
  date: z.string(),
  views: z.number(),
  u: z.url(),
});
export type Trail = z.infer<typeof trail>;

/** One entry of the full Wikiloc log (data/allTrails.json, all trails, scraped Nov 2026). */
export const loggedTrail = z.object({
  id: z.string(),
  name: z.string(),
  activity: z.enum(["hiking", "bike-touring", "gravel-bike", "mountain-biking"]),
  distanceKm: z.number(),
  gainM: z.number(),
  maxElevationM: z.number(),
  type: z.enum(["loop", "out-and-back", "one-way"]),
  difficulty: z.enum(["easy", "moderate", "difficult", "very-difficult"]),
  /** "YYYY-MM" */
  recorded: z.string().regex(/^\d{4}-\d{2}$/),
  views: z.number(),
  place: z.string(),
  /** ISO 3166-1 alpha-2 */
  country: z.string().length(2),
  url: z.url(),
});
export type LoggedTrail = z.infer<typeof loggedTrail>;

export const route = z.object({
  id: z.string(),
  d: z.string(),
  k: z.number(),
  s: z.tuple([z.number(), z.number()]),
  e: z.tuple([z.number(), z.number()]),
  prof: z.array(z.number()),
});
export type Route = z.infer<typeof route>;

export const project = z.object({
  n: z.string(),
  d: z.string(),
  tags: z.array(z.string()),
  u: z.url(),
  g: z.enum(["lens", "nodes", "grid", "globe", "peak", "house", "tv"]),
});
export type Project = z.infer<typeof project>;

/** Keys of `shots` in lib/images.ts (typed there as Record<ShotKey, …>, so the two stay in sync). */
export const shotKey = z.enum(["hunt", "trilhos", "maispinhal", "lostHeritage", "lightlex", "tictactoe"]);
export type ShotKey = z.infer<typeof shotKey>;

export const sideProject = z
  .object({
    n: z.string(),
    stack: z.array(z.string()),
    badge: z.enum(["Live", "In the media"]).optional(),
    d: z.string(),
    d_pt: z.string(),
    u: z.url(),
    /** Screenshot key; null renders the drawn TV-grid placeholder. */
    shot: shotKey.nullable(),
    shotAlt: z.string().optional(),
    shotAlt_pt: z.string().optional(),
    note: z.string().optional(),
  })
  .refine((p) => !p.shot || (p.shotAlt && p.shotAlt_pt), { message: "a side project with a screenshot needs shotAlt and shotAlt_pt" });
export type SideProject = z.infer<typeof sideProject>;
