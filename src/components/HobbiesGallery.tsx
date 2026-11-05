"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Photo } from "@/data/photos";

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
        {photos.map((photo, idx) => (
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
              width={600}
              height={400}
              className="object-cover w-full h-auto"
            />
          </button>
        ))}
      </div>
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        {selected !== null &&
          (() => {
            return (
              <DialogContent className="w-full flex flex-col md:flex-row overflow-auto p-0 md:max-w-[75vw]" showCloseButton={false}>
                <DialogTitle className="sr-only">{photos[selected].title}</DialogTitle>
                <div
                  className="relative flex items-center justify-center max-h-[90vh] p-4 bg-background min-w-0"
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
                    src={photos[selected].src}
                    alt={photos[selected].alt}
                    width={2000}
                    height={1333}
                    className="object-contain max-h-[82vh]"
                    style={{ maxWidth: "calc(100% - 20rem)" }}
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
