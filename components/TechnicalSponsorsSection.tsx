"use client";

import Image from "@/components/cms/EImage";
import Link from "next/link";
import E from "@/components/cms/E";

export default function TechnicalSponsorsSection() {
  return (
    <section
      id="sponsors"
      className="border-b border-brand-border bg-white py-8 md:py-10 scroll-mt-20 select-none"
      aria-label="Technical Sponsors and Organizing School"
    >
      <div className="container-x">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-5 sm:p-8 border border-slate-100 shadow-xs">
          {/* TECHNICAL SPONSOR Header */}
          <div className="text-center mb-4">
            <h3 className="text-sm sm:text-base md:text-lg font-black tracking-widest text-brand-primary-dark uppercase"><E f="c.TechnicalSponsorsSection">{"TECHNICAL SPONSOR"}</E></h3>
          </div>

          {/* To Be Announced */}
          <div className="flex justify-center items-center mb-6">
            <div className="h-14 w-72 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-xs font-medium tracking-wider uppercase"><E f="c.TechnicalSponsorsSection">{"To Be Announced"}</E></div>
          </div>

          {/* ORGANIZING SCHOOL Header */}
          <div className="text-center mb-4">
            <h3 className="text-sm sm:text-base md:text-lg font-black tracking-widest text-brand-primary-dark uppercase"><E f="c.TechnicalSponsorsSection">{"ORGANIZING SCHOOL"}</E></h3>
          </div>

          {/* Supported By Logos: SCORE · VIT Vellore with VIT Round Logo */}
          <div className="flex justify-center items-center">
            <Link
              href="/about"
              className="group flex flex-col items-center p-6 rounded-2xl border border-transparent hover:border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white"
              title="School of Computer Science Engineering & Information Systems, VIT Vellore"
            >
              {/* VIT Round Logo Container */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-slate-200 bg-white shadow-md p-2 group-hover:border-brand-secondary group-hover:shadow-lg transition-all flex items-center justify-center">
                <Image
                  src="/logos/vit-round-logo.svg"
                  alt="Vellore Institute of Technology Round Seal - SCORE"
                  fill
                  sizes="112px"
                  loading="lazy"
                  className="object-contain p-1"
                />
              </div>

              <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-brand-primary mt-3.5 text-center uppercase tracking-wider transition-colors"><E f="c.TechnicalSponsorsSection">{"SCORE · VIT VELLORE"}</E></span>
              <span className="text-[11px] text-slate-500 text-center max-w-xs mt-1"><E f="c.TechnicalSponsorsSection">{"School of Computer Science Engineering & Information Systems"}</E></span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
