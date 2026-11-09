"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Megaphone, X } from "lucide-react";
import type { TickerSettings } from "@/lib/settings";

const DURATION = { slow: 70, normal: 45, fast: 25 } as const;

// Admin-controlled scrolling announcement bar shown above the navbar (admin → Site content).
export default function TickerBar({ ticker }: { ticker: TickerSettings }) {
  const pathname = usePathname();
  const key = `ic_ticker_hidden_${ticker.items.map((i) => i.text).join("|").length}`;
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      setHidden(sessionStorage.getItem(key) === "1");
    } catch {}
  }, [key]);

  // Portal working pages stay uncluttered.
  const portal = /^\/(admin|evaluate)(\/|$)/.test(pathname);
  if (!ticker.enabled || ticker.items.length === 0 || hidden || portal) return null;

  // The track holds the items twice and scrolls by half its width, so the loop is seamless;
  // short lists are repeated so the bar is always full on wide screens.
  const base = ticker.items.length < 4 ? [...ticker.items, ...ticker.items] : ticker.items;
  const track = [...base, ...base];

  return (
    <div className="ticker-bar relative z-[60] flex h-9 items-center overflow-hidden bg-[#FFB81C] text-[#002147] select-none" role="region" aria-label={ticker.label || "Announcements"}>
      {ticker.label && (
        <div className="relative z-10 flex h-full shrink-0 items-center gap-1.5 bg-[#002147] px-3 text-[11px] font-black uppercase tracking-wider text-[#FFB81C] sm:px-4 sm:text-xs">
          <Megaphone className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{ticker.label}</span>
          <span className="absolute -right-2 top-0 h-full w-2 bg-gradient-to-r from-[#002147] to-transparent" />
        </div>
      )}
      <div className="ticker-viewport relative h-full min-w-0 flex-1 overflow-hidden">
        <div className="ticker-track flex h-full w-max items-center" style={{ animationDuration: `${DURATION[ticker.speed] ?? 45}s` }}>
          {track.map((item, i) => {
            const content = (
              <>
                {item.isNew && <span className="rounded-full bg-[#C8102E] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">New</span>}
                <span>{item.text}</span>
              </>
            );
            const cls = "flex items-center gap-2 whitespace-nowrap px-6 text-[12.5px] font-bold sm:text-[13px]";
            return (
              <span key={i} className="flex items-center" aria-hidden={i >= base.length}>
                {item.url ? (
                  item.url.startsWith("/") ? (
                    <Link href={item.url} className={`${cls} hover:underline`} tabIndex={i >= base.length ? -1 : undefined}>
                      {content}
                    </Link>
                  ) : (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className={`${cls} hover:underline`} tabIndex={i >= base.length ? -1 : undefined}>
                      {content}
                    </a>
                  )
                ) : (
                  <span className={cls}>{content}</span>
                )}
                <span className="text-[#002147]/40">◆</span>
              </span>
            );
          })}
        </div>
      </div>
      {ticker.dismissible && (
        <button
          type="button"
          aria-label="Hide announcements"
          onClick={() => {
            setHidden(true);
            try {
              sessionStorage.setItem(key, "1");
            } catch {}
          }}
          className="relative z-10 flex h-full shrink-0 items-center bg-[#FFB81C] px-2.5 text-[#002147]/70 hover:text-[#002147]"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
