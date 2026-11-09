"use client";

import { useEffect, useState, useRef } from "react";
import { conferenceData } from "@/data/conference";
import { ExternalLink, Check, Calendar, History, Trophy, FileText, Globe } from "lucide-react";
import E from "@/components/cms/E";

export default function LegacyTimeline() {
  const { previousEditions } = conferenceData;
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-white border-b border-[#e8e4dc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 pb-6 border-b border-[#e8e4dc]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-px bg-[#137547]" />
              <span className="font-mono text-[11px] tracking-widest uppercase text-[#137547]"><E f="c.LegacyTimeline">{"Symposium Lineage"}</E></span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1714] tracking-tight"><E f="c.LegacyTimeline">{"A Legacy of Research & Collaboration"}</E></h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6b6560] max-w-md"><E f="c.LegacyTimeline">{"From the inaugural 2020 symposium to the record-breaking 2024 gathering, ic-ETITE continues its biennial tradition of research excellence."}</E></p>
        </div>

        {/* Timeline Horizontal Stepper: 2020 -> 2024 -> 2028 */}
        <div className="relative mb-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {/* 2020 Edition */}
            <div className="bg-[#f7f5f0] p-6 rounded-xl border border-[#e8e4dc] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-white text-[#6b6560] border border-[#e8e4dc]"><E f="c.LegacyTimeline">{"Inaugural Edition"}</E></span>
                  <span className="font-mono text-lg font-bold text-[#1a1714]"><E f="c.LegacyTimeline">{"2020"}</E></span>
                </div>
                <h3 className="text-base font-bold text-[#1a1714]"><E f="c.LegacyTimeline">{"ic-ETITE’20"}</E></h3>
                <p className="text-xs text-[#6b6560] mb-3"><E f="c.LegacyTimeline">{"24–25 February 2020 · VIT Vellore"}</E></p>
                <ul className="text-xs text-[#6b6560] space-y-1.5 list-disc list-inside">
                  <li><E f="c.LegacyTimeline">{"Technically Co-Sponsored by IEEE Computer & ComSoc Chapters"}</E></li>
                  <li><E f="c.LegacyTimeline">{"All papers published in IEEE Xplore (ISBN: 978-1-7281-4142-8)"}</E></li>
                  <li><E f="c.LegacyTimeline">{"21 Technical & 17 Keynote Sessions"}</E></li>
                  <li><E f="c.LegacyTimeline">{"Inaugural BOLT Hackathon with 500+ participants"}</E></li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e8e4dc]">
                <a
                  href={previousEditions.edition20.proceedingsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-brand-secondary hover:underline inline-flex items-center gap-1"
                ><E f="c.LegacyTimeline">{"IEEE Xplore Proceedings "}</E><ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* 2024 Edition */}
            <div className="bg-[#f7f5f0] p-6 rounded-xl border border-[#e8e4dc] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-white text-[#6b6560] border border-[#e8e4dc]"><E f="c.LegacyTimeline">{"Second Edition"}</E></span>
                  <span className="font-mono text-lg font-bold text-[#1a1714]"><E f="c.LegacyTimeline">{"2024"}</E></span>
                </div>
                <h3 className="text-base font-bold text-[#1a1714]"><E f="c.LegacyTimeline">{"ic-ETITE’24"}</E></h3>
                <p className="text-xs text-[#6b6560] mb-3"><E f="c.LegacyTimeline">{"22–23 February 2024 · VIT Vellore"}</E></p>
                <ul className="text-xs text-[#6b6560] space-y-1.5 list-disc list-inside">
                  <li><E f="c.LegacyTimeline">{"Technically Sponsored by IEEE"}</E></li>
                  <li><E f="c.LegacyTimeline">{"Supported by IEEE Information Theory Society VIT"}</E></li>
                  <li><E f="c.LegacyTimeline">{"Keynotes by Prof. Zvi Galil, Prof. Vladimir Brusic & others"}</E></li>
                  <li><E f="c.LegacyTimeline">{"Technical sessions across 19 participating nations"}</E></li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e8e4dc] text-xs font-medium text-[#1a1714]"><E f="c.LegacyTimeline">{"1,688 Papers Received · 32 Technical Sessions"}</E></div>
            </div>

            {/* 2028 Edition (Current & Prominent) */}
            <div className="bg-white p-6 rounded-xl border-2 border-brand-secondary shadow-card relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-brand-secondary text-white font-medium"><E f="c.LegacyTimeline">{"Current Edition"}</E></span>
                <span className="font-mono text-lg font-bold text-brand-secondary"><E f="c.LegacyTimeline">{"2028"}</E></span>
              </div>
              <h3 className="text-base font-bold text-[#1a1714]"><E f="c.LegacyTimeline">{"ic-ETITE’28"}</E></h3>
              <p className="text-xs text-[#6b6560] mb-3"><E f="c.LegacyTimeline">{"10–11 February 2028 · VIT Vellore"}</E></p>
              <ul className="text-xs text-[#1a1714] space-y-1.5">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#137547] shrink-0" />
                  <span><E f="c.LegacyTimeline">{"Technically Sponsored by IEEE"}</E></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#137547] shrink-0" />
                  <span><E f="c.LegacyTimeline">{"Organized by SCORE & IEEE ITS VIT"}</E></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#137547] shrink-0" />
                  <span><E f="c.LegacyTimeline">{"4 Comprehensive Tracks & 100+ Topics"}</E></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#137547] shrink-0" />
                  <span><E f="c.LegacyTimeline">{"Microsoft (CMT) Submissions Active"}</E></span>
                </li>
              </ul>
              <div className="mt-4 pt-3 border-t border-[#f0ede7] flex items-center justify-between">
                <span className="text-xs font-bold text-brand-secondary"><E f="c.LegacyTimeline">{"Submissions Open"}</E></span>
                <span className="font-mono text-[10px] text-[#6b6560]"><E f="c.LegacyTimeline">{"SCORE, VIT Campus"}</E></span>
              </div>
            </div>
          </div>
        </div>

        {/* Official Previous Edition (ic-ETITE'24) Statistics Panel */}
        <div className="bg-[#111042] text-white rounded-xl p-8 sm:p-10 shadow-card">
          <div className="border-b border-white/10 pb-4 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-vit-light"><E f="c.LegacyTimeline">{"Verified Conference Benchmark"}</E></p>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1"><E f="c.LegacyTimeline">{"ic-ETITE’24 Official Statistics"}</E></h3>
            </div>
            <p className="text-xs text-academic-400 max-w-sm"><E f="c.LegacyTimeline">{"Audited figures from the second international conference proceedings organized at VIT Vellore."}</E></p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {previousEditions.edition24.stats.map((item) => (
              <div key={item.label} className="p-3 rounded-lg bg-academic-800/60 border border-academic-700/60">
                <div className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                  {inView ? item.value : "—"}
                </div>
                <div className="text-[11px] sm:text-xs text-academic-300 font-medium mt-1 leading-snug">
                  <E f="c.LegacyTimeline">{item.label}</E>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
