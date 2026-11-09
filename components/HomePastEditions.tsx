"use client";

import Image from "next/image";
import Link from "next/link";
import { History, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export default function HomePastEditions() {
  return (
    <section id="previous-editions" className="border-b border-[#E2E8F0] bg-[#FAFBFD] scroll-mt-20">
      <div className="container-x py-10 md:py-14">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#004B87]/10 border border-[#004B87]/25 text-xs font-bold text-[#004B87] uppercase tracking-wider mb-3">
            <History className="w-3.5 h-3.5" />
            <span>Conference Heritage &amp; Track Record</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#002147] leading-tight">
            Previous Editions: ic-ETITE’20 &amp; ic-ETITE’24
          </h2>
          <p className="mt-3 text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            A proven record of research excellence, IEEE Xplore indexed proceedings, world-class keynote luminaries, and national hackathons hosted at VIT Vellore.
          </p>
        </div>

        {/* 2-Column Responsive Edition Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          
          {/* =========================================================================
              CARD 1: ic-ETITE'24 (Second Edition)
          ========================================================================= */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between hover:border-[#004B87]">
            <div className="space-y-6">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="px-3.5 py-1 rounded-full bg-[#002147] text-white text-xs font-bold font-mono uppercase tracking-wider">
                  Second Edition · 22–23 Feb 2024
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  IEEE Xplore Indexed
                </span>
              </div>

              {/* Photo that fills empty space */}
              <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-inner">
                <Image
                  src="/images/gallery/icetite24_inauguration.webp"
                  alt="Dignitaries and keynote luminaries at ic-ETITE'24 Inaugural Session"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 text-white z-10">
                  <p className="text-xs sm:text-sm font-semibold !text-white text-white drop-shadow-md">ic-ETITE’24 Grand Inauguration Conclave</p>
                  <p className="text-[11px] !text-white/90 text-white/90 drop-shadow">Anna Auditorium, VIT Vellore · International Delegates</p>
                </div>
              </div>

              {/* Content Header */}
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#002147] leading-snug">
                  Highlights of the Second ic-ETITE’24
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Organized by SCORE, VIT Vellore. Over 1,000 international delegates across 19 countries, technically co-sponsored by IEEE.
                </p>
              </div>

              {/* Verified Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xl sm:text-2xl font-serif font-bold text-[#002147]">1,688</p>
                  <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">Papers Received</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xl sm:text-2xl font-serif font-bold text-[#002147]">19</p>
                  <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">Countries</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xl sm:text-2xl font-serif font-bold text-[#002147]">1,088</p>
                  <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">Participants</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xl sm:text-2xl font-serif font-bold text-[#004B87]">32</p>
                  <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">Tech Sessions</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xl sm:text-2xl font-serif font-bold text-[#004B87]">22</p>
                  <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">Keynotes</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xl sm:text-2xl font-serif font-bold text-[#DE6D1B]">683</p>
                  <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">BOLT 2.0 Coders</p>
                </div>
              </div>

              {/* Key Guest Luminaries */}
              <ul className="space-y-2 text-xs sm:text-[13px] text-slate-700 pt-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#004B87] shrink-0 mt-0.5" />
                  <span><strong>Chief Guest:</strong> Dr. Zvi Galil, Georgia Institute of Technology, USA</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#004B87] shrink-0 mt-0.5" />
                  <span><strong>Guest of Honour:</strong> Shri S. Krishnan, IAS, Secretary, MeitY, Govt. of India</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 mt-6 border-t border-slate-200">
              <Link
                href="/about#highlights"
                className="btn-primary text-xs font-bold py-3 px-4 rounded-xl inline-flex items-center gap-2 w-full justify-center shadow-sm"
              >
                <span>Read Full 2024 Details on About Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* =========================================================================
              CARD 2: ic-ETITE'20 (Inaugural Edition)
          ========================================================================= */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between hover:border-[#004B87]">
            <div className="space-y-6">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="px-3.5 py-1 rounded-full bg-[#004B87] text-white text-xs font-bold font-mono uppercase tracking-wider">
                  Inaugural Edition · 24–25 Feb 2020
                </span>
              </div>

              {/* Photo that fills empty space */}
              <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-inner">
                <Image
                  src="/images/gallery/icetite20_stage_inaugural.webp"
                  alt="Hon'ble Chancellor Dr. G. Viswanathan presiding over ic-ETITE'20 Inaugural Conclave"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 text-white z-10">
                  <p className="text-xs sm:text-sm font-semibold !text-white text-white drop-shadow-md">ic-ETITE’20 Main Dais &amp; Solemn Inauguration</p>
                  <p className="text-[11px] !text-white/90 text-white/90 drop-shadow">Presided over by Chancellor Dr. G. Viswanathan &amp; Keynote Dignitaries</p>
                </div>
              </div>

              {/* Content Header */}
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#002147] leading-snug">
                  Foundation of the First ic-ETITE’20
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  The inaugural edition established the institutional standard with complete IEEE Xplore digital proceedings, international keynote addresses, and the national hackathon.
                </p>
              </div>

              {/* Key Pillars Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xl sm:text-2xl font-serif font-bold text-[#002147]">21</p>
                  <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">Tech Tracks</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xl sm:text-2xl font-serif font-bold text-[#002147]">17</p>
                  <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">Global Keynotes</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xl sm:text-2xl font-serif font-bold text-[#004B87]">IEEE</p>
                  <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">Co-Sponsored</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xl sm:text-2xl font-serif font-bold text-[#004B87]">500+</p>
                  <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">Hackathon Devs</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xl sm:text-2xl font-serif font-bold text-[#004B87]">₹1,00,000</p>
                  <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">Prizes Awarded</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xl sm:text-2xl font-serif font-bold text-[#DE6D1B]">100%</p>
                  <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">IEEE Xplore</p>
                </div>
              </div>

              {/* Key Guest Luminaries */}
              <ul className="space-y-2 text-xs sm:text-[13px] text-slate-700 pt-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#004B87] shrink-0 mt-0.5" />
                  <span><strong>Prof. Brian A. Barsky:</strong> UC Berkeley, USA (Computer Science)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#004B87] shrink-0 mt-0.5" />
                  <span><strong>Dr. Ajith Abraham:</strong> Director, Machine Intelligence Research Labs, USA</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 mt-6 border-t border-slate-200">
              <Link
                href="/about#highlights"
                className="btn-primary text-xs font-bold py-3 px-4 rounded-xl inline-flex items-center gap-2 w-full justify-center shadow-sm"
              >
                <span>Read Full 2020 Details on About Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Wide Bottom Banner explicitly redirecting to About Page */}
        <div className="mt-10 sm:mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#002147] via-[#003366] to-[#004B87] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-white/10">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Full Historical Dossier &amp; Conference Heritage</span>
            </div>
            <h4 className="font-serif text-xl sm:text-2xl font-bold">
              Want to explore the complete history and evolution of ic-ETITE?
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl font-normal leading-relaxed">
              Read comprehensive reports, view tree plantation traditions with international dignitaries, keynote speech archives, and past photo galleries on the About page.
            </p>
          </div>
          <Link
            href="/about"
            className="btn-gold whitespace-nowrap text-xs sm:text-sm font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl inline-flex items-center gap-2"
          >
            <span>Explore Complete About Page</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
