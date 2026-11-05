"use client";

import Image, { type StaticImageData } from "next/image";
import { useId, useRef, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { ChevronLeft, ChevronRight, Close } from "@/components/ui/icons";
import { cx } from "@/components/ui/cx";
import { interpolate } from "@/lib/locale";
import s from "./Gallery.module.css";

export type GalleryLabels = { close: string; prev: string; next: string; /** "Photo {i} of {n}" */ of: string };

/** A full-size photo for the lightbox: just what an <img> needs (no blur placeholder in the payload). */
export type FullPhoto = { src: string; width: number; height: number };

/**
 * Masonry of photo buttons (760 px thumbnails); each opens a keyboard-navigable lightbox showing the
 * full-size photo, which returns focus to its thumbnail.
 */
/**
 * Prev/next swap: once the new photo has loaded, it slides 10px in from the direction of travel and
 * fades up from .4 (never from 0, so there's no blank frame). Opening the lightbox doesn't slide
 * (the dialog has its own entrance); nothing moves under reduced motion.
 */
function slideIn(img: HTMLImageElement, travel: { current: number }) {
  const d = travel.current;
  travel.current = 0;
  if (!d || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  img.animate([{ opacity: 0.4, translate: `${d * 10}px 0` }, { opacity: 1, translate: "0 0" }], { duration: 240, easing: "cubic-bezier(.22,1,.36,1)" });
}

export function GalleryClient({ thumbs, full, alts, labels }: { thumbs: StaticImageData[]; full: FullPhoto[]; alts: string[]; labels: GalleryLabels }) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const countId = useId();
  const n = thumbs.length;
  // Direction of the last prev/next step (1 / -1): the next photo to load slides in from that side.
  const travel = useRef(0);
  const show = (i: number) => setIndex(((i % n) + n) % n);
  const step = (d: 1 | -1) => {
    travel.current = d;
    show(index + d);
  };
  const current = full[index];

  return (
    <>
      <div className={s.gallery}>
        {thumbs.map((p, i) => (
          <button
            key={p.src}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            className={s.thumb}
            type="button"
            onClick={() => {
              travel.current = 0;
              show(i);
              setOpen(true);
            }}
          >
            <Image src={p} alt={alts[i]} placeholder="blur" sizes="(max-width: 620px) 100vw, (max-width: 980px) 50vw, 380px" />
            <span className={cx(s.n, "mono")} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
      <Dialog
        open={open}
        className={s.lightbox}
        aria-labelledby={countId}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") step(-1);
          if (e.key === "ArrowRight") step(1);
        }}
        onClose={() => {
          setOpen(false);
          buttons.current[index]?.focus();
        }}
      >
        <div className={s.top}>
          <span id={countId} aria-live="polite" aria-atomic="true">
            {interpolate(labels.of, { i: index + 1, n })}
          </span>
          <button className={s.btn} type="button" aria-label={labels.close} onClick={() => setOpen(false)}>
            <Close />
          </button>
        </div>
        <div className={s.inner}>
          <button className={s.btn} type="button" aria-label={labels.prev} onClick={() => step(-1)}>
            <ChevronLeft />
          </button>
          <figure>
            {/* Lazy: a closed <dialog> is display:none, so nothing is fetched until the lightbox opens. */}
            {/* eslint-disable-next-line @next/next/no-img-element -- full-size swap inside a native dialog */}
            <img
              src={current.src}
              width={current.width}
              height={current.height}
              alt={alts[index]}
              loading="lazy"
              decoding="async"
              onLoad={(e) => slideIn(e.currentTarget, travel)}
            />
            {/* The alt text already carries the caption; don't read it twice. */}
            <figcaption aria-hidden="true">{alts[index]}</figcaption>
          </figure>
          <button className={s.btn} type="button" aria-label={labels.next} onClick={() => step(1)}>
            <ChevronRight />
          </button>
        </div>
      </Dialog>
    </>
  );
}
