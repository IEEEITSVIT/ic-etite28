"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Camera,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Sparkles,
  Search,
  Filter,
  Layers,
} from "lucide-react";
import { ICETITE24_PHOTOS, Icetite24Photo } from "@/data/icetite24GalleryData";

type CategoryFilter = "all" | "dais" | "hackathon" | "expo" | "networking" | "keynote";

export default function Icetite24FullGallery() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePhoto, setActivePhoto] = useState<Icetite24Photo | null>(null);

  // Filtered photos based on tab and search
  const filteredPhotos = useMemo(() => {
    return ICETITE24_PHOTOS.filter((photo) => {
      const matchesCategory =
        selectedCategory === "all" || photo.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (photo.badge && photo.badge.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const openLightbox = (photo: Icetite24Photo) => {
    setActivePhoto(photo);
  };

  const closeLightbox = () => {
    setActivePhoto(null);
  };

  const navigateLightbox = useCallback(
    (direction: "prev" | "next") => {
      if (!activePhoto) return;
      const currentIndex = filteredPhotos.findIndex((p) => p.id === activePhoto.id);
      if (currentIndex === -1) return;

      if (direction === "prev") {
        const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
        setActivePhoto(filteredPhotos[prevIndex]);
      } else {
        const nextIndex = (currentIndex + 1) % filteredPhotos.length;
        setActivePhoto(filteredPhotos[nextIndex]);
      }
    },
    [activePhoto, filteredPhotos]
  );

  // Handle keyboard arrow keys and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activePhoto) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigateLightbox("prev");
      if (e.key === "ArrowRight") navigateLightbox("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhoto, navigateLightbox]);

  return (
    <div id="gallery" className="scroll-mt-20">
      {/* Controls Bar: Categories & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Moments" },
            { id: "dais", label: "Inaugural & Dais" },
            { id: "hackathon", label: "BOLT 2.0 Hackathon" },
            { id: "expo", label: "TechNext Expo" },
            { id: "networking", label: "Networking & Gala" },
            { id: "keynote", label: "Keynotes & Plenary" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as CategoryFilter)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#002147] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:text-[#002147] hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search moments, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:bg-white text-slate-800 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Photos */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Camera className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No matching photographs found</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting the filter or search query</p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#002147] text-white text-xs font-bold hover:bg-[#003366] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(photo)}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:border-[#004B87] hover:-translate-y-1"
            >
              {/* Photo Box with 3:2 Ratio */}
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-slate-100">
                <Image
                  src={photo.image}
                  alt={photo.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                  priority={index < 6}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {/* Badge Tag */}
                {photo.badge && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00142E]/85 backdrop-blur-md text-[#38BDF8] text-[10.5px] font-bold border border-white/20 tracking-wide">
                      <Sparkles className="w-2.5 h-2.5 text-[#38BDF8]" />
                      {photo.badge}
                    </span>
                  </div>
                )}

                {/* Quick Zoom Icon */}
                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/90">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Bottom Overlay Info on Image */}
                <div className="absolute inset-x-0 bottom-0 p-4 z-10 text-white">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-sky-300 drop-shadow-sm block mb-0.5">
                    {photo.categoryLabel}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-white leading-snug drop-shadow-md group-hover:text-sky-200 transition-colors line-clamp-1">
                    {photo.title}
                  </h3>
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white">
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {photo.caption}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 font-medium">
                  <span className="inline-flex items-center gap-1.5 truncate max-w-[210px]">
                    <MapPin className="w-3.5 h-3.5 text-[#004B87] shrink-0" />
                    <span className="truncate">{photo.location}</span>
                  </span>
                  <span className="text-[#004B87] font-bold group-hover:translate-x-0.5 transition-transform shrink-0">
                    Enlarge &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-10 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-5xl w-full bg-[#00142E] rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex flex-col max-h-[94vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-black/50 text-white">
              <div className="flex items-center gap-2.5 truncate">
                <span className="bg-[#00A3FF] text-[#00142E] text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shrink-0">
                  {activePhoto.edition}
                </span>
                <span className="text-white/80 text-xs sm:text-sm truncate font-medium">
                  {activePhoto.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={closeLightbox}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-1"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Image Area with Prev/Next Controls */}
            <div className="relative w-full aspect-[3/2] max-h-[66vh] bg-black/90 flex items-center justify-center overflow-hidden">
              <Image
                src={activePhoto.image}
                alt={activePhoto.title}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain"
                priority
              />

              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox("prev");
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105"
                aria-label="Previous photograph"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox("next");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105"
                aria-label="Next photograph"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Caption & Metadata Bottom Details */}
            <div className="p-5 bg-[#001838] border-t border-white/10 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h4 className="font-bold text-base sm:text-lg text-white">
                  {activePhoto.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-white/70">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#00A3FF]" />
                    {activePhoto.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#00A3FF]" />
                    22–23 Feb 2024
                  </span>
                </div>
              </div>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                {activePhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
