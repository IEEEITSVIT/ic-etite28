"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Calendar, ArrowRight } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

// Conference Start: 10 February 2028, 09:00:00 IST (Indian Standard Time UTC+5:30)
const EVENT_TARGET_DATE = new Date("2028-02-10T09:00:00+05:30").getTime();

const MILESTONE_TIMELINE = [
  {
    date: "05 Oct 2027",
    label: "Paper Submission Last Date",
    isTarget: false,
  },
  {
    date: "04 Nov 2027",
    label: "Acceptance Notice",
    isTarget: false,
  },
  {
    date: "12 Dec 2027",
    label: "Camera Ready & Reg.",
    isTarget: false,
  },
  {
    date: "10–11 Feb 2028",
    label: "Conference Days",
    isTarget: true,
  },
];

function calculateTimeLeft(): TimeLeft {
  const now = new Date().getTime();
  const diff = EVENT_TARGET_DATE - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
}

export default function EventCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Avoid hydration mismatch by waiting for client mount
  if (!mounted || !timeLeft) {
    return null;
  }

  // Once countdown reaches 0, completely disappear from the DOM
  if (timeLeft.isExpired) {
    return null;
  }

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section aria-label="Event Countdown" className="w-full">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/20 bg-gradient-to-r from-[#001733]/95 via-[#002147]/95 to-[#001733]/95 p-4 sm:p-6 md:p-7 shadow-2xl backdrop-blur-md">
          {/* Subtle Ambient Gold Glow */}
          <div className="pointer-events-none absolute -top-12 -left-12 h-36 w-36 rounded-full bg-[#F5A623]/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-[#00B4D8]/15 blur-2xl" />

          {/* Header Row */}
          <div className="relative z-10 mb-4 sm:mb-5 flex flex-wrap items-center justify-between gap-2.5 border-b border-white/10 pb-3 sm:pb-4 text-center sm:text-left">
            <div className="flex items-center gap-2 mx-auto sm:mx-0">
              <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/30">
                <Clock className="h-4 w-4 animate-pulse" />
              </span>
              <div>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#F5A623]">
                  Conference Countdown
                </span>
                <p className="text-xs sm:text-sm font-medium text-white/90">
                  Countdown to ic-ETITE&apos;28 Inauguration
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] sm:text-xs font-semibold text-white/80 border border-white/10 mx-auto sm:mx-0">
              <Calendar className="h-3 w-3 text-[#F5A623]" />
              <span>10–11 February 2028 · VIT Vellore</span>
            </div>
          </div>

          {/* Countdown Digit Blocks (Fully Responsive for Mobile, iOS, Mac, Tablet, Desktop) */}
          <div className="relative z-10 grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {units.map((unit) => (
              <div
                key={unit.label}
                className="group flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border border-white/15 bg-white/[0.07] p-2.5 sm:p-4 md:p-5 text-center shadow-md transition-all duration-300 hover:border-[#F5A623]/50 hover:bg-white/[0.12]"
              >
                <div className="font-mono text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-sm font-sans tabular-nums">
                  {String(unit.value).padStart(2, "0")}
                </div>
                <div className="mt-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#F5A623]/90 sm:tracking-widest">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>

          {/* ── TIMELINE SECTION ── */}
          <div className="relative z-10 mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-white/15">
            {/* Header: Title "Timeline" (Bigger font size) + Full Schedule Link */}
            <div className="flex items-center justify-between mb-3.5 sm:mb-4">
              <h3 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFB81C] shadow-[0_0_8px_#FFB81C] animate-pulse" />
                <span>Timeline</span>
              </h3>
              <Link
                href="/important-dates"
                className="text-xs sm:text-sm font-semibold text-[#38BDF8] hover:text-[#7dd3fc] transition-colors inline-flex items-center gap-1.5 group"
              >
                <span>Full Schedule</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Timeline Milestones Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {MILESTONE_TIMELINE.map((item, idx) => (
                <div
                  key={item.label}
                  className={`group relative flex flex-col items-center text-center p-3 sm:p-3.5 rounded-2xl transition-all duration-300 ${
                    item.isTarget
                      ? "bg-gradient-to-b from-[#FFB81C]/20 to-[#FFB81C]/5 border-2 border-[#FFB81C] shadow-[0_0_25px_rgba(255,184,28,0.22)]"
                      : "bg-white/[0.06] border border-white/15 hover:border-white/30 hover:bg-white/[0.1]"
                  }`}
                >
                  {/* Step Stage Pill */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.isTarget
                          ? "bg-[#FFB81C] shadow-[0_0_6px_#FFB81C] animate-pulse"
                          : "bg-[#38BDF8]"
                      }`}
                    />
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
                        item.isTarget ? "text-[#FFB81C]" : "text-white/60"
                      }`}
                    >
                      {item.isTarget ? "Target" : `Stage 0${idx + 1}`}
                    </span>
                  </div>

                  {/* Date */}
                  <span
                    className={`text-xs sm:text-sm md:text-[15px] font-extrabold tabular-nums tracking-tight ${
                      item.isTarget ? "text-[#FFB81C]" : "text-white"
                    }`}
                  >
                    {item.date}
                  </span>

                  {/* Milestone Label */}
                  <span
                    className={`text-[11px] sm:text-xs font-medium leading-tight mt-1 ${
                      item.isTarget ? "text-white font-semibold" : "text-slate-300"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
