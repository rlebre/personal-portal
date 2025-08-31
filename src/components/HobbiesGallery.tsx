"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Visually hidden utility
function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

export type Photo = {
  src: string;
  alt: string;
  title: string;
  description: string;
};

function getAspect(src: string): "landscape" | "portrait" {
  try {
    const url = new URL(
      src,
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost"
    );
    const w = url.searchParams.get("w");
    const h = url.searchParams.get("h");
    if (w && h) {
      return Number(w) >= Number(h) ? "landscape" : "portrait";
    }
  } catch {}
  // fallback: treat as landscape
  return "landscape";
}

export default function HobbiesGallery({ photos }: { photos: Photo[] }) {
  const [selected, setSelected] = useState<number | null>(null);

  // Keyboard navigation for modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (selected === null) return;
      if (e.key === "ArrowLeft" && selected > 0) {
        setSelected(selected - 1);
      } else if (e.key === "ArrowRight" && selected < photos.length - 1) {
        setSelected(selected + 1);
      }
    }
    if (selected !== null) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [selected, photos.length]);

  return (
    <>
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 [column-fill:_balance]">
        {photos.map((photo, idx) => {
          const aspect = getAspect(photo.src);
          return (
            <button
              key={idx}
              className="mb-4 break-inside-avoid rounded-lg shadow overflow-hidden focus:outline-none cursor-pointer"
              onClick={() => setSelected(idx)}
              aria-label={`View ${photo.title}`}
              tabIndex={0}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={aspect === "landscape" ? 600 : 400}
                height={aspect === "landscape" ? 400 : 600}
                className="object-cover w-full h-auto"
                unoptimized
              />
            </button>
          );
        })}
      </div>
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        {selected !== null &&
          (() => {
            const aspect = getAspect(photos[selected].src);
            return (
              <DialogContent className="w-full flex flex-col md:flex-row overflow-auto p-0 md:max-w-[75vw]">
                <DialogTitle asChild>
                  <VisuallyHidden>{photos[selected].title}</VisuallyHidden>
                </DialogTitle>
                <div
                  className={
                    `relative flex items-center justify-center max-h-[90vh] p-4 bg-white min-w-0` +
                    (aspect === "landscape" ? "" : "")
                  }
                  style={{
                    flexBasis: "0 1 80%",
                    maxWidth: "calc(100% - 20rem)",
                  }}
                >
                  {selected > 0 && (
                    <button
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 hover:bg-background focus:outline-none cursor-pointer"
                      onClick={() => setSelected(selected - 1)}
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-7 h-7" />
                    </button>
                  )}
                  <Image
                    src={photos[selected].src.replace(
                      /w=\d+&h=\d+/,
                      aspect === "landscape" ? "w=2000&h=1333" : "w=1333&h=2000"
                    )}
                    alt={photos[selected].alt}
                    width={aspect === "landscape" ? 2000 : 1333}
                    height={aspect === "landscape" ? 1333 : 2000}
                    className="object-contain max-h-[82vh]"
                    style={{ maxWidth: "calc(100% - 20rem)" }}
                    unoptimized
                  />
                  {selected < photos.length - 1 && (
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 hover:bg-background focus:outline-none cursor-pointer"
                      onClick={() => setSelected(selected + 1)}
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-7 h-7" />
                    </button>
                  )}
                </div>
                <div className="w-full md:w-80 min-w-[20rem] max-w-[20rem] flex-shrink-0 p-6 flex flex-col gap-4 bg-background overflow-auto max-h-[80vh]">
                  <h2 className="text-xl font-bold">
                    {photos[selected].title}
                  </h2>
                  <p className="text-muted-foreground">
                    {photos[selected].description}
                  </p>
                  <button
                    className="mt-auto px-4 py-2 rounded bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                    onClick={() => setSelected(null)}
                  >
                    Close
                  </button>
                </div>
              </DialogContent>
            );
          })()}
      </Dialog>
    </>
  );
}
