"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  FOLDER_GALLERY_CATEGORIES,
  FOLDER_GALLERY_PHOTOS,
  type FolderGalleryPhoto,
} from "@/data/icetite24FolderGalleryData";
import { getIcetite24PhotoTitle } from "@/data/icetite24PhotoTitles";

export default function Icetite24FolderGallery() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [visiblePhotoCount, setVisiblePhotoCount] = useState(12);

  const filteredPhotos = useMemo(() => {
    const term = search.trim().toLowerCase();

    return FOLDER_GALLERY_PHOTOS.filter((photo) => {
      const matchesCategory =
        activeCategory === "all" || photo.category === activeCategory;

      const matchesSearch =
        !term ||
        photo.title.toLowerCase().includes(term) ||
        photo.category.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const selectedPhoto: FolderGalleryPhoto | null =
    selectedIndex !== null ? filteredPhotos[selectedIndex] ?? null : null;
  const visiblePhotos = filteredPhotos.slice(0, visiblePhotoCount);

  function closeLightbox() {
    setSelectedIndex(null);
  }

  function showPrevious() {
    setSelectedIndex((current) =>
      current === null
        ? null
        : (current - 1 + filteredPhotos.length) % filteredPhotos.length,
    );
  }

  function showNext() {
    setSelectedIndex((current) =>
      current === null ? null : (current + 1) % filteredPhotos.length,
    );
  }

  useEffect(() => {
    if (selectedIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedIndex, filteredPhotos.length]);

  useEffect(() => {
    setSelectedIndex(null);
    setVisiblePhotoCount(12);
  }, [activeCategory, search]);

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-24 -z-10 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-64 -z-10 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl" />

      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            IC-ETITE’24 Memories
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Conference Photo Gallery
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Explore moments from the inaugural ceremony, technical sessions,
            keynote talks, hackathon, panel discussions, dinner and valedictory.
          </p>
        </div>

        <div className="mb-5 mt-4 flex justify-center sm:justify-end">
          <div className="relative w-full max-w-xs">
            <label htmlFor="gallery-search" className="sr-only">
              Search photos
            </label>
            <input
              id="gallery-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search moments..."
              className="w-full rounded-full border border-slate-200 bg-white/90 py-2.5 pl-4 pr-10 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              ⌕
            </span>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2 lg:flex-nowrap">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            activeCategory === "all"
              ? "bg-blue-700 text-white shadow"
              : "border border-slate-200 bg-white/80 text-slate-700 shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
          }`}
        >
          All Photos
        </button>

        {FOLDER_GALLERY_CATEGORIES.map((category) => (
          <button
            type="button"
            key={category.slug}
            onClick={() => setActiveCategory(category.slug)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeCategory === category.slug
                ? "bg-blue-700 text-white shadow"
                : "border border-slate-200 bg-white/80 text-slate-700 shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {filteredPhotos.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visiblePhotos.map((photo, index) => (
            <button
              type="button"
              key={photo.src}
              onClick={() => setSelectedIndex(index)}
              className="group overflow-hidden rounded-3xl bg-white text-left shadow-[0_8px_30px_rgba(15,23,42,0.07)] ring-1 ring-slate-200/70 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_55px_rgba(15,23,42,0.16)] hover:ring-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`View photo: ${getIcetite24PhotoTitle(photo.src, photo.title)}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <Image
                  src={photo.src}
                  alt={getIcetite24PhotoTitle(photo.src, photo.title)}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  quality={60}
                  loading="lazy"
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-slate-950/65 px-3 py-1.5 text-xs font-semibold tracking-wide text-white shadow-lg backdrop-blur-md">
                  {FOLDER_GALLERY_CATEGORIES.find(
                    (category) => category.slug === photo.category,
                  )?.label ?? photo.category}
                </span>
                <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/20 text-white opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
                  ↗
                </span>
              </div>
              <div className="min-h-[100px] p-5">
                <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-blue-800">
                  {getIcetite24PhotoTitle(photo.src, photo.title)}
                </h3>
                <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors group-hover:text-blue-700">
                  View photo <span aria-hidden="true">↗</span>
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center">
          <p className="text-lg font-semibold text-gray-800">No photos found</p>
          <p className="mt-2 text-gray-600">
            Try another search or choose a different category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setActiveCategory("all");
            }}
            className="mt-4 rounded-full bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Clear filters
          </button>
        </div>
      )}

      {visiblePhotoCount < filteredPhotos.length && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() =>
              setVisiblePhotoCount((count) => count + 12)
            }
            className="rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-800"
          >
            Load more photos
          </button>
        </div>
      )}

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close photo viewer"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-3xl text-white hover:bg-white/25"
          >
            ×
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-3xl text-white hover:bg-white/25 sm:left-6"
          >
            ‹
          </button>

          <div
            className="flex max-h-full w-full max-w-6xl flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedPhoto.src}
              alt={getIcetite24PhotoTitle(
                selectedPhoto.src,
                selectedPhoto.title,
              )}
              width={1600}
              height={1200}
              sizes="(max-width: 768px) 100vw, 90vw"
              quality={85}
              className="max-h-[78vh] max-w-full rounded-lg object-contain"
            />
            <h3 className="mt-4 text-center text-lg font-semibold text-white">
              {getIcetite24PhotoTitle(
                selectedPhoto.src,
                selectedPhoto.title,
              )}
            </h3>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-3xl text-white hover:bg-white/25 sm:right-6"
          >
            ›
          </button>
        </div>
      )}
      </div>
    </section>
  );
}
