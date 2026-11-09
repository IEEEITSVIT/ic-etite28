"use client";

import { useState } from "react";
import Image from "@/components/cms/EImage";
import { X, Maximize2 } from "lucide-react";
import { bolt20Photos } from "@/data/photos";
import E from "@/components/cms/E";

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

// All BOLT hackathon photos including stage awards
const boltGalleryPhotos = [
  {
    id: "bolt-stage-award-2024",
    src: "/images/icetite24/icetite24_18_bolt_hackathon_awards_stage.webp",
  },
  {
    id: "bolt-winners-dais-2024",
    src: "/images/icetite24/icetite24_19_bolt_winners_felicitation.webp",
  },
  ...bolt20Photos.map((p) => ({
    id: p.id,
    src: p.src,
  })),
];

export default function BoltPhotoMoments() {
  const [activePhotoSrc, setActivePhotoSrc] = useState<string | null>(null);

  // Duplicate items for a seamless, continuous infinite scroll loop
  const duplicatedPhotos = [...boltGalleryPhotos, ...boltGalleryPhotos];

  const openLightbox = (src: string) => {
    setActivePhotoSrc(src);
  };

  const closeLightbox = () => {
    setActivePhotoSrc(null);
  };

  return (
    <section className="bg-gradient-to-b from-brand-surface via-white to-brand-surface border-b border-brand-border py-16 md:py-24 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[300px] bg-[#CCFF00]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[300px] bg-sky-200/20 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full relative z-10">
        {/* Section Header: Just Heading, Centered, No Arrows */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 px-4">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-primary"><E f="c.BoltPhotoMoments">{"Moments from BOLT Hackathon"}</E></h2>
        </div>

        {/* Continuous Scrolling Frames Track (Auto-scrolls & pauses on hover) */}
        <div className="relative w-full overflow-hidden py-6 group/track">
          {/* Subtle edge fades for infinite marquee smoothness */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-brand-surface via-brand-surface/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-brand-surface via-brand-surface/80 to-transparent z-20 pointer-events-none" />

          {/* Marquee Track: pauses on hover so user can hover over and inspect any frame */}
          <div className="flex gap-6 sm:gap-8 w-max animate-bolt-frame-scroll group-hover/track:[animation-play-state:paused] px-4">
            {duplicatedPhotos.map((photo, index) => {
              const tilt = TILT_ANGLES[index % TILT_ANGLES.length];
              return (
                <div
                  key={`${photo.id}-${index}`}
                  onClick={() => openLightbox(photo.src)}
                  className="shrink-0 w-[290px] sm:w-[360px] md:w-[420px] transition-all duration-500 ease-out cursor-pointer group/frame"
                >
                  {/* Physical Art Frame: tilts naturally, straightens and lifts on hover */}
                  <div
                    className={`bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border-2 border-slate-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-500 ease-out group-hover/frame:rotate-0 group-hover/frame:-translate-y-4 group-hover/frame:scale-[1.04] group-hover/frame:border-brand-primary group-hover/frame:shadow-[0_25px_50px_rgba(0,33,71,0.24)] group-hover/frame:z-30 relative ${tilt}`}
                  >
                    {/* Inner Photo Container (Strictly NO text) */}
                    <div className="relative aspect-[3/2] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                      <Image
                        src={photo.src}
                        alt="BOLT Hackathon moment"
                        fill
                        sizes="(max-width: 640px) 290px, (max-width: 1024px) 360px, 420px"
                        className="object-cover object-center group-hover/frame:scale-108 transition-transform duration-700 ease-out"
                        priority={index < 4}
                      />

                      {/* Glass Sheen / Reflection on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent opacity-0 group-hover/frame:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      {/* Subtle hover expand icon */}
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
      {activePhotoSrc && (
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
            <div className="relative w-full aspect-[3/2] max-h-[85vh] bg-black flex items-center justify-center overflow-hidden">
              <Image
                src={activePhotoSrc}
                alt="BOLT Hackathon full photograph"
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* Keyframe animation for smooth continuous infinite scrolling */}
      <style jsx global>{`
        @keyframes boltFrameMarquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-bolt-frame-scroll {
          animation: boltFrameMarquee 60s linear infinite;
        }
      `}</style>
    </section>
  );
}
