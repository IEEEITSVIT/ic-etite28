"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Menu, X, Sparkles } from "lucide-react";

export default function TechNextNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "Home", href: "/technext#hero" },
    { label: "About TechNext", href: "/technext#about" },
    { label: "Expo Categories", href: "/technext#categories" },
    { label: "Photo Archive", href: "/technext#gallery" },
    { label: "Register", href: "/technext#register" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#002147] border-b border-white/15 shadow-xl backdrop-blur-md">
      <nav
        className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4"
        aria-label="TechNext '28 Navigation"
      >
        {/* Left: TechNext Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/technext" className="flex items-center gap-2 group">
            <div className="relative h-8 sm:h-9 w-36 sm:w-44">
              <Image
                src="/logos/technext-logo.png"
                alt="TechNext '28"
                fill
                sizes="(max-width: 640px) 144px, 176px"
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Center: Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-white/85 hover:text-[#84E320] px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: ic-ETITE'28 Logo & Mobile Hamburger */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/" title="Back to ic-ETITE'28 Home" className="flex items-center group hover:opacity-80 transition-opacity">
            <div className="relative h-7 sm:h-8 w-24 sm:w-28">
              <Image
                src="/logos/ic-etite28-cropped-transparent.png"
                alt="ic-ETITE'28 Logo"
                fill
                sizes="(max-width: 640px) 96px, 112px"
                className="object-contain object-right"
                priority
              />
            </div>
          </Link>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20"
            aria-label="Toggle TechNext menu"
          >
            {mobileOpen ? <X className="w-5 h-5 text-[#84E320]" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#180B4E] border-t border-[#84E320]/30 px-6 py-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#84E320]">
              TechNext &apos;28 Navigation
            </span>
          </div>

          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-2.5 px-3 rounded-lg text-sm font-semibold text-white hover:text-[#84E320] hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="w-full py-3 px-4 rounded-xl bg-[#004B87] text-white font-bold text-sm flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 text-[#84E320]" />
              <span>Back to ic-ETITE&apos;28 Home</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
