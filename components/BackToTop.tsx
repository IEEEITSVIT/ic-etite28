"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      // Robust hysteresis: show when scrolled past 350px, hide only when scrolled back above 200px
      if (scrollY > 350) {
        setVisible(true);
      } else if (scrollY < 200) {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      id="back-to-top"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0056B3] hover:bg-[#00428C] active:bg-[#003366] text-white shadow-[0_4px_18px_rgba(0,86,179,0.45)] border border-blue-400/40 transition-all duration-300 ease-out cursor-pointer group ${
        visible
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-4 scale-90 pointer-events-none"
      }`}
    >
      <ArrowUp
        className="w-6 h-6 sm:w-7 sm:h-7 text-[#72EFDD] group-hover:text-white group-hover:-translate-y-1 transition-all"
        strokeWidth={2.5}
      />
    </button>
  );
}
