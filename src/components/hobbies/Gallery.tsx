import type { StaticImageData } from "next/image";
import { thumbOf } from "@/lib/images";
import { GalleryClient, type GalleryLabels } from "./GalleryClient";

export type { GalleryLabels };

/**
 * Photo gallery: the grid shows 760 px thumbnails, the lightbox the full-size `photos`. Server
 * component, so the client only receives the thumbnails (with their blur placeholders) and the
 * bare src/size of each full photo.
 */
export function Gallery({ photos, alts, labels }: { photos: StaticImageData[]; alts: string[]; labels: GalleryLabels }) {
  return (
    <GalleryClient
      thumbs={photos.map(thumbOf)}
      full={photos.map(({ src, width, height }) => ({ src, width, height }))}
      alts={alts}
      labels={labels}
    />
  );
}
