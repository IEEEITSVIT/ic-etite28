"use client";

import { useEffect, useRef } from "react";
import Image from "@/components/cms/EImage";
import { PhotoItem } from "@/data/photos";

interface MarqueeGalleryProps {
  photos: PhotoItem[];
  speed?: number; // pixels per second
}

export default function MarqueeGallery({ photos, speed = 80 }: MarqueeGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const rafRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Width of one set of photos (half the track, since we doubled them)
    const halfWidth = track.scrollWidth / 2;

    function step(timestamp: number) {
      if (!pausedRef.current) {
        if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
        const delta = (timestamp - lastTimeRef.current) / 1000; // seconds
        lastTimeRef.current = timestamp;

        xRef.current += speed * delta;

        // Seamless loop: when we've scrolled one full set, snap back
        if (xRef.current >= halfWidth) {
          xRef.current -= halfWidth;
        }

        if (track) {
          track.style.transform = `translateX(-${xRef.current}px)`;
        }
      } else {
        lastTimeRef.current = null; // reset timer when paused
      }

      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [speed]);

  if (!photos || photos.length === 0) return null;

  // Double photos for seamless loop
  const doubled = [...photos, ...photos];

  return (
    <div
      className="relative w-full overflow-hidden py-6"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #FAFBFD, transparent)" }} />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #FAFBFD, transparent)" }} />

      {/* Scrolling track */}
      <div
        ref={trackRef}
        className="flex gap-5"
        style={{ width: "max-content", willChange: "transform" }}
      >
        {doubled.map((photo, idx) => (
          <div
            key={`${photo.id}-${idx}`}
            className="relative shrink-0 rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
            style={{ width: "360px", height: "270px" }}
          >
            <Image
              src={photo.src}
              alt={photo.title}
              fill
              sizes="360px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
