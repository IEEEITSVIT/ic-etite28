"use client";

import { useState } from "react";
import Image from "@/components/cms/EImage";
import { PhotoItem } from "@/data/photos";
import { X, ChevronLeft, ChevronRight, ZoomIn, Camera } from "lucide-react";
import E from "@/components/cms/E";

interface PhotoGridModalProps {
  photos: PhotoItem[];
  title?: string;
  subtitle?: string;
  theme?: "light" | "dark";
}

export default function PhotoGridModal({ photos, title, subtitle, theme = "light" }: PhotoGridModalProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openModal = (index: number) => setSelectedIndex(index);
  const closeModal = () => setSelectedIndex(null);

  const prevPhoto = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length);
  };

  const nextPhoto = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % photos.length);
  };

  const isDark = theme === "dark";

  return (
    <div>
      {title && (
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold mb-2 uppercase tracking-wider ${
              isDark
                ? "bg-white/10 border border-white/20 text-[#CCFF00]"
                : "bg-[#EBF3F8] border border-brand-secondary/30 text-brand-secondary"
            }`}
          >
            <Camera className={`w-3.5 h-3.5 ${isDark ? "text-[#CCFF00]" : "text-brand-secondary"}`} />
            <span><E f="c.PhotoGridModal">{"Official Photo Archive"}</E></span>
          </div>
          <h2
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-brand-primary"
            }`}
          >
            <E f="c.PhotoGridModal">{title}</E>
          </h2>
          {subtitle && (
            <p
              className={`text-sm sm:text-base mt-2 leading-relaxed ${
                isDark ? "text-white/80" : "text-slate-600"
              }`}
            >
              <E f="c.PhotoGridModal">{subtitle}</E>
            </p>
          )}
        </div>
      )}

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {photos.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => openModal(idx)}
            className="group relative rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-200 hover:border-brand-secondary shadow-sm hover:shadow-lg transition-all cursor-pointer aspect-[4/3]"
          >
            <Image
              src={item.src}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {/* Clean Hover Effect */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-lg">
                <ZoomIn className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={closeModal}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Bar */}
            <div className="w-full flex items-center justify-between pb-3 text-white">
              <div className="text-xs sm:text-sm font-medium text-white/80"><E f="c.PhotoGridModal">{"Photo "}</E>{selectedIndex + 1}<E f="c.PhotoGridModal">{" of "}</E><E f="c.PhotoGridModal">{photos.length}</E>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close photo preview"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Image Container */}
            <div className="relative w-full h-[65vh] sm:h-[75vh] rounded-2xl overflow-hidden bg-black/50 border border-white/15">
              <Image
                src={photos[selectedIndex].src}
                alt={photos[selectedIndex].title || "Conference Photo"}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain"
                priority
              />

              {/* Prev Button */}
              <button
                onClick={prevPhoto}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all hover:scale-110 cursor-pointer border border-white/20"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={nextPhoto}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all hover:scale-110 cursor-pointer border border-white/20"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
