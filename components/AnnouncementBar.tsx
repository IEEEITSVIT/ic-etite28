"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Volume2,
  ChevronDown,
  X,
  ExternalLink,
  RotateCw,
  Sparkles,
  Award,
  Calendar,
  Building,
} from "lucide-react";

export default function AnnouncementBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [campusDropdownOpen, setCampusDropdownOpen] = useState(false);
  const [activeTickerIndex, setActiveTickerIndex] = useState(0);

  const tickerItems = [
    {
      text: "BOLT 3.0 National Flagship Hackathon — Registrations LIVE Now!",
      href: "/hackathon",
      isNew: true,
    },
    {
      text: "Call for Papers: ic-ETITE'28 Submissions Open for IEEE Xplore®",
      href: "/call-for-papers",
      isNew: true,
    },
    {
      text: "Ph.D. / Research Track Sessions — SCORE & IEEE ITS Symposia",
      href: "/tracks",
      isNew: true,
    },
    {
      text: "41st Annual Convocation & ic-ETITE'24 Archival Proceedings Published",
      href: "https://ieeexplore.ieee.org/xpl/conhome/9070069/proceeding",
      isNew: false,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTickerIndex((prev) => (prev + 1) % tickerItems.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [tickerItems.length]);

  return (
    <>
      {/* VIT.AC.IN OFFICIAL TOP UTILITY BAR */}
      <div
        id="vit-top-bar"
        className="bg-[#001C3D] text-white text-[12.5px] border-b border-white/10 z-50 select-none relative"
      >
        <div className="container-x flex items-center justify-between gap-4 py-2">
          {/* Left: Yellow Announcements Button (Exact vit.ac.in style) + Ticker */}
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Announcements Dropdown Trigger */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FFB81C] hover:bg-[#F5A623] text-[#001C3D] font-bold text-xs tracking-tight transition-colors shadow-sm shrink-0"
              aria-label="Open Announcements Drawer"
            >
              <Volume2 className="w-3.5 h-3.5 fill-[#001C3D]" />
              <span>Announcements</span>
              <ChevronDown className="w-3 h-3 stroke-[2.5]" />
            </button>

            {/* Scrolling Ticker Text */}
            <div className="hidden sm:flex items-center gap-2 overflow-hidden whitespace-nowrap text-white/90">
              <Link
                href={tickerItems[activeTickerIndex].href}
                className="hover:underline flex items-center gap-2 text-xs truncate max-w-[400px] lg:max-w-[550px] transition-all"
              >
                <span>{tickerItems[activeTickerIndex].text}</span>
                {tickerItems[activeTickerIndex].isNew && (
                  <span className="px-1.5 py-0.2 rounded bg-[#DE6D1B] text-white text-[9.5px] font-bold tracking-wider uppercase">
                    NEW
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Right: BOLT 3.0 Hackathon Logo + 360 View + VIT Campuses Dropdown */}
          <div className="flex items-center gap-3 shrink-0">
            {/* BOLT 3.0 Hackathon Logo Button: Hover size changes by a bit, on click redirects to hackathon registration */}
            <Link
              href="/hackathon"
              className="group flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/40 hover:bg-black/60 border border-[#CCFF00]/40 transition-all duration-300"
              title="Click to register for BOLT 3.0 Hackathon"
            >
              <div className="relative h-5 w-16 sm:w-20 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center">
                <Image
                  src="/logos/bolt-logo-white.png"
                  alt="BOLT 3.0 Hackathon Logo"
                  width={80}
                  height={24}
                  className="object-contain"
                  priority
                />
              </div>
              <span className="hidden xl:inline text-[10.5px] font-bold text-[#CCFF00] tracking-wider uppercase">
                Hackathon Live
              </span>
            </Link>

            {/* 360 Degree Virtual Tour */}
            <a
              href="https://vit.ac.in/campus-360-virtual-tour"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 text-white/80 hover:text-white transition-colors"
              title="VIT 360° Virtual Campus Tour"
            >
              <div className="w-6 h-6 rounded-full border border-white/40 flex items-center justify-center text-[9px] font-extrabold tracking-tighter hover:border-white">
                360°
              </div>
            </a>

            {/* Yellow VIT Campuses Dropdown Button (Exact vit.ac.in style) */}
            <div className="relative">
              <button
                onClick={() => setCampusDropdownOpen(!campusDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FFB81C] hover:bg-[#F5A623] text-[#001C3D] font-bold text-xs tracking-tight transition-colors shadow-sm"
                aria-expanded={campusDropdownOpen}
              >
                <Building className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">VIT - Campuses</span>
                <span className="sm:hidden">Campuses</span>
                <ChevronDown className="w-3 h-3 stroke-[2.5]" />
              </button>

              {campusDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setCampusDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[10.5px] uppercase font-bold text-slate-400 tracking-wider">
                    VIT University Campuses
                  </div>
                  <a
                    href="https://vit.ac.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#002147] hover:bg-slate-50"
                  >
                    <span>Vellore Campus (Host)</span>
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                  <a
                    href="https://chennai.vit.ac.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <span>Chennai Campus</span>
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                  <a
                    href="https://vitap.ac.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <span>VIT-AP (Amaravati)</span>
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                  <a
                    href="https://vitbhopal.ac.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <span>VIT Bhopal</span>
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* VIT.AC.IN ANNOUNCEMENTS SIDE DRAWER (Exact Layout from user screenshot) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[100000] flex animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col overflow-hidden text-[#002147] animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-[#002147]" />
                <h2 className="text-xl font-bold text-[#002147] tracking-tight">Announcements</h2>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
                aria-label="Close Announcements drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body with categories matching vit.ac.in */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
              {/* Featured Hackathon Highlight */}
              <div className="p-4 rounded-xl bg-[#001C3D] text-white border border-[#CCFF00]/30 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#CCFF00]">
                    ⚡ Flagship Hackathon
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[#DE6D1B] text-white text-[9px] font-bold">NEW</span>
                </div>
                <h3 className="font-bold text-base text-white">BOLT 3.0 National Student Hackathon</h3>
                <p className="text-xs text-white/80 mt-1 leading-relaxed">
                  Grand hackathon with ₹1,00,000+ prize pool organized by IEEE ITS &amp; SCORE. Registrations are open!
                </p>
                <div className="mt-3">
                  <Link
                    href="/hackathon"
                    onClick={() => setDrawerOpen(false)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#CCFF00] hover:underline"
                  >
                    <span>Register for BOLT 3.0 →</span>
                  </Link>
                </div>
              </div>

              {/* Research & Submissions */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Research &amp; CFP</h3>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2 text-xs">
                    <span className="text-[#002147] font-bold">➔</span>
                    <Link
                      href="/call-for-papers"
                      onClick={() => setDrawerOpen(false)}
                      className="text-slate-800 hover:text-[#002147] hover:underline font-medium"
                    >
                      Call for Papers: ic-ETITE&apos;28 Submissions Open for IEEE Xplore®{" "}
                      <span className="text-[#DE6D1B] font-bold text-[10px]">[NEW]</span>
                    </Link>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <span className="text-[#002147] font-bold">➔</span>
                    <Link
                      href="/important-dates"
                      onClick={() => setDrawerOpen(false)}
                      className="text-slate-800 hover:text-[#002147] hover:underline font-medium"
                    >
                      Paper Submission Deadline: 05 October 2027{" "}
                      <span className="text-[#DE6D1B] font-bold text-[10px]">[NEW]</span>
                    </Link>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <span className="text-[#002147] font-bold">➔</span>
                    <Link
                      href="/tracks"
                      onClick={() => setDrawerOpen(false)}
                      className="text-slate-800 hover:text-[#002147] hover:underline font-medium"
                    >
                      8 Research Tracks in AI, 6G, Cyber Security &amp; VLSI
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Institutional & Accreditation */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">University Honors</h3>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2 text-xs">
                    <span className="text-[#002147] font-bold">➔</span>
                    <a
                      href="https://vit.ac.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-800 hover:text-[#002147] hover:underline font-medium"
                    >
                      NIRF 2024: VIT Ranked #10 in Engineering across India{" "}
                      <span className="text-[#DE6D1B] font-bold text-[10px]">[NEW]</span>
                    </a>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <span className="text-[#002147] font-bold">➔</span>
                    <a
                      href="https://vit.ac.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-800 hover:text-[#002147] hover:underline font-medium"
                    >
                      NAAC A++ Grade Accreditation with 3.66 / 4.0 Score
                    </a>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <span className="text-[#002147] font-bold">➔</span>
                    <a
                      href="https://vit.ac.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-800 hover:text-[#002147] hover:underline font-medium"
                    >
                      QS World University Rankings 2026: #86 in CS &amp; IS
                    </a>
                  </li>
                </ul>
              </div>

              {/* Others */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">General Support</h3>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2 text-xs">
                    <span className="text-[#002147] font-bold">➔</span>
                    <Link
                      href="/venue"
                      onClick={() => setDrawerOpen(false)}
                      className="text-slate-800 hover:text-[#002147] hover:underline font-medium"
                    >
                      Campus Directions, Katpadi Railway Station &amp; Accommodation
                    </Link>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <span className="text-[#002147] font-bold">➔</span>
                    <Link
                      href="/contact"
                      onClick={() => setDrawerOpen(false)}
                      className="text-slate-800 hover:text-[#002147] hover:underline font-medium"
                    >
                      Conference Help Desk &amp; Inquiries
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-[#F8FAFC] flex items-center justify-between text-xs text-slate-500">
              <span>Vellore Institute of Technology</span>
              <a
                href="https://vit.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#002147] font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>vit.ac.in</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
