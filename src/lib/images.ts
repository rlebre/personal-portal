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
import avatarImg from "@/assets/avatar.webp";
import maispinhal from "@/assets/shots/maispinhal.webp";
import lostHeritage from "@/assets/shots/lost-heritage.webp";
import tictactoe from "@/assets/shots/tictactoe.webp";

/** Gallery photos in the same order as data/photoAlt.json. */
export const photos = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12];
/** 760 px wide versions of `photos` (same order): gallery grid and the small srcset candidate of blog photos. */
export const thumbs = [t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12];
/** The thumbnail for one of `photos` (itself when it isn't a gallery photo). */
export function thumbOf(photo: StaticImageData): StaticImageData {
  return thumbs[photos.indexOf(photo)] ?? photo;
}
export const avatar = avatarImg;
/** Side-project screenshots, keyed by `shot` in data/sideProjects.json. */
export const shots: Record<ShotKey, StaticImageData> = { maispinhal, lostHeritage, tictactoe };
