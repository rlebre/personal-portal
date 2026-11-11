// Static imports of the WebP files that scripts/encode-images.mjs writes from /assets (run before dev/build).
import type { StaticImageData } from "next/image";
import type { ShotKey } from "./schemas";
import p1 from "@/assets/photos/1.webp";
import p2 from "@/assets/photos/2.webp";
import p3 from "@/assets/photos/3.webp";
import p4 from "@/assets/photos/4.webp";
import p5 from "@/assets/photos/5.webp";
import p6 from "@/assets/photos/6.webp";
import p7 from "@/assets/photos/7.webp";
import p8 from "@/assets/photos/8.webp";
import p9 from "@/assets/photos/9.webp";
import p10 from "@/assets/photos/10.webp";
import p11 from "@/assets/photos/11.webp";
import p12 from "@/assets/photos/12.webp";
import p13 from "@/assets/photos/13.webp";
import p14 from "@/assets/photos/14.webp";
import p15 from "@/assets/photos/15.webp";
import p16 from "@/assets/photos/16.webp";
import p17 from "@/assets/photos/17.webp";
import p18 from "@/assets/photos/18.webp";
import t1 from "@/assets/photos/thumb/1.webp";
import t2 from "@/assets/photos/thumb/2.webp";
import t3 from "@/assets/photos/thumb/3.webp";
import t4 from "@/assets/photos/thumb/4.webp";
import t5 from "@/assets/photos/thumb/5.webp";
import t6 from "@/assets/photos/thumb/6.webp";
import t7 from "@/assets/photos/thumb/7.webp";
import t8 from "@/assets/photos/thumb/8.webp";
import t9 from "@/assets/photos/thumb/9.webp";
import t10 from "@/assets/photos/thumb/10.webp";
import t11 from "@/assets/photos/thumb/11.webp";
import t12 from "@/assets/photos/thumb/12.webp";
import t13 from "@/assets/photos/thumb/13.webp";
import t14 from "@/assets/photos/thumb/14.webp";
import t15 from "@/assets/photos/thumb/15.webp";
import t16 from "@/assets/photos/thumb/16.webp";
import t17 from "@/assets/photos/thumb/17.webp";
import t18 from "@/assets/photos/thumb/18.webp";
import avatarImg from "@/assets/avatar.webp";
import cvImg from "@/assets/cv/cv.webp";
import maispinhal from "@/assets/shots/maispinhal.webp";
import lostHeritage from "@/assets/shots/lost-heritage.webp";
import lightlex from "@/assets/shots/lightlex.webp";
import tictactoe from "@/assets/shots/tictactoe.webp";
import map55748813 from "@/assets/maps/55748813.webp";
import map54357309 from "@/assets/maps/54357309.webp";
import map116186689 from "@/assets/maps/116186689.webp";
import map75050133 from "@/assets/maps/75050133.webp";
import map75232106 from "@/assets/maps/75232106.webp";
import map54134407 from "@/assets/maps/54134407.webp";

/** Gallery photos in the same order as data/photoAlt.json. */
export const photos = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18];
/** 760 px wide versions of `photos` (same order): gallery grid and the small srcset candidate of blog photos. */
export const thumbs = [t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15, t16, t17, t18];
/** The thumbnail for one of `photos` (itself when it isn't a gallery photo). */
export function thumbOf(photo: StaticImageData): StaticImageData {
  return thumbs[photos.indexOf(photo)] ?? photo;
}
export const avatar = avatarImg;
/** The CV PDF's page as an image, for the in-page viewer (scripts/render-cv.mjs). */
export const cvPage = cvImg;
/** Side-project screenshots, keyed by `shot` in data/sideProjects.json. */
export const shots: Record<ShotKey, StaticImageData> = { maispinhal, lostHeritage, lightlex, tictactoe };
/** OpenTopoMap backgrounds for the route maps, keyed by Wikiloc id (same projection as data/routes.json). */
export const trailMaps: Record<string, StaticImageData> = {
  "55748813": map55748813,
  "54357309": map54357309,
  "116186689": map116186689,
  "75050133": map75050133,
  "75232106": map75232106,
  "54134407": map54134407,
};
