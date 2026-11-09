"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  X,
  Maximize2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  ICETITE24_PHOTOS,
  type Icetite24Photo,
} from "@/data/icetite24GalleryData";
import { ICETITE24_MAIN_PHOTOS } from "@/data/icetite24MainPhotos";

type HomeMomentPhoto = Pick<
  Icetite24Photo,
  "id" | "image" | "title" | "badge" | "caption"
> & {
  thumbnail: string;
};

function getOptimizedImagePath(imagePath: string) {
  const relativePath = imagePath.replace(/^\/+/, "");
  const webpPath = relativePath.replace(/\.[^.]+$/, ".webp");

  return `/optimized/${webpPath}`;
}

const HOME_MOMENT_PHOTOS: HomeMomentPhoto[] = [
  ...ICETITE24_PHOTOS.slice(0, 8).map((photo) => ({
    id: photo.id,
    image: photo.image,
    thumbnail: getOptimizedImagePath(photo.image),
    title: photo.title,
    badge: photo.badge ?? photo.categoryLabel,
    caption: photo.caption,
  })),
  ...ICETITE24_MAIN_PHOTOS.slice(0, 8).map((photo) => ({
    id: `main-${photo.id}`,
    image: photo.src,
    thumbnail: getOptimizedImagePath(photo.src),
    title: photo.title,
    badge: "Main Gallery",
    caption: "From the main ic-ETITE'24 photo collection.",
  })),
];

// Subtle alternating tilt angles for natural art gallery frame look
const TILT_ANGLES = [
  "-rotate-1.5",
  "rotate-2",
  "-rotate-1",
  "rotate-1.5",
  "-rotate-2",
  "rotate-1",
  "-rotate-1.5",
  "rotate-2",
  "-rotate-2",
  "rotate-1.5",
];

export default function HomePhotoMoments({
  showHeading = true,
}: {
  showHeading?: boolean;
}) {
  const [activePhoto, setActivePhoto] = useState<HomeMomentPhoto | null>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const moveMarquee = (direction: "left" | "right") => {
    const animation = marqueeRef.current?.getAnimations()[0];
    if (!animation) return;

    const duration =
      Number(animation.effect?.getComputedTiming().duration) || 55000;

    const currentTime = Number(animation.currentTime) || 0;
    const step = 1800;
    const delta = direction === "left" ? step : -step;

    animation.currentTime =
      ((currentTime + delta) % duration + duration) % duration;
  };

  const duplicatedPhotos = [...HOME_MOMENT_PHOTOS, ...HOME_MOMENT_PHOTOS];

  const openLightbox = (photo: HomeMomentPhoto) => {
    setActivePhoto(photo);
  };

  const closeLightbox = () => {
    setActivePhoto(null);
  };

  return (
    <section className="bg-gradient-to-b from-[#FAFBFD] via-white to-[#FAFBFD] border-b border-[#E2E8F0] py-16 md:py-24 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[300px] bg-sky-200/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[300px] bg-amber-100/30 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full relative z-10">
        
        {/* Optional Section Heading */}
        {showHeading && (
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 px-4">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#002147]">
              Moments from ic-ETITE&apos;24
            </h2>
          </div>
        )}

        {/* Continuous Scrolling Frames Track (Auto-scrolls & pauses on hover) */}
        <div className="relative w-full overflow-hidden py-6 group/track">

          {/* Left and right edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#FAFBFD] via-[#FAFBFD]/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#FAFBFD] via-[#FAFBFD]/80 to-transparent z-20 pointer-events-none" />

          {/* Left arrow: reverse the marquee direction */}
          <button
            type="button"
            aria-label="Move photos left"
            onClick={() => moveMarquee("left")}
            className="absolute left-3 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/80 p-3 text-white shadow-lg transition hover:bg-cyan-500"
          >
            <ChevronLeft size={26} />
          </button>

          {/* Right arrow: move the marquee in reverse */}
          <button
            type="button"
            aria-label="Move photos right"
            onClick={() => moveMarquee("right")}
            className="absolute right-3 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/80 p-3 text-white shadow-lg transition hover:bg-cyan-500"
          >
            <ChevronRight size={26} />
          </button>

          {/* Continuous marquee */}
          <div
            ref={marqueeRef}
            className="flex gap-6 sm:gap-8 w-max animate-frame-scroll group-hover/track:[animation-play-state:paused] px-4"
          >
            {duplicatedPhotos.map((photo, index) => {
              const tilt = TILT_ANGLES[index % TILT_ANGLES.length];

              return (
                <div
                  key={`${photo.id}-${index}`}
                  onClick={() => openLightbox(photo)}
                  className="shrink-0 w-[290px] sm:w-[360px] md:w-[420px] transition-transform duration-300 ease-out cursor-pointer group/frame"
                >
                  <div
                    className={`bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border-2 border-slate-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out group-hover/frame:rotate-0 group-hover/frame:-translate-y-2 group-hover/frame:scale-[1.02] group-hover/frame:z-30 relative ${tilt}`}
                  >
                    <div className="relative aspect-[3/2] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                      <Image
                        src={photo.thumbnail}
                        alt={photo.title}
                        fill
                        sizes="(max-width: 640px) 290px, (max-width: 1024px) 360px, 420px"
                        quality={60}
                        loading={index < 2 ? "eager" : "lazy"}
                        priority={index < 2}
                        className="object-cover object-center group-hover/frame:scale-105 transition-transform duration-300 ease-out"
                      />

                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent opacity-0 group-hover/frame:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div className="absolute bottom-3 right-3 opacity-0 group-hover/frame:opacity-100 transition-opacity duration-300">
                        <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center shadow-lg">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox Modal (Clean, no clutter) */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-10 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-5xl w-full bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/30 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close photo"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Main Image View */}
            <div className="relative w-full aspect-[3/2] max-h-[75vh] bg-black flex items-center justify-center overflow-hidden">
              <Image
                src={activePhoto.image}
                alt={activePhoto.title || "ic-ETITE'24 photograph full view"}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain"
                priority
              />
            </div>

            {/* Photo Caption Footer */}
            <div className="p-4 sm:p-5 bg-slate-900 border-t border-white/10 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFB81C] text-[#002147] text-[11px] font-bold uppercase tracking-wider">
                  {activePhoto.badge}
                </span>
                <h3 className="font-semibold text-sm sm:text-base text-white">
                  {activePhoto.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activePhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes frameMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-frame-scroll {
          animation: frameMarquee 35s linear infinite;
        }
      `}</style>

    </section>
  );
}
