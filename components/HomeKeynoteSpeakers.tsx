"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Award, Globe, Users } from "lucide-react";

export default function HomeKeynoteSpeakers() {
  return (
    <section id="speakers" className="border-b border-[#E2E8F0] bg-[#F8FAFC] scroll-mt-20">
      <div className="container-x py-8 sm:py-12">
        <div className="relative overflow-hidden rounded-3xl border-2 border-[#002147]/15 bg-gradient-to-br from-[#002147] via-[#001733] to-[#002147] p-8 sm:p-12 text-white shadow-xl">
          {/* Ambient Lighting */}
          <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-[#F5A623]/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#00B4D8]/10 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-bold text-[#F5A623] uppercase tracking-wider mb-4 backdrop-blur-sm">
              <Award className="w-4 h-4 text-[#F5A623]" />
              <span>Distinguished Global Scientists &amp; Leaders</span>
            </div>

            {/* Title */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
              Keynote Speakers &amp; Luminaries
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg text-white/85 leading-relaxed font-normal mb-8 max-w-2xl">
              Hear breakthrough insights from globally renowned professors, industry fellows, and
              academic leaders from Georgia Tech, Deloitte Quantum Research, Santa Clara University,
              University of Bristol, and leading international institutions.
            </p>

            {/* Highlights List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-xs sm:text-sm text-white/90">
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-3">
                <Globe className="w-4 h-4 text-[#F5A623] shrink-0" />
                <span>Global Thought Leaders</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-3">
                <Sparkles className="w-4 h-4 text-[#F5A623] shrink-0" />
                <span>Emerging Tech Keynotes</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-3">
                <Users className="w-4 h-4 text-[#F5A623] shrink-0" />
                <span>Interactive Q&amp;A Sessions</span>
              </div>
            </div>

            {/* Prominent Button per User Request */}
            <div>
              <Link
                href="/keynote-speakers"
                className="btn-gold inline-flex items-center gap-2.5 text-sm sm:text-base font-bold py-3.5 px-7 rounded-xl shadow-lg hover:shadow-xl transition-all"
                id="home-view-keynote-speakers-btn"
              >
                <span>View All Keynote Speakers</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
