"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "@/components/cms/EImage";
import { ArrowLeft } from "lucide-react";
import E from "@/components/cms/E";

export default function TechNextFloatingReturn() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 250) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <Link
      href="/"
      id="technext-go-to-icetite"
      title="Go to ic-ETITE'28 Home"
      aria-label="Go to ic-ETITE'28 Home"
      className="fixed top-20 sm:top-24 right-4 sm:right-6 z-50 flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-brand-primary-dark/95 hover:bg-[#002B5B] text-white shadow-[0_4px_22px_rgba(0,0,0,0.45)] border-2 border-[#84E320]/60 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer animate-in fade-in zoom-in-95"
    >
      <div className="relative w-5 h-5 sm:w-6 sm:h-6 shrink-0 rounded-full overflow-hidden bg-white/10 p-0.5 border border-white/20">
        <Image
          src="/logos/ic-etite28-cropped-transparent.png"
          alt="ic-ETITE'28"
          fill
          sizes="24px"
          className="object-contain"
        />
      </div>
      <span className="text-xs sm:text-sm font-bold text-white group-hover:text-[#84E320] transition-colors whitespace-nowrap"><E f="c.TechNextFloatingReturn">{"Go to ic-ETITE'28"}</E></span>
      <ArrowLeft className="w-3.5 h-3.5 text-[#84E320] group-hover:-translate-x-0.5 transition-transform shrink-0" />
    </Link>
  );
}
