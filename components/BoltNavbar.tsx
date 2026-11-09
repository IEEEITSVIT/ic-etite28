"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "@/components/cms/EImage";
import { ArrowLeft, Menu, X, Zap } from "lucide-react";
import E from "@/components/cms/E";

export default function BoltNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "Home", href: "/hackathon#hero" },
    { label: "About BOLT", href: "/hackathon#about" },
    { label: "Domains & Tracks", href: "/hackathon#domains" },
    { label: "BOLT 2.0 Gallery", href: "/hackathon#gallery" },
    { label: "Register", href: "/hackathon#register" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-primary border-b border-white/15 shadow-xl backdrop-blur-md">
      <nav
        className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4"
        aria-label="BOLT 3.0 Navigation"
      >
        {/* Left: BOLT Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/hackathon" className="flex items-center gap-2 group">
            <div className="relative h-8 sm:h-9 w-28 sm:w-36">
              <Image
                src="/logos/bolt-logo-white.png"
                alt="BOLT 3.0 Hackathon"
                fill
                sizes="(max-width: 640px) 112px, 144px"
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
              className="text-sm font-semibold text-white/85 hover:text-[#CCFF00] px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
            >
              <E f="c.BoltNavbar">{link.label}</E>
            </Link>
          ))}
        </div>

        {/* Right: ic-ETITE'28 Logo (redirects to homepage) & Mobile Hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            title="Go to ic-ETITE'28 Home"
            className="flex items-center gap-2 group hover:opacity-90 transition-opacity bg-white/10 hover:bg-white/20 px-2.5 sm:px-3 py-1.5 rounded-xl border border-white/20 shadow-xs"
          >
            <div className="relative h-6 sm:h-7 w-20 sm:w-24">
              <Image
                src="/logos/ic-etite28-cropped-transparent.png"
                alt="ic-ETITE'28 Conference Logo"
                fill
                sizes="(max-width: 640px) 80px, 96px"
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20"
            aria-label="Toggle BOLT menu"
          >
            {mobileOpen ? <X className="w-5 h-5 text-[#CCFF00]" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-brand-primary-dark border-t border-[#CCFF00]/30 px-6 py-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#CCFF00]"><E f="c.BoltNavbar">{"BOLT 3.0 Hackathon Navigation"}</E></span>
          </div>

          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-2.5 px-3 rounded-lg text-sm font-semibold text-white hover:text-[#CCFF00] hover:bg-white/10"
              >
                <E f="c.BoltNavbar">{link.label}</E>
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="w-full py-3 px-4 rounded-xl bg-brand-secondary text-white font-bold text-sm flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 text-[#CCFF00]" />
              <span><E f="c.BoltNavbar">{"Back to ic-ETITE'28 Home"}</E></span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
