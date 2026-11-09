"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Cpu,
  ExternalLink,
} from "lucide-react";

export default function VitScoreConferenceSection() {
  return (
    <section id="vit-score-conference" className="border-b border-[#E2E8F0] bg-white scroll-mt-20">
      <div className="container-x py-16 md:py-24">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4DB] border border-[#F5A623]/30 text-[12px] font-bold text-[#002147] uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5 text-[#F5A623]" />
            <span>Host University &amp; Academic Leadership</span>
          </div>
          <h2 className="font-serif text-[clamp(1.9rem,3.5vw,2.8rem)] text-[#002147] leading-tight font-bold">
            Vellore Institute of Technology (VIT)
            <span className="block font-sans text-xl md:text-2xl text-[#004B87] font-semibold mt-2">
              School of Computer Science Engineering &amp; Information Systems (SCORE)
            </span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[#4A5568]">
            Ranked among India&apos;s foremost research universities by NIRF (#10 in Engineering) and accredited NAAC A++
            with an exceptional score of 3.66/4, VIT Vellore welcomes the international scientific community for
            ic-ETITE&apos;28.
          </p>
        </div>

        {/* Feature 1: VIT Vellore Campus with Aerial Drone Shot of Silver Jubilee Tower (SJT) */}
        <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-center mb-20">
          <div className="md:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] text-[12px] font-bold text-[#002147]">
              <span>Institution of Eminence</span>
              <span>·</span>
              <span>Est. 1984</span>
              <span>·</span>
              <span>Vellore, Tamil Nadu</span>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-[#002147] font-bold leading-snug">
              World-Class Research Ecosystem at VIT Vellore
            </h3>
            <p className="text-[14.5px] leading-[1.8] text-[#334E68]">
              Established in 1984 by Dr. G. Viswanathan and conferred university status in 2001, Vellore Institute of
              Technology has consistently pioneered outcome-based pedagogy, world-class computational laboratories, and
              high-impact translational research. Home to over 40,000 scholars and researchers from across 50 nations,
              VIT provides an extraordinary environment for intellectual exchange.
            </p>

            {/* Official Rankings Grid aligned with vit.ac.in */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                <p className="text-[11px] uppercase tracking-wider text-[#4A5568] font-bold">NIRF 2024</p>
                <p className="text-2xl font-serif font-extrabold text-[#002147] mt-1">#10</p>
                <p className="text-[11px] text-[#4A5568]">Engineering in India</p>
              </div>
              <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                <p className="text-[11px] uppercase tracking-wider text-[#4A5568] font-bold">NAAC Grade</p>
                <p className="text-2xl font-serif font-extrabold text-[#004B87] mt-1">A++</p>
                <p className="text-[11px] text-[#4A5568]">Score 3.66 / 4.0</p>
              </div>
              <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] col-span-2 sm:col-span-1">
                <p className="text-[11px] uppercase tracking-wider text-[#4A5568] font-bold">QS CS &amp; IS</p>
                <p className="text-2xl font-serif font-extrabold text-[#F5A623] mt-1">#86</p>
                <p className="text-[11px] text-[#4A5568]">Worldwide Ranking</p>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap gap-3">
              <a
                href="https://vit.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs inline-flex items-center gap-1.5"
              >
                <span>Visit Official vit.ac.in</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
              <Link href="/venue" className="btn-outline text-xs inline-flex items-center gap-1.5">
                <span>Explore Campus &amp; Venue</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Aerial Drone Video Shot of Silver Jubilee Tower (SJT) */}
          <div className="md:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xl group">
              <Image
                src="/images/vit-sjt.png"
                alt="VIT Vellore Silver Jubilee Tower (SJT) Aerial View"
                width={800}
                height={450}
                className="w-full h-[360px] object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002147]/90 via-transparent to-black/20" />
              <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F5A623] text-[#002147] text-[10px] font-bold uppercase tracking-wider mb-1">
                  Iconic Landmark
                </div>
                <p className="text-[15px] font-bold">Silver Jubilee Tower (SJT) · Aerial View</p>
                <p className="text-[12px] text-white/80">
                  Main Academic Hub hosting Advanced Computational Labs and Research Centers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: SCORE (School of Computer Science Engineering & Information Systems) */}
        <div className="p-8 md:p-10 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] mb-20 shadow-sm">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#004B87]/20 bg-blue-50 text-[12px] font-bold text-[#004B87]">
                <Cpu className="w-3.5 h-3.5" />
                <span>Organizing Department</span>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-[#002147] font-bold">
                School of Computer Science Engineering and Information Systems (SCORE)
              </h3>
              <p className="text-[14.5px] leading-relaxed text-[#334E68]">
                SCORE is VIT’s vanguard school for computing disciplines, software architectures, artificial
                intelligence, and enterprise data ecosystems. With over <strong>5,900 undergraduate and graduate scholars</strong>{" "}
                and <strong>188+ distinguished faculty members</strong>, SCORE is internationally recognized for its
                academic vigor, IEEE chapter partnerships, and groundbreaking research publications.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-white rounded-lg border border-[#E2E8F0]">
                  <p className="text-xl font-bold text-[#002147]">188+</p>
                  <p className="text-[11.5px] text-[#4A5568]">Doctoral Faculty</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-[#E2E8F0]">
                  <p className="text-xl font-bold text-[#002147]">12+</p>
                  <p className="text-[11.5px] text-[#4A5568]">Specialized Labs</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-[#E2E8F0] col-span-2 sm:col-span-1">
                  <p className="text-xl font-bold text-[#002147]">3,200+</p>
                  <p className="text-[11.5px] text-[#4A5568]">Research Publications</p>
                </div>
              </div>
            </div>

            {/* Lakeside Silver Jubilee Tower view */}
            <div className="md:col-span-5">
              <div className="relative rounded-xl overflow-hidden border border-[#E2E8F0] shadow-md group">
                <Image
                  src="/images/frame_1.webp"
                  alt="VIT Silver Jubilee Tower (SJT) Lakeside View"
                  width={600}
                  height={380}
                  className="w-full h-[260px] object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002147]/85 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <p className="text-xs font-bold">Silver Jubilee Tower (SJT) &amp; Lake</p>
                  <p className="text-[10.5px] text-white/80">VIT Vellore Eco-Campus</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3: Campus Photo Showcase - 4 High Definition Angles */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-[#F5A623]">Photo Gallery</p>
              <h3 className="font-serif text-2xl font-bold text-[#002147] mt-0.5">
                VIT Vellore Campus &amp; Conference Infrastructure
              </h3>
            </div>
            <Link href="/venue" className="btn-outline text-xs inline-flex items-center gap-1.5">
              <span>View Venue Details</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Main Entrance Gate */}
            <div className="relative rounded-xl overflow-hidden border border-[#E2E8F0] shadow-sm group">
              <Image
                src="/images/frame_5.webp"
                alt="VIT Vellore Main Gate Campus Entrance"
                width={500}
                height={320}
                className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002147]/90 via-[#002147]/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-xs font-bold">Main Campus Entrance</p>
                <p className="text-[11px] text-white/80">Katpadi, Vellore Main Gate</p>
              </div>
            </div>

            {/* 2. Conference Proceedings / ic-ETITE'24 */}
            <div className="relative rounded-xl overflow-hidden border border-[#E2E8F0] shadow-sm group">
              <Image
                src="/images/ic-etite24.webp"
                alt="ic-ETITE 24 Cultural and Academic Gathering"
                width={500}
                height={320}
                className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002147]/90 via-[#002147]/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-xs font-bold">ic-ETITE&apos;24 Conference Evening</p>
                <p className="text-[11px] text-white/80">Cultural Gala &amp; Networking Dinner</p>
              </div>
            </div>

            {/* 3. Dr. M.G.R Auditorium / Hall */}
            <div className="relative rounded-xl overflow-hidden border border-[#E2E8F0] shadow-sm group">
              <Image
                src="/images/vit-auditorium.webp"
                alt="Anna Auditorium Conference Hall"
                width={500}
                height={320}
                className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002147]/90 via-[#002147]/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-xs font-bold">Auditorium &amp; Keynote Hall</p>
                <p className="text-[11px] text-white/80">Plenary Sessions &amp; Ceremonies</p>
              </div>
            </div>

            {/* 4. Technical Presentations & Colloquium */}
            <div className="relative rounded-xl overflow-hidden border border-[#E2E8F0] shadow-sm group">
              <Image
                src="/images/004A3344.webp"
                alt="Technical Presentation and Academic Colloquium"
                width={500}
                height={320}
                className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002147]/90 via-[#002147]/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-xs font-bold">Technical Presentations</p>
                <p className="text-[11px] text-white/80">Paper Sessions &amp; Research Exchange</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
