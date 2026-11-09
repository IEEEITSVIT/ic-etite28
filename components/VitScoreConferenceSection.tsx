"use client";

import Image from "@/components/cms/EImage";
import Link from "next/link";
import {
  Award,
  Cpu,
  ExternalLink,
} from "lucide-react";
import E from "@/components/cms/E";

export default function VitScoreConferenceSection() {
  return (
    <section id="vit-score-conference" className="border-b border-brand-border bg-white scroll-mt-20">
      <div className="container-x py-16 md:py-24">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4DB] border border-brand-accent-dark/30 text-[12px] font-bold text-brand-primary uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5 text-brand-accent-dark" />
            <span><E f="c.VitScoreConferenceSection">{"Host University & Academic Leadership"}</E></span>
          </div>
          <h2 className="font-serif text-[clamp(1.9rem,3.5vw,2.8rem)] text-brand-primary leading-tight font-bold"><E f="c.VitScoreConferenceSection">{"Vellore Institute of Technology (VIT)"}</E><span className="block font-sans text-xl md:text-2xl text-brand-secondary font-semibold mt-2"><E f="c.VitScoreConferenceSection">{"School of Computer Science Engineering & Information Systems (SCORE)"}</E></span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-brand-muted"><E f="c.VitScoreConferenceSection">{"Ranked among India's foremost research universities by NIRF (#10 in Engineering) and accredited NAAC A++ with an exceptional score of 3.66/4, VIT Vellore welcomes the international scientific community for ic-ETITE'28."}</E></p>
        </div>

        {/* Feature 1: VIT Vellore Campus with Aerial Drone Shot of Silver Jubilee Tower (SJT) */}
        <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-center mb-20">
          <div className="md:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-border bg-brand-surface text-[12px] font-bold text-brand-primary">
              <span><E f="c.VitScoreConferenceSection">{"Institution of Eminence"}</E></span>
              <span><E f="c.VitScoreConferenceSection">{"·"}</E></span>
              <span><E f="c.VitScoreConferenceSection">{"Est. 1984"}</E></span>
              <span><E f="c.VitScoreConferenceSection">{"·"}</E></span>
              <span><E f="c.VitScoreConferenceSection">{"Vellore, Tamil Nadu"}</E></span>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-brand-primary font-bold leading-snug"><E f="c.VitScoreConferenceSection">{"World-Class Research Ecosystem at VIT Vellore"}</E></h3>
            <p className="text-[14.5px] leading-[1.8] text-[#334E68]"><E f="c.VitScoreConferenceSection">{"Established in 1984 by Dr. G. Viswanathan and conferred university status in 2001, Vellore Institute of Technology has consistently pioneered outcome-based pedagogy, world-class computational laboratories, and high-impact translational research. Home to over 40,000 scholars and researchers from across 50 nations, VIT provides an extraordinary environment for intellectual exchange."}</E></p>

            {/* Official Rankings Grid aligned with vit.ac.in */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl border border-brand-border bg-brand-surface">
                <p className="text-[11px] uppercase tracking-wider text-brand-muted font-bold"><E f="c.VitScoreConferenceSection">{"NIRF 2024"}</E></p>
                <p className="text-2xl font-serif font-extrabold text-brand-primary mt-1"><E f="c.VitScoreConferenceSection">{"#10"}</E></p>
                <p className="text-[11px] text-brand-muted"><E f="c.VitScoreConferenceSection">{"Engineering in India"}</E></p>
              </div>
              <div className="p-3.5 rounded-xl border border-brand-border bg-brand-surface">
                <p className="text-[11px] uppercase tracking-wider text-brand-muted font-bold"><E f="c.VitScoreConferenceSection">{"NAAC Grade"}</E></p>
                <p className="text-2xl font-serif font-extrabold text-brand-secondary mt-1"><E f="c.VitScoreConferenceSection">{"A++"}</E></p>
                <p className="text-[11px] text-brand-muted"><E f="c.VitScoreConferenceSection">{"Score 3.66 / 4.0"}</E></p>
              </div>
              <div className="p-3.5 rounded-xl border border-brand-border bg-brand-surface col-span-2 sm:col-span-1">
                <p className="text-[11px] uppercase tracking-wider text-brand-muted font-bold"><E f="c.VitScoreConferenceSection">{"QS CS & IS"}</E></p>
                <p className="text-2xl font-serif font-extrabold text-brand-accent-dark mt-1"><E f="c.VitScoreConferenceSection">{"#86"}</E></p>
                <p className="text-[11px] text-brand-muted"><E f="c.VitScoreConferenceSection">{"Worldwide Ranking"}</E></p>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap gap-3">
              <a
                href="https://vit.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs inline-flex items-center gap-1.5"
              >
                <span><E f="c.VitScoreConferenceSection">{"Visit Official vit.ac.in"}</E></span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
              <Link href="/venue" className="btn-outline text-xs inline-flex items-center gap-1.5">
                <span><E f="c.VitScoreConferenceSection">{"Explore Campus & Venue"}</E></span>
                <span><E f="c.VitScoreConferenceSection">{"→"}</E></span>
              </Link>
            </div>
          </div>

          {/* Aerial Drone Video Shot of Silver Jubilee Tower (SJT) */}
          <div className="md:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-brand-border shadow-xl group">
              <Image
                src="/images/vit-sjt.png"
                alt="VIT Vellore Silver Jubilee Tower (SJT) Aerial View"
                width={800}
                height={450}
                className="w-full h-[360px] object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/90 via-transparent to-black/20" />
              <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-accent-dark text-brand-primary text-[10px] font-bold uppercase tracking-wider mb-1"><E f="c.VitScoreConferenceSection">{"Iconic Landmark"}</E></div>
                <p className="text-[15px] font-bold"><E f="c.VitScoreConferenceSection">{"Silver Jubilee Tower (SJT) · Aerial View"}</E></p>
                <p className="text-[12px] text-white/80"><E f="c.VitScoreConferenceSection">{"Main Academic Hub hosting Advanced Computational Labs and Research Centers"}</E></p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: SCORE (School of Computer Science Engineering & Information Systems) */}
        <div className="p-8 md:p-10 rounded-2xl border border-brand-border bg-brand-surface mb-20 shadow-sm">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-secondary/20 bg-blue-50 text-[12px] font-bold text-brand-secondary">
                <Cpu className="w-3.5 h-3.5" />
                <span><E f="c.VitScoreConferenceSection">{"Organizing Department"}</E></span>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-brand-primary font-bold"><E f="c.VitScoreConferenceSection">{"School of Computer Science Engineering and Information Systems (SCORE)"}</E></h3>
              <p className="text-[14.5px] leading-relaxed text-[#334E68]"><E f="c.VitScoreConferenceSection">{"SCORE is VIT’s vanguard school for computing disciplines, software architectures, artificial intelligence, and enterprise data ecosystems. With over "}</E><strong><E f="c.VitScoreConferenceSection">{"5,900 undergraduate and graduate scholars"}</E></strong><E f="c.VitScoreConferenceSection">{" "}</E><E f="c.VitScoreConferenceSection">{"and "}</E><strong><E f="c.VitScoreConferenceSection">{"188+ distinguished faculty members"}</E></strong><E f="c.VitScoreConferenceSection">{", SCORE is internationally recognized for its academic vigor, IEEE chapter partnerships, and groundbreaking research publications."}</E></p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-white rounded-lg border border-brand-border">
                  <p className="text-xl font-bold text-brand-primary"><E f="c.VitScoreConferenceSection">{"188+"}</E></p>
                  <p className="text-[11.5px] text-brand-muted"><E f="c.VitScoreConferenceSection">{"Doctoral Faculty"}</E></p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-brand-border">
                  <p className="text-xl font-bold text-brand-primary"><E f="c.VitScoreConferenceSection">{"12+"}</E></p>
                  <p className="text-[11.5px] text-brand-muted"><E f="c.VitScoreConferenceSection">{"Specialized Labs"}</E></p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-brand-border col-span-2 sm:col-span-1">
                  <p className="text-xl font-bold text-brand-primary"><E f="c.VitScoreConferenceSection">{"3,200+"}</E></p>
                  <p className="text-[11.5px] text-brand-muted"><E f="c.VitScoreConferenceSection">{"Research Publications"}</E></p>
                </div>
              </div>
            </div>

            {/* Lakeside Silver Jubilee Tower view */}
            <div className="md:col-span-5">
              <div className="relative rounded-xl overflow-hidden border border-brand-border shadow-md group">
                <Image
                  src="/images/frame_1.webp"
                  alt="VIT Silver Jubilee Tower (SJT) Lakeside View"
                  width={600}
                  height={380}
                  className="w-full h-[260px] object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/85 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <p className="text-xs font-bold"><E f="c.VitScoreConferenceSection">{"Silver Jubilee Tower (SJT) & Lake"}</E></p>
                  <p className="text-[10.5px] text-white/80"><E f="c.VitScoreConferenceSection">{"VIT Vellore Eco-Campus"}</E></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3: Campus Photo Showcase - 4 High Definition Angles */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-brand-accent-dark"><E f="c.VitScoreConferenceSection">{"Photo Gallery"}</E></p>
              <h3 className="font-serif text-2xl font-bold text-brand-primary mt-0.5"><E f="c.VitScoreConferenceSection">{"VIT Vellore Campus & Conference Infrastructure"}</E></h3>
            </div>
            <Link href="/venue" className="btn-outline text-xs inline-flex items-center gap-1.5">
              <span><E f="c.VitScoreConferenceSection">{"View Venue Details"}</E></span>
              <span><E f="c.VitScoreConferenceSection">{"→"}</E></span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Main Entrance Gate */}
            <div className="relative rounded-xl overflow-hidden border border-brand-border shadow-sm group">
              <Image
                src="/images/frame_5.webp"
                alt="VIT Vellore Main Gate Campus Entrance"
                width={500}
                height={320}
                className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/90 via-brand-primary/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-xs font-bold"><E f="c.VitScoreConferenceSection">{"Main Campus Entrance"}</E></p>
                <p className="text-[11px] text-white/80"><E f="c.VitScoreConferenceSection">{"Katpadi, Vellore Main Gate"}</E></p>
              </div>
            </div>

            {/* 2. Conference Proceedings / ic-ETITE'24 */}
            <div className="relative rounded-xl overflow-hidden border border-brand-border shadow-sm group">
              <Image
                src="/images/ic-etite24.webp"
                alt="ic-ETITE 24 Cultural and Academic Gathering"
                width={500}
                height={320}
                className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/90 via-brand-primary/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-xs font-bold"><E f="c.VitScoreConferenceSection">{"ic-ETITE'24 Conference Evening"}</E></p>
                <p className="text-[11px] text-white/80"><E f="c.VitScoreConferenceSection">{"Cultural Gala & Networking Dinner"}</E></p>
              </div>
            </div>

            {/* 3. Dr. M.G.R Auditorium / Hall */}
            <div className="relative rounded-xl overflow-hidden border border-brand-border shadow-sm group">
              <Image
                src="/images/vit-auditorium.webp"
                alt="Anna Auditorium Conference Hall"
                width={500}
                height={320}
                className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/90 via-brand-primary/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-xs font-bold"><E f="c.VitScoreConferenceSection">{"Auditorium & Keynote Hall"}</E></p>
                <p className="text-[11px] text-white/80"><E f="c.VitScoreConferenceSection">{"Plenary Sessions & Ceremonies"}</E></p>
              </div>
            </div>

            {/* 4. Technical Presentations & Colloquium */}
            <div className="relative rounded-xl overflow-hidden border border-brand-border shadow-sm group">
              <Image
                src="/images/004A3344.webp"
                alt="Technical Presentation and Academic Colloquium"
                width={500}
                height={320}
                className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/90 via-brand-primary/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-xs font-bold"><E f="c.VitScoreConferenceSection">{"Technical Presentations"}</E></p>
                <p className="text-[11px] text-white/80"><E f="c.VitScoreConferenceSection">{"Paper Sessions & Research Exchange"}</E></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
