"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { FOLDER_GALLERY_PHOTOS } from "@/data/icetite24FolderGalleryData";

const INITIAL_COUNT = 16;
const BATCH_SIZE = 16;

export default function Icetite24PhotoGrid() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const visiblePhotos = FOLDER_GALLERY_PHOTOS.slice(0, visibleCount);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const showPrevious = useCallback(() => {
    setSelectedIndex((current) =>
      current === null
        ? null
        : (current - 1 + FOLDER_GALLERY_PHOTOS.length) % FOLDER_GALLERY_PHOTOS.length,
    );
  }, []);

  const showNext = useCallback(() => {
    setSelectedIndex((current) =>
      current === null ? null : (current + 1) % FOLDER_GALLERY_PHOTOS.length,
    );
  }, []);

  useEffect(() => {
    if (selectedIndex === null) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrevious();
      if (e.key === "ArrowRight") showNext();
    }

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedIndex, closeLightbox, showPrevious, showNext]);

  return (
    <div>
      {/* 4x4 Responsive Photo Grid (No Captions) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {visiblePhotos.map((photo, index) => (
          <button
            type="button"
            key={photo.src}
            onClick={() => setSelectedIndex(index)}
            className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 focus:outline-hidden focus:ring-2 focus:ring-[#002147] cursor-pointer"
            aria-label={`View photo ${index + 1}`}
          >
            <Image
              src={photo.src}
              alt={`ic-ETITE'24 photograph ${index + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              quality={75}
              loading={index < 8 ? "eager" : "lazy"}
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-108"
            />
            {/* Subtle Hover Overlay */}
            <div className="absolute inset-0 bg-[#002147]/0 group-hover:bg-[#002147]/25 transition-colors duration-300 flex items-center justify-center">
              <span className="w-10 h-10 rounded-full bg-white/90 text-[#002147] shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                <Maximize2 className="w-4 h-4" />
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Load More Option */}
      {visibleCount < FOLDER_GALLERY_PHOTOS.length && (
        <div className="text-center mt-10 sm:mt-12">
          <button
            type="button"
            onClick={() =>
              setVisibleCount((prev) =>
                Math.min(prev + BATCH_SIZE, FOLDER_GALLERY_PHOTOS.length),
              )
            }
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#002147] text-white font-semibold text-sm hover:bg-[#003366] active:scale-95 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            Load More Photos
          </button>
        </div>
      )}

      {/* Full Resolution Lightbox */}
      {selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-md p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative flex flex-col items-center max-w-5xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="w-full flex items-center justify-end text-white/80 pb-3 text-xs sm:text-sm font-medium">
              <button
                type="button"
                onClick={closeLightbox}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Container */}
            <div className="relative w-full aspect-[16/10] max-h-[78vh] rounded-2xl overflow-hidden bg-black/40 shadow-2xl border border-white/10">
              <Image
                src={FOLDER_GALLERY_PHOTOS[selectedIndex].src}
                alt={`Photo ${selectedIndex + 1}`}
                fill
                sizes="100vw"
                quality={90}
                className="object-contain"
                priority
              />
            </div>

            {/* Navigation Arrows */}
            <button
              type="button"
              onClick={showPrevious}
              className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-xl transition-all cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={showNext}
              className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-xl transition-all cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

