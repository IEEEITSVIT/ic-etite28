"use client";

import Image from "@/components/cms/EImage";
import Link from "next/link";
import { History, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import E from "@/components/cms/E";

export default function HomePastEditions() {
  return (
    <section id="previous-editions" className="border-b border-brand-border bg-brand-surface scroll-mt-20">
      <div className="container-x py-10 md:py-14">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-secondary/10 border border-brand-secondary/25 text-xs font-bold text-brand-secondary uppercase tracking-wider mb-3">
            <History className="w-3.5 h-3.5" />
            <span><E f="c.HomePastEditions">{"Conference Heritage & Track Record"}</E></span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-primary leading-tight"><E f="c.HomePastEditions">{"Previous Editions: ic-ETITE’20 & ic-ETITE’24"}</E></h2>
          <p className="mt-3 text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal"><E f="c.HomePastEditions">{"A proven record of research excellence, IEEE Xplore indexed proceedings, world-class keynote luminaries, and national hackathons hosted at VIT Vellore."}</E></p>
        </div>

        {/* 2-Column Responsive Edition Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          
          {/* =========================================================================
              CARD 1: ic-ETITE'24 (Second Edition)
          ========================================================================= */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between hover:border-brand-secondary">
            <div className="space-y-6">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="px-3.5 py-1 rounded-full bg-brand-primary text-white text-xs font-bold font-mono uppercase tracking-wider"><E f="c.HomePastEditions">{"Second Edition · 22–23 Feb 2024"}</E></span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /><E f="c.HomePastEditions">{"IEEE Xplore Indexed"}</E></span>
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
                  <p className="text-xs sm:text-sm font-semibold !text-white text-white drop-shadow-md"><E f="c.HomePastEditions">{"ic-ETITE’24 Grand Inauguration Conclave"}</E></p>
                  <p className="text-[11px] !text-white/90 text-white/90 drop-shadow"><E f="c.HomePastEditions">{"Anna Auditorium, VIT Vellore · International Delegates"}</E></p>
                </div>
              </div>

              {/* Content Header */}
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary leading-snug"><E f="c.HomePastEditions">{"Highlights of the Second ic-ETITE’24"}</E></h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed"><E f="c.HomePastEditions">{"Organized by SCORE, VIT Vellore. Over 1,000 international delegates across 19 countries, technically co-sponsored by IEEE."}</E></p>
              </div>

              {/* Verified Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xl sm:text-2xl font-serif font-bold text-brand-primary"><E f="c.HomePastEditions">{"1,688"}</E></p>
                  <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="c.HomePastEditions">{"Papers Received"}</E></p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xl sm:text-2xl font-serif font-bold text-brand-primary"><E f="c.HomePastEditions">{"19"}</E></p>
                  <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="c.HomePastEditions">{"Countries"}</E></p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xl sm:text-2xl font-serif font-bold text-brand-primary"><E f="c.HomePastEditions">{"1,088"}</E></p>
                  <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="c.HomePastEditions">{"Participants"}</E></p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xl sm:text-2xl font-serif font-bold text-brand-secondary"><E f="c.HomePastEditions">{"32"}</E></p>
                  <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="c.HomePastEditions">{"Tech Sessions"}</E></p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xl sm:text-2xl font-serif font-bold text-brand-secondary"><E f="c.HomePastEditions">{"22"}</E></p>
                  <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="c.HomePastEditions">{"Keynotes"}</E></p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xl sm:text-2xl font-serif font-bold text-[#DE6D1B]"><E f="c.HomePastEditions">{"683"}</E></p>
                  <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="c.HomePastEditions">{"BOLT 2.0 Coders"}</E></p>
                </div>
              </div>

              {/* Key Guest Luminaries */}
              <ul className="space-y-2 text-xs sm:text-[13px] text-slate-700 pt-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
                  <span><strong><E f="c.HomePastEditions">{"Chief Guest:"}</E></strong><E f="c.HomePastEditions">{" Dr. Zvi Galil, Georgia Institute of Technology, USA"}</E></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
                  <span><strong><E f="c.HomePastEditions">{"Guest of Honour:"}</E></strong><E f="c.HomePastEditions">{" Shri S. Krishnan, IAS, Secretary, MeitY, Govt. of India"}</E></span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 mt-6 border-t border-slate-200">
              <Link
                href="/about#highlights"
                className="btn-primary text-xs font-bold py-3 px-4 rounded-xl inline-flex items-center gap-2 w-full justify-center shadow-sm"
              >
                <span><E f="c.HomePastEditions">{"Read Full 2024 Details on About Page"}</E></span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* =========================================================================
              CARD 2: ic-ETITE'20 (Inaugural Edition)
          ========================================================================= */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between hover:border-brand-secondary">
            <div className="space-y-6">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="px-3.5 py-1 rounded-full bg-brand-secondary text-white text-xs font-bold font-mono uppercase tracking-wider"><E f="c.HomePastEditions">{"Inaugural Edition · 24–25 Feb 2020"}</E></span>
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
                  <p className="text-xs sm:text-sm font-semibold !text-white text-white drop-shadow-md"><E f="c.HomePastEditions">{"ic-ETITE’20 Main Dais & Solemn Inauguration"}</E></p>
                  <p className="text-[11px] !text-white/90 text-white/90 drop-shadow"><E f="c.HomePastEditions">{"Presided over by Chancellor Dr. G. Viswanathan & Keynote Dignitaries"}</E></p>
                </div>
              </div>

              {/* Content Header */}
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary leading-snug"><E f="c.HomePastEditions">{"Foundation of the First ic-ETITE’20"}</E></h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed"><E f="c.HomePastEditions">{"The inaugural edition established the institutional standard with complete IEEE Xplore digital proceedings, international keynote addresses, and the national hackathon."}</E></p>
              </div>

              {/* Key Pillars Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xl sm:text-2xl font-serif font-bold text-brand-primary"><E f="c.HomePastEditions">{"21"}</E></p>
                  <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="c.HomePastEditions">{"Tech Tracks"}</E></p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xl sm:text-2xl font-serif font-bold text-brand-primary"><E f="c.HomePastEditions">{"17"}</E></p>
                  <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="c.HomePastEditions">{"Global Keynotes"}</E></p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xl sm:text-2xl font-serif font-bold text-brand-secondary"><E f="c.HomePastEditions">{"IEEE"}</E></p>
                  <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="c.HomePastEditions">{"Co-Sponsored"}</E></p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xl sm:text-2xl font-serif font-bold text-brand-secondary"><E f="c.HomePastEditions">{"500+"}</E></p>
                  <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="c.HomePastEditions">{"Hackathon Devs"}</E></p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xl sm:text-2xl font-serif font-bold text-brand-secondary"><E f="c.HomePastEditions">{"₹1,00,000"}</E></p>
                  <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="c.HomePastEditions">{"Prizes Awarded"}</E></p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xl sm:text-2xl font-serif font-bold text-[#DE6D1B]"><E f="c.HomePastEditions">{"100%"}</E></p>
                  <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="c.HomePastEditions">{"IEEE Xplore"}</E></p>
                </div>
              </div>

              {/* Key Guest Luminaries */}
              <ul className="space-y-2 text-xs sm:text-[13px] text-slate-700 pt-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
                  <span><strong><E f="c.HomePastEditions">{"Prof. Brian A. Barsky:"}</E></strong><E f="c.HomePastEditions">{" UC Berkeley, USA (Computer Science)"}</E></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
                  <span><strong><E f="c.HomePastEditions">{"Dr. Ajith Abraham:"}</E></strong><E f="c.HomePastEditions">{" Director, Machine Intelligence Research Labs, USA"}</E></span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 mt-6 border-t border-slate-200">
              <Link
                href="/about#highlights"
                className="btn-primary text-xs font-bold py-3 px-4 rounded-xl inline-flex items-center gap-2 w-full justify-center shadow-sm"
              >
                <span><E f="c.HomePastEditions">{"Read Full 2020 Details on About Page"}</E></span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Wide Bottom Banner explicitly redirecting to About Page */}
        <div className="mt-10 sm:mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-brand-primary via-brand-primary-hover to-brand-secondary text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-white/10">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span><E f="c.HomePastEditions">{"Full Historical Dossier & Conference Heritage"}</E></span>
            </div>
            <h4 className="font-serif text-xl sm:text-2xl font-bold"><E f="c.HomePastEditions">{"Want to explore the complete history and evolution of ic-ETITE?"}</E></h4>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl font-normal leading-relaxed"><E f="c.HomePastEditions">{"Read comprehensive reports, view tree plantation traditions with international dignitaries, keynote speech archives, and past photo galleries on the About page."}</E></p>
          </div>
          <Link
            href="/about"
            className="btn-gold whitespace-nowrap text-xs sm:text-sm font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl inline-flex items-center gap-2"
          >
            <span><E f="c.HomePastEditions">{"Explore Complete About Page"}</E></span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
