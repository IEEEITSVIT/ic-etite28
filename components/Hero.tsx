"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import EventCountdown from "@/components/EventCountdown";
import {
  Download,
  Calendar,
  Award,
  ExternalLink,
  CheckCircle2,
  X,
  FileText,
  ArrowRight,
} from "lucide-react";

const HERO_VIDEO_SRC = "/videoplayback-2abc.mp4";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);

  useEffect(() => {
    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {
          // Autoplay handled safely
        });
      }
    };

    // The video's <source> only matches desktop widths, so phones never download it (~2.5 MB)
    // and keep the still image. Save-Data and reduced-motion users get the still image too.
    const skipVideo =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (skipVideo && videoRef.current) {
      const video = videoRef.current;
      video.pause();
      video.querySelector("source")?.remove();
      video.load();
    } else {
      playVideo();
    }

    // Ensure background video keeps playing on tab focus / visibility return
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        playVideo();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", playVideo);
    window.addEventListener("touchstart", playVideo, { once: true });
    window.addEventListener("click", playVideo, { once: true });

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", playVideo);
    };
  }, []);

  return (
    <>
      {/* HERO SECTION WITH FULL-WIDTH VIDEO & EXACT LEFT-ALIGNED TEXT */}
      <section
        id="hero"
        className="relative min-h-[640px] md:min-h-[740px] lg:min-h-[820px] flex items-center overflow-hidden bg-[#002147] text-white select-none"
        aria-label="Conference Introduction"
      >
        {/* Optimized Hero Background with Continuous Video Playback */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Image
            src="/images/frame_15.webp"
            alt="VIT Campus Aerial View"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center pointer-events-none -z-10"
          />

          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" media="(min-width: 768px)" />
          </video>

          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Sophisticated Dark Navy Gradient Overlay matching user's image & vit.ac.in */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(0, 33, 71, 0.94) 0%, rgba(0, 33, 71, 0.88) 35%, rgba(0, 33, 71, 0.62) 70%, rgba(0, 33, 71, 0.38) 100%)",
            }}
          />

          {/* Bottom vignette to smoothly transition into next section */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#002147] via-[#002147]/40 to-transparent pointer-events-none" />
        </div>

        {/* Hero Content Container - Strictly Left-Aligned as requested */}
        <div className="block container-x relative z-10 w-full py-12 sm:py-16 md:py-24 lg:py-28">
          <div className="max-w-2xl text-left">
            {/* Header logo at left top of the video matching user instruction */}
            <div className="mb-6 flex items-center gap-4">
              <div className="relative h-12 w-48 sm:h-14 sm:w-56">
                <Image
                  src="/logos/vit-header-logo.webp"
                  alt="Vellore Institute of Technology Logo"
                  fill
                  className="object-contain object-left drop-shadow"
		  sizes="(max-width: 768px) 100vw, 750px"
                />
              </div>

            </div>



            {/* Main Heading: Exactly as on the video left side */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold leading-[1.15] tracking-tight text-white mb-6 drop-shadow-md">
              Welcome to <span className="text-white">ic-ETITE&apos;28!</span>
            </h1>

            {/* Sub-heading: Full conference title exactly as reference */}
            <p className="text-base sm:text-lg md:text-[1.2rem] text-white/95 leading-snug font-normal max-w-xl mb-6 drop-shadow">
              Third International Conference on Emerging Trends in Information Technology and Engineering (ic-ETITE)
            </p>
            <p className="text-xs sm:text-sm text-[#FFB81C] font-semibold mb-8">
              Organized by School of Computer Science Engineering and Information Systems (SCORE) · VIT, Vellore
            </p>

            {/* Dates & Location Line */}
            <div className="flex items-center gap-2 text-white/90 text-sm sm:text-base font-medium mb-12">
              <Calendar className="w-4 h-4 text-[#F5A623] shrink-0" />
              <span>February 10–11, 2028 at Vellore Institute of Technology (VIT), Vellore, India</span>
            </div>

            {/* Action Buttons: Enlarged Dark Download Brochure + Register for Expo + Call for Papers */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Enlarged Dark Download Brochure Button */}
              <a
                href="/ic-ETITE'28.pdf"
                download="ic-ETITE'28.pdf"
                className="group flex items-center gap-3 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-[#001C3D] hover:bg-[#002855] text-white border-2 border-[#D39E00] shadow-[0_4px_25px_rgba(0,0,0,0.5)] transition-all hover:scale-105 text-sm sm:text-base font-bold cursor-pointer"
                aria-label="Download ic-ETITE'28 brochure"
              >
                <Download className="w-5 h-5 text-[#FFB81C] group-hover:scale-110 transition-transform" />
                <span className="tracking-wide">Download Brochure</span>
              </a>

              {/* Register for Expo Button (redirects to TechNext '28) */}
              <Link
                href="/technext"
                className="btn-gold group flex items-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-bold shadow-xl transition-all hover:scale-105"
                aria-label="Register for Expo"
              >
                <span>Register for Expo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
              </Link>

              {/* Call for Papers link beside it */}
              <Link
                href="/call-for-papers"
                className="inline-flex items-center gap-2 px-6 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md transition-all hover:scale-105"
              >
                <span>Call for Papers</span>
                <span>→</span>
              </Link>
            </div>

            {/* IEEE & VIT Credential Mini-strip */}
            <div className="mt-10 pt-6 border-t border-white/15 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/75">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F5A623]" />
                Organized by SCORE, VIT Vellore
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F5A623]" />
                IEEE ITS Student Chapter
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F5A623]" />
                NAAC A++ (CGPA 3.66)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F5A623]" />
                NIRF #10 in Engineering
              </span>
            </div>
          </div>
        </div>

      </section>

      {/* EVENT COUNTDOWN BANNER (PERFECTLY POSITIONED DIRECTLY BELOW VIDEO) */}
      <div className="w-full bg-[#00142E] py-6 sm:py-8 border-b border-white/10 relative z-10">
        <EventCountdown />
      </div>

      {/* VIT INSTITUTIONAL CREDENTIAL STRIP ALIGNED WITH VIT.AC.IN */}
      <section className="border-b border-[#E2E8F0] bg-white relative z-20 shadow-xs">
        <div className="container-x py-6 sm:py-7">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 text-left">
            <div className="border-l-4 border-[#F5A623] pl-4 sm:pl-5 py-0.5">
              <p className="text-base sm:text-lg lg:text-xl font-extrabold text-[#002147] tracking-tight leading-tight">
                10–11 Feb 2028
              </p>
              <p className="text-xs sm:text-[13px] text-slate-600 font-semibold uppercase tracking-wider mt-1">
                Conference Dates
              </p>
            </div>

            <div className="border-l-4 border-[#002147] pl-4 sm:pl-5 py-0.5">
              <p className="text-base sm:text-lg lg:text-xl font-extrabold text-[#002147] tracking-tight leading-tight">
                VIT Vellore, India
              </p>
              <p className="text-xs sm:text-[13px] text-slate-600 font-semibold uppercase tracking-wider mt-1">
                Host Campus &amp; Venue
              </p>
            </div>

            <div className="border-l-4 border-[#F5A623] pl-4 sm:pl-5 py-0.5">
              <p className="text-base sm:text-lg lg:text-xl font-extrabold text-[#002147] tracking-tight leading-tight">
                Double-Blind
              </p>
              <p className="text-xs sm:text-[13px] text-slate-600 font-semibold uppercase tracking-wider mt-1">
                Peer-Reviewed Tracks
              </p>
            </div>

            <div className="border-l-4 border-[#002147] pl-4 sm:pl-5 py-0.5 col-span-2 sm:col-span-1">
              <p className="text-base sm:text-lg lg:text-xl font-extrabold text-[#002147] tracking-tight leading-tight">
                NIRF #10 / NAAC A++
              </p>
              <p className="text-xs sm:text-[13px] text-slate-600 font-semibold uppercase tracking-wider mt-1">
                Top Indian Institution
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VIT.AC.IN ACCREDITATION & INSTITUTIONAL STRIP (3-PART BALANCED LAYOUT) */}
      <section className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="container-x py-3.5 sm:py-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-2.5 sm:gap-4 lg:gap-6 text-xs sm:text-[13px]">
            {/* LEFT SIDE: Organizing School */}
            <div className="text-center lg:text-left text-slate-700">
              <span className="font-bold text-[#002147]">SCORE</span>{" "}
              <span className="text-slate-600 font-medium">
                (School of Computer Science Engineering and Information Systems)
              </span>
            </div>

            {/* CENTER: Host University with Medal Icon */}
            <div className="flex items-center justify-center gap-2 text-center text-[#002147] font-bold">
              <Award className="w-4 h-4 text-[#F5A623] shrink-0" />
              <span>
                Vellore Institute of Technology
                <span className="text-slate-500 font-normal block sm:inline sm:ml-1 text-[11px] sm:text-xs">
                  (Deemed to be University under section 3 of UGC Act 1956)
                </span>
              </span>
            </div>

            {/* RIGHT SIDE: Technical Student Chapter */}
            <div className="text-center lg:text-right font-bold text-[#004B87]">
              <span>IEEE Information Theory Society, VIT</span>
            </div>
          </div>
        </div>
      </section>

      {/* DOWNLOAD BROCHURE INTERACTIVE MODAL */}
      {brochureModalOpen && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#002147] text-white p-6 relative">
              <button
                onClick={() => setBrochureModalOpen(false)}
                className="absolute top-5 right-5 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#F5A623] text-[#002147] text-[11px] font-bold uppercase tracking-wider mb-3">
                Official Information Brochure
              </div>
              <h2 className="text-2xl font-bold tracking-tight">ic-ETITE&apos;28 Conference Brochure</h2>
              <p className="text-xs text-white/80 mt-1">
                The Third International Conference on Emerging Trends in Information Technology and
                Engineering
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6 text-[#002147]">
              {/* Snapshot details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <p className="text-[11px] uppercase tracking-wider text-[#4A5568] font-medium">Dates</p>
                  <p className="text-sm font-bold text-[#002147] mt-0.5">Feb 10–11, 2028</p>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <p className="text-[11px] uppercase tracking-wider text-[#4A5568] font-medium">Venue</p>
                  <p className="text-sm font-bold text-[#002147] mt-0.5">VIT Vellore</p>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <p className="text-[11px] uppercase tracking-wider text-[#4A5568] font-medium">Organizer</p>
                  <p className="text-sm font-bold text-[#002147] mt-0.5">SCORE, VIT</p>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <p className="text-[11px] uppercase tracking-wider text-[#4A5568] font-medium">Edition</p>
                  <p className="text-sm font-bold text-[#002147] mt-0.5">3rd Edition</p>
                </div>
              </div>

              {/* Summary Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-[#002147]">About the Conference</h3>
                <p className="text-xs leading-relaxed text-[#4A5568]">
                  The Third International Conference on Emerging Trends in Information Technology and
                  Engineering (ic-ETITE’28) will be held at Vellore Institute of Technology (VIT), Vellore,
                  India, on 10–11 February 2028.
                </p>
              </div>

              {/* Research Tracks Highlights */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-[#002147]">Conference Tracks</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg border border-[#E2E8F0] bg-white">
                    <span className="font-semibold text-[#002147]">Track 1:</span> Information Technology
                  </div>
                  <div className="p-2.5 rounded-lg border border-[#E2E8F0] bg-white">
                    <span className="font-semibold text-[#002147]">Track 2:</span> Communication Engineering
                  </div>
                  <div className="p-2.5 rounded-lg border border-[#E2E8F0] bg-white">
                    <span className="font-semibold text-[#002147]">Track 3:</span> Computer Engineering
                  </div>
                  <div className="p-2.5 rounded-lg border border-[#E2E8F0] bg-white">
                    <span className="font-semibold text-[#002147]">Track 4:</span> Electronics Engineering
                  </div>
                </div>
              </div>

              {/* Scopus Recommendation Note */}
              <div className="p-3.5 rounded-xl bg-[#FFF4DB] border border-[#F5A623]/50 text-xs text-[#002147] font-medium">
                ⭐ <strong>Publication Opportunity:</strong> Extended version of selected papers will be recommended for publication in Scopus indexed journals with impact factor.
              </div>

              {/* Registration overview */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#002147]">Full Paper Submission Deadline</p>
                  <p className="text-xs text-[#4A5568]">05 October 2027 via Microsoft (CMT)</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  Open for Submissions
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#F8FAFC] border-t border-[#E2E8F0] p-4 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => setBrochureModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[#4A5568] hover:text-[#002147] transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="btn-outline text-xs py-2 px-3.5 inline-flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Print / Save as PDF</span>
              </button>
              <a
                href="/ic-ETITE'28.pdf"
                download="ic-ETITE'28.pdf"
                className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Brochure (PDF)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
