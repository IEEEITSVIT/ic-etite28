import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "@/components/cms/EImage";
import Link from "next/link";
import {
  CheckCircle2,
  ExternalLink,
  Camera,
  ChevronRight,
  ArrowRight,
  Award,
  Cpu,
  Globe2,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import GallerySlideshow from "@/components/GallerySlideshow";
import E from "@/components/cms/E";

export const metadata: Metadata = pageMetadata("/about", {
  title: "About ic-ETITE'28 | Vellore Institute of Technology",
  description:
    "Learn about ic-ETITE'28, organized by SCORE, VIT Vellore. Explore conference legacy, VIT rankings, and IEEE ITS chapter.",
});

const rankingsList = [
  {
    title: "QS World University Rankings by Subject 2026",
    desc: "VIT is ranked 119th globally in Engineering & Technology. VIT is also ranked 86th in Computer Science & Information Systems and 87th in Electrical & Electronic Engineering, with several other disciplines placed among the top 200 globally.",
    badge: "QS Subject 2026",
  },
  {
    title: "QS Sustainability Rankings 2026",
    desc: "VIT is ranked 352nd globally and 7th among institutions in India, reflecting its performance in sustainability-related areas.",
    badge: "7th in India",
  },
  {
    title: "Shanghai Ranking (ARWU) 2025",
    desc: "VIT is placed in the 501–600 global rank band and in the 1–2 rank band among Indian institutions.",
    badge: "ARWU 2025",
  },
  {
    title: "NAAC Accreditation",
    desc: "VIT Vellore is accredited with an A++ grade, with a CGPA of 3.66 on a four-point scale.",
    badge: "A++ Grade · CGPA 3.66",
  },
  {
    title: "NIRF 2025 (Govt. of India)",
    desc: "VIT is ranked 14th in the University category, 14th in Research, and 16th in Engineering in the National Institutional Ranking Framework (NIRF), Government of India.",
    badge: "NIRF 2025",
  },
];

const archivalGallery = [
  {
    image: "/images/gallery/icetite20_stage_inaugural.webp",
    title: "ic-ETITE'20 Main Dais & Inauguration",
    badge: "First Edition · 2020",
    caption:
      "Hon'ble Chancellor Dr. G. Viswanathan, Chief Guest, Guests of Honour, and university leadership presiding over the solemn inauguration on the Anna Auditorium dais.",
  },
  {
    image: "/images/gallery/icetite20_plenary_audience.webp",
    title: "Plenary Delegates at Anna Auditorium",
    badge: "Plenary Gathering",
    caption:
      "A full house of international delegates, academic leaders, research scholars, and students participating in the inaugural proceedings.",
  },
  {
    image: "/images/gallery/icetite20_tree_plantation_barsky.webp",
    title: "Tree Plantation · Prof. Brian A. Barsky",
    badge: "Green Campus Tradition",
    caption:
      "Prof. Brian A. Barsky (UC Berkeley, USA) planting a commemorative sapling with Chancellor Dr. G. Viswanathan outside Anna Auditorium.",
  },
  {
    image: "/images/gallery/icetite20_tree_plantation_abraham.webp",
    title: "Tree Plantation · Dr. Ajith Abraham",
    badge: "Green Campus Tradition",
    caption:
      "Dr. Ajith Abraham (Director, MIR Labs, USA) and university leadership planting a commemorative tree on the auditorium lawns.",
  },
  {
    image: "/images/gallery/icetite20_tree_plantation_halonen.webp",
    title: "Tree Plantation · Dr. Raija Halonen",
    badge: "Green Campus Tradition",
    caption:
      "Dr. Raija Halonen (University of Oulu, Finland) participating in the commemorative green plantation tradition.",
  },
  {
    image: "/images/gallery/icetite20_traditional_welcome.webp",
    title: "Ceremonial Welcome of International Guests",
    badge: "Traditional Welcome",
    caption:
      "Traditional Indian ceremonial floral welcome accorded to international keynote speakers at the Anna Auditorium entrance.",
  },
  {
    image: "/images/gallery/icetite20_delegation_portrait.webp",
    title: "Chancellor & International Keynote Delegation",
    badge: "Leadership Delegation",
    caption:
      "Official delegation portrait featuring Chancellor Dr. G. Viswanathan and international delegates from UC Berkeley, MIR Labs, and partner institutions.",
  },
  {
    image: "/images/icetite24/icetite24_16_inaugural_ceremony_dais.webp",
    title: "ic-ETITE'24 Inaugural Dais & Proceedings",
    badge: "Second Edition · 2024",
    caption:
      "Chief Guest Shri S. Krishnan, IAS, Secretary MeitY, and university leadership presiding over the inauguration and reviewing 'Times of ic-ETITE'.",
  },
  {
    image: "/images/icetite24/icetite24_18_bolt_hackathon_awards_stage.webp",
    title: "BOLT 2.0 Hackathon Award Ceremony",
    badge: "BOLT 2.0 · 2024",
    caption:
      "Presentation of Certificate of Achievement to BOLT 2.0 winners on stage by Chief Guest Shri S. Krishnan, IAS, and Vice President Dr. Sankar Viswanathan.",
  },
  {
    image: "/images/icetite24/icetite24_04_cisco_expo.webp",
    title: "Interactive Tech Challenges at Cisco Booth",
    badge: "Title Sponsor Cisco",
    caption:
      "Students participating in interactive coding challenges and technology demos at the Title Sponsor Cisco 'Code with Cisco' pavilion.",
  },
  {
    image: "/images/icetite24/icetite24_11_drone_prototype_expo.webp",
    title: "SkyWatch Autonomous Drone Live Demonstration",
    badge: "TechNext'24 Prototype",
    caption:
      "Student engineering team demonstrating autonomous surveillance drone prototype with live telemetry to Chief Guest Dr. Zvi Galil and faculty.",
  },
  {
    image: "/images/icetite24/icetite24_13_java_capital_innovators.webp",
    title: "Student Startup Pitch to Java Capital",
    badge: "Startups & Innovators",
    caption:
      "Student innovators pitching their software prototype directly to startup mentor and venture partner Java Capital during TechNext'24.",
  },
  {
    image: "/images/icetite24/icetite24_01_networking_gala.webp",
    title: "Code with Cisco Pavilion & Student Interaction",
    badge: "Industry Expo",
    caption:
      "Students exploring cloud platforms and career opportunities at Title Sponsor Cisco's innovation booth during ic-ETITE'24.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-brand-surface min-h-screen text-brand-primary">
      <PageHeader
        badge="Vellore Institute of Technology · SCORE"
        title="About ic-ETITE'28"
        subtitle="The Third International Conference on Emerging Trends in Information Technology and Engineering (ic-ETITE’28) will be held at VIT Vellore, India, on 10–11 February 2028."
        breadcrumb="About Conference"
        bgImage="/images/frame_15.webp"
      />

      <div className="container-x py-8 sm:py-12 space-y-6 sm:space-y-8">
        {/* =========================================================================
            1. CONFERENCE OVERVIEW: ic-ETITE'28
        ========================================================================= */}
        <section className="bg-white rounded-2xl border-2 border-slate-200/90 p-6 sm:p-8 md:p-10 shadow-sm flow-root">
          {/* Floated Image on Desktop */}
          <div className="w-full sm:w-[380px] md:w-[460px] lg:w-[500px] md:float-right md:ml-8 md:mb-5 mb-6">
            <div className="p-2.5 bg-white border-2 border-slate-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <Image
                  src="/images/gallery/icetite24_inauguration.webp"
                  alt="ic-ETITE Conference Plenary Session"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover object-center hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="p-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 font-medium rounded-b-xl mt-2 text-center"><E f="about">{"Dignitaries and keynote luminaries at ic-ETITE, Anna Auditorium, VIT Vellore"}</E></p>
            </div>
          </div>

          {/* Text flowing all around the picture */}
          <div className="space-y-3.5">
            <span className="text-xs sm:text-sm font-bold text-brand-primary uppercase tracking-wider bg-[#FFF4DB] px-3.5 py-1.5 rounded-full border border-brand-accent-dark/50 inline-block"><E f="about">{"About ic-ETITE’28"}</E></span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-brand-primary font-bold leading-tight"><E f="about">{"An International Platform for Research & Innovation"}</E></h2>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify"><E f="about">{"The "}</E><strong><E f="about">{"Third International Conference on Emerging Trends in Information Technology and Engineering (ic-ETITE’28)"}</E></strong><E f="about">{" will convene at Vellore Institute of Technology (VIT), Vellore, India, on "}</E><strong><E f="about">{"10–11 February 2028"}</E></strong><E f="about">{". The conference aims to provide a distinguished global forum for researchers, academicians, engineers, industry professionals, and students to present and exchange innovative research in Information Technology, Computer Engineering, Communication Engineering, Electronics Engineering, and related emerging areas."}</E></p>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify"><E f="about">{"ic-ETITE’28 seeks to foster cross-disciplinary knowledge sharing, international research collaboration, industry–academia synergy, and future research partnerships among participants from around the world. Over two comprehensive conference days, delegates will engage in peer-reviewed oral paper presentations, distinguished keynote addresses from world-renowned scientists, interactive technical panels, and demonstrations of next-generation technological prototypes."}</E></p>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify"><E f="about">{"Original and unpublished research papers addressing emerging technical challenges, novel computational architectures, and recent engineering developments are invited from researchers worldwide. The conference is committed to promoting scientific excellence and facilitating the dissemination of high-impact research. All accepted and presented papers will be submitted for inclusion in the "}</E><strong><E f="about">{"IEEE Xplore Digital Library"}</E></strong><E f="about">{", and extended versions of selected papers will be recommended for publication in Scopus-indexed journals with impact factors."}</E></p>
          </div>

          <div className="clear-both pt-4 flex flex-wrap gap-3">
            <Link href="/call-for-papers" className="btn-primary text-sm font-bold py-2.5 px-5"><E f="about">{"Call for Papers"}</E></Link>
            <Link href="/tracks" className="btn-outline text-sm font-semibold py-2.5 px-5"><E f="about">{"Explore Tracks"}</E></Link>
          </div>
        </section>

        {/* =========================================================================
            2. THE THEME OF THE CONFERENCE
        ========================================================================= */}
        <section className="bg-white rounded-2xl border-2 border-slate-200/90 p-6 sm:p-8 md:p-10 shadow-sm flow-root">
          {/* Floated Image on Desktop (Left) */}
          <div className="w-full sm:w-[380px] md:w-[460px] lg:w-[500px] md:float-left md:mr-8 md:mb-5 mb-6">
            <div className="p-2.5 bg-white border-2 border-slate-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <Image
                  src="/images/004A3344.webp"
                  alt="Conference Hall and Participants at ic-ETITE"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover object-center hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="p-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 font-medium rounded-b-xl mt-2 text-center"><E f="about">{"Scholars and delegates participating in conference technical deliberations"}</E></p>
            </div>
          </div>

          {/* Text flowing all around the picture */}
          <div className="space-y-3.5">
            <span className="text-xs sm:text-sm font-bold text-[#DE6D1B] uppercase tracking-wider bg-orange-50 px-3.5 py-1.5 rounded-full border border-orange-200 inline-block"><E f="about">{"Conference Focus"}</E></span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-brand-primary"><E f="about">{"The Theme of the Conference"}</E></h2>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify"><E f="about">{"ic-ETITE’28 emphasizes the vital importance of advancing research, ethical innovation, and technological development in Information Technology and Engineering. The conference aims to provide a global platform for researchers, academicians, engineers, industry leaders, and students to showcase breakthrough innovations, exchange domain expertise, and explore emerging developments in science and technology."}</E></p>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify"><E f="about">{"The core tracks span four pivotal fields of engineering: "}</E><strong><E f="about">{"Information Technology"}</E></strong><E f="about">{" (encompassing cloud architectures, data engineering, blockchain, and cyber intelligence); "}</E><strong><E f="about">{"Computer Engineering"}</E></strong><E f="about">{" (artificial intelligence, machine learning, computer vision, and cognitive systems); "}</E><strong><E f="about">{"Communication Engineering"}</E></strong><E f="about">{" (next-generation wireless, 5G/6G protocols, IoT sensor networks, and signal processing); and "}</E><strong><E f="about">{"Electronics Engineering"}</E></strong><E f="about">{" (semiconductor devices, VLSI architectures, robotics, and cyber-physical automation)."}</E></p>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify"><E f="about">{"The conference is committed to promoting sustainable, energy-efficient, and human-centric engineering solutions that address global environmental and industrial challenges, while creating lifelong international research networks."}</E></p>
          </div>

          <div className="clear-both pt-4">
            <Link href="/tracks" className="btn-outline text-sm font-semibold py-2.5 px-5 inline-flex items-center gap-2">
              <span><E f="about">{"View Track Details & Topics"}</E></span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* =========================================================================
            3. HIGHLIGHTS OF PREVIOUS EDITIONS (ic-ETITE'24 & ic-ETITE'20)
        ========================================================================= */}
        <section id="highlights" className="space-y-6 scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs sm:text-sm font-bold text-brand-secondary uppercase tracking-wider bg-[#EBF3F8] px-3.5 py-1.5 rounded-full border border-brand-secondary/30 inline-block mb-2"><E f="about">{"Conference Heritage & Impact"}</E></span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-brand-primary"><E f="about">{"Highlights of Previous Editions"}</E></h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1"><E f="about">{"A proven track record of research excellence, international keynote speakers, hackathons, and IEEE Xplore proceedings."}</E></p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ic-ETITE'24 Card */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-6 sm:p-7 flex flex-col justify-between hover:border-brand-primary transition-all">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-brand-primary text-white text-xs font-bold font-mono uppercase tracking-wider"><E f="about">{"Second ic-ETITE’24 · 22–23 Feb 2024"}</E></span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200"><E f="about">{"IEEE Xplore Indexed"}</E></span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-primary mb-1"><E f="about">{"Highlights of the Second ic-ETITE’24"}</E></h3>
                <p className="text-xs text-slate-600 mb-4 min-h-[38px] flex items-center"><E f="about">{"Organized by SCORE, VIT Vellore: 22–23 February 2024. Technically co-sponsored by IEEE."}</E></p>

                <div className="grid grid-cols-3 gap-2.5 mb-5 text-center">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center min-h-[64px]">
                    <p className="text-xl sm:text-2xl font-sans font-bold text-brand-primary tracking-tight tabular-nums"><E f="about">{"1,688"}</E></p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="about">{"Papers Received"}</E></p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center min-h-[64px]">
                    <p className="text-xl sm:text-2xl font-sans font-bold text-brand-primary tracking-tight tabular-nums"><E f="about">{"19"}</E></p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="about">{"Countries"}</E></p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center min-h-[64px]">
                    <p className="text-xl sm:text-2xl font-sans font-bold text-brand-primary tracking-tight tabular-nums"><E f="about">{"1,088"}</E></p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="about">{"Participants"}</E></p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center min-h-[64px]">
                    <p className="text-xl sm:text-2xl font-sans font-bold text-brand-secondary tracking-tight tabular-nums"><E f="about">{"32"}</E></p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="about">{"Tech Sessions"}</E></p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center min-h-[64px]">
                    <p className="text-xl sm:text-2xl font-sans font-bold text-brand-secondary tracking-tight tabular-nums"><E f="about">{"22"}</E></p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="about">{"Keynotes"}</E></p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center min-h-[64px]">
                    <p className="text-xl sm:text-2xl font-sans font-bold text-[#DE6D1B] tracking-tight tabular-nums"><E f="about">{"683"}</E></p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="about">{"BOLT 2.0 Reg."}</E></p>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                    <span><strong><E f="about">{"Chief Guests:"}</E></strong><E f="about">{" Dr. Zvi Galil, Georgia Tech, USA, and Shri S. Krishnan, IAS, Secretary, MeitY, Government of India."}</E></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                    <span><strong><E f="about">{"Keynotes & Panels:"}</E></strong><E f="about">{" 22 keynote sessions delivered by global professors and industry leaders from Microsoft, Amazon, and Cisco."}</E></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                    <span><strong><E f="about">{"Technext’24:"}</E></strong><E f="about">{" Industrial expo, hardware demonstrations, and student project competition."}</E></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                    <span><strong><E f="about">{"IEEE Xplore:"}</E></strong><E f="about">{" All presented papers published in IEEE Xplore Digital Library."}</E></span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-2.5">
                <Link
                  href="/ic-ETITE24"
                  className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs flex-1 py-2.5 px-4 rounded-xl inline-flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <span><E f="about">{"Explore ic-ETITE'24"}</E></span>
                  <ChevronRight className="w-4 h-4 text-brand-accent" />
                </Link>
                <a
                  href="https://ieeexplore.ieee.org/xpl/conhome/10493200/proceeding"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-secondary hover:bg-brand-primary-hover text-white font-bold text-xs flex-1 py-2.5 px-4 rounded-xl inline-flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <span><E f="about">{"Access IEEE Proceedings"}</E></span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* ic-ETITE'20 Card */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-6 sm:p-7 flex flex-col justify-between hover:border-brand-primary transition-all">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-brand-secondary text-white text-xs font-bold font-mono uppercase tracking-wider"><E f="about">{"First ic-ETITE’20 · 24–25 Feb 2020"}</E></span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200"><E f="about">{"IEEE Xplore Indexed"}</E></span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-primary mb-1"><E f="about">{"Highlights of First ic-ETITE’20"}</E></h3>
                <p className="text-xs text-slate-600 mb-4 min-h-[38px] flex items-center"><E f="about">{"The inaugural IEEE International Conference on Emerging Trends in IT and Engineering: 24–25 February 2020 at VIT Vellore."}</E></p>

                <div className="grid grid-cols-3 gap-2.5 mb-5 text-center">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center min-h-[64px]">
                    <p className="text-xl sm:text-2xl font-sans font-bold text-brand-primary tracking-tight tabular-nums"><E f="about">{"21"}</E></p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="about">{"Tech Sessions"}</E></p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center min-h-[64px]">
                    <p className="text-xl sm:text-2xl font-sans font-bold text-brand-primary tracking-tight tabular-nums"><E f="about">{"17"}</E></p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="about">{"Keynotes"}</E></p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center min-h-[64px]">
                    <p className="text-xl sm:text-2xl font-sans font-bold text-brand-primary tracking-tight tabular-nums"><E f="about">{"500+"}</E></p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="about">{"BOLT Coders"}</E></p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center min-h-[64px]">
                    <p className="text-xl sm:text-2xl font-sans font-bold text-brand-secondary tracking-tight tabular-nums"><E f="about">{"100%"}</E></p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="about">{"IEEE Indexed"}</E></p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center min-h-[64px]">
                    <p className="text-xl sm:text-2xl font-sans font-bold text-brand-secondary tracking-tight tabular-nums"><E f="about">{"2"}</E></p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="about">{"Days Plenary"}</E></p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center min-h-[64px]">
                    <p className="text-xl sm:text-2xl font-sans font-bold text-[#DE6D1B] tracking-tight tabular-nums"><E f="about">{"₹1 Lakh"}</E></p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="about">{"Prize Pool"}</E></p>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
                    <span><strong><E f="about">{"Technical Co-Sponsors:"}</E></strong><E f="about">{" IEEE Computer Society & IEEE Communications Society Madras Chapters; supported by ACM & IEEE IAS."}</E></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
                    <span><strong><E f="about">{"Distinguished Keynotes:"}</E></strong><E f="about">{" Prof. Brian A. Barsky (UC Berkeley, USA), Dr. Ajith Abraham (Director, MIR Labs, USA), and Dr. Raija Halonen (Univ. of Oulu, Finland)."}</E></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
                    <span><strong><E f="about">{"BOLT 1.0 Hackathon:"}</E></strong><E f="about">{" Inaugural 24-hour national hackathon (“Breakthrough On Locked Technology”) engaging 500+ student innovators."}</E></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
                    <span><strong><E f="about">{"IEEE Xplore Proceedings:"}</E></strong><E f="about">{" All accepted and presented papers archived in IEEE Xplore. Electronic ISBN: "}</E><code className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded"><E f="about">{"978-1-7281-4142-8"}</E></code><E f="about">{"."}</E></span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-2.5">
                <Link
                  href="/ic-ETITE20"
                  className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs flex-1 py-2.5 px-4 rounded-xl inline-flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <span><E f="about">{"Explore ic-ETITE'20"}</E></span>
                  <ChevronRight className="w-4 h-4 text-brand-accent" />
                </Link>
                <a
                  href="https://ieeexplore.ieee.org/xpl/conhome/9070069/proceeding"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-secondary hover:bg-brand-primary-hover text-white font-bold text-xs flex-1 py-2.5 px-4 rounded-xl inline-flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <span><E f="about">{"Access IEEE Proceedings"}</E></span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. PHOTO GALLERY OF PREVIOUS EDITIONS
        ========================================================================= */}
        <section className="bg-white border-2 border-slate-200/90 rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4DB] border border-brand-accent-dark/40 text-xs font-bold text-brand-primary mb-2 uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5 text-brand-accent-dark" />
              <span><E f="about">{"Official Photo Archive"}</E></span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-brand-primary"><E f="about">{"Conference Moments & Gallery"}</E></h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1"><E f="about">{"Authentic glimpses of inaugural ceremonies, keynote addresses, and delegates from ic-ETITE’24 and ic-ETITE’20 at VIT Vellore."}</E></p>
          </div>

          <GallerySlideshow />

          {/* Curated Historical Moments 3-in-a-row Grid */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="text-center max-w-xl mx-auto mb-6">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-primary"><E f="about">{"Curated Archival Moments"}</E></h3>
              <p className="text-xs text-slate-500 mt-1"><E f="about">{"Selected archival photographs with official event details and dignitary attributions."}</E></p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {archivalGallery.slice(0, 3).map((photo, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <Image
                        src={photo.image}
                        alt={photo.title}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-primary-dark/85 backdrop-blur-md text-brand-accent text-[10px] font-bold border border-white/20 tracking-wide">
                          <E f="about">{photo.badge}</E>
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h4 className="font-bold text-sm sm:text-base text-brand-primary mb-1 group-hover:text-brand-secondary transition-colors leading-snug">
                        <E f="about">{photo.title}</E>
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        <E f="about">{photo.caption}</E>
                      </p>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-0">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#DE6D1B]">
                      <span><E f="about">{"VIT Vellore Campus"}</E></span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. ABOUT VIT & RANKINGS
        ========================================================================= */}
        <section className="bg-white rounded-2xl border-2 border-slate-200/90 p-6 sm:p-8 md:p-10 shadow-sm flow-root">
          {/* Floated Image on Desktop */}
          <div className="w-full sm:w-[380px] md:w-[460px] lg:w-[500px] md:float-left md:mr-8 md:mb-5 mb-6">
            <div className="p-2.5 bg-white border-2 border-slate-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <Image
                  src="/images/vit-campus.webp"
                  alt="VIT Vellore Main Campus Entrance"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover object-center hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="p-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 font-medium rounded-b-xl mt-2 text-center"><E f="about">{"Vellore Institute of Technology (VIT), Vellore Main Campus Entrance"}</E></p>
            </div>
          </div>

          {/* Text flowing all around the picture */}
          <div className="space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/5 border border-brand-primary/15 text-xs font-bold text-brand-primary uppercase tracking-wider w-fit">
              <Award className="w-3.5 h-3.5 text-brand-accent-dark" />
              <span><E f="about">{"Host University · Established 1984"}</E></span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-brand-primary font-bold leading-tight"><E f="about">{"About VIT"}</E></h2>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify"><E f="about">{"Vellore Institute of Technology (VIT) was established in 1984 as Vellore Engineering College and was granted university status by the Government of India in 2001 under Section 3 of the University Grants Commission (UGC) Act, 1956. Founded by "}</E><strong><E f="about">{"Dr. G. Viswanathan"}</E></strong><E f="about">{", VIT is committed to providing quality higher education and fostering excellence in teaching, research, and innovation."}</E></p>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify"><E f="about">{"The University promotes a vibrant and cosmopolitan academic environment, attracting students and faculty from across India and around the world. VIT places strong emphasis on research, innovation, international collaboration, and industry engagement. Its extensive academic and research collaborations with universities and institutions worldwide facilitate student and faculty exchanges, joint research, and global academic partnerships."}</E></p>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify"><E f="about">{"With a strong focus on academic excellence and a professional approach to governance, VIT continues to advance its vision of "}</E><em><E f="about">{"“Transforming life through excellence in education and research.”"}</E></em><E f="about">{" The University remains committed to preparing students and researchers to address emerging global challenges and contribute meaningfully to society."}</E></p>
          </div>

          {/* Ranking Cards directly within section to eliminate gaps */}
          <div className="clear-both mt-8 pt-6 border-t border-slate-200">
            <div className="max-w-3xl mb-5">
              <span className="text-xs font-bold text-brand-primary uppercase tracking-wider bg-[#FFF4DB] px-3 py-1 rounded-full border border-brand-accent-dark/50 inline-block mb-2"><E f="about">{"Global Recognition & Quality Accreditations"}</E></span>
              <h3 className="font-serif text-xl sm:text-2xl text-brand-primary font-bold"><E f="about">{"Ranking & Accreditation Overview"}</E></h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rankingsList.map((rank) => (
                <div
                  key={rank.title}
                  className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 flex flex-col justify-between hover:border-brand-primary transition-colors"
                >
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono bg-brand-primary/10 text-brand-primary mb-2">
                      <E f="about">{rank.badge}</E>
                    </span>
                    <h4 className="font-bold text-brand-primary text-sm mb-1.5 leading-snug">
                      <E f="about">{rank.title}</E>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <E f="about">{rank.desc}</E>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            6. ABOUT SCORE
        ========================================================================= */}
        <section className="bg-white rounded-2xl border-2 border-slate-200/90 p-6 sm:p-8 md:p-10 shadow-sm flow-root">
          {/* Floated Image on Desktop */}
          <div className="w-full sm:w-[380px] md:w-[460px] lg:w-[500px] md:float-right md:ml-8 md:mb-5 mb-6">
            <div className="p-2.5 bg-white border-2 border-slate-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <Image
                  src="/images/vit-sjt.webp"
                  alt="Silver Jubilee Tower (SJT) at VIT Vellore"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover object-center hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="p-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 font-medium rounded-b-xl mt-2 text-center"><E f="about">{"Silver Jubilee Tower (SJT), hosting SCORE Computing Labs, VIT Vellore"}</E></p>
            </div>
          </div>

          {/* Text flowing all around the picture */}
          <div className="space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-secondary/5 border border-brand-secondary/15 text-xs font-bold text-brand-secondary uppercase tracking-wider w-fit">
              <Cpu className="w-3.5 h-3.5" />
              <span><E f="about">{"Organizing School"}</E></span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-brand-primary font-bold"><E f="about">{"About SCORE"}</E></h2>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 text-justify"><E f="about">{"The "}</E><strong><E f="about">{"School of Computer Science Engineering and Information Systems (SCORE)"}</E></strong><E f="about">{" at Vellore Institute of Technology (VIT), Vellore, is a vibrant academic and research community committed to excellence in Computer Science, Information Technology, Artificial Intelligence, Data Engineering, Cyber Security, Software Engineering, and Computer Applications."}</E></p>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 text-justify"><E f="about">{"The School offers a diverse range of undergraduate, postgraduate, research, and doctoral programmes, including B.Tech. in Information Technology, B.Tech. in Computer Science and Engineering (Artificial Intelligence and Data Engineering), B.Tech. in Computer Science and Engineering (Cyber Security), BCA, B.Sc. in Computer Science, M.Tech. in Computer Science and Engineering (Cybersecurity), M.Tech. in Software Engineering, MCA, M.Sc. in Artificial Intelligence and Machine Learning, M.Tech. by Research, and Ph.D. programmes, equipping students with strong technical knowledge, practical skills, and the ability to address real-world challenges."}</E></p>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 text-justify"><E f="about">{"SCORE fosters a research-driven and innovation-oriented environment through interdisciplinary research, industry collaboration, consultancy, and engagement with leading academic and research organisations. Supported by state-of-the-art infrastructure, industry-supported laboratories, Centres of Excellence, and a strong community of students, faculty members, researchers, visiting professors, and industry professionals, the School promotes excellence in teaching, learning, research, and innovation."}</E></p>
          </div>

          {/* Quick Metrics */}
          <div className="clear-both mt-6 pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <p className="text-2xl font-serif font-bold text-brand-primary"><E f="about">{"5,900+"}</E></p>
              <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="about">{"Students"}</E></p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <p className="text-2xl font-serif font-bold text-brand-primary"><E f="about">{"188+"}</E></p>
              <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="about">{"Faculty"}</E></p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <p className="text-2xl font-serif font-bold text-brand-secondary"><E f="about">{"NAAC"}</E></p>
              <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="about">{"A++ (3.66)"}</E></p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <p className="text-2xl font-serif font-bold text-emerald-700"><E f="about">{"IEEE"}</E></p>
              <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5"><E f="about">{"Indexed"}</E></p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. ABOUT IEEE ITS CHAPTER
        ========================================================================= */}
        <section className="bg-white rounded-2xl border-2 border-slate-200/90 p-6 sm:p-8 md:p-10 shadow-sm flow-root">
          {/* Floated Image on Desktop */}
          <div className="w-full sm:w-[380px] md:w-[460px] lg:w-[500px] md:float-left md:mr-8 md:mb-5 mb-6">
            <div className="p-2.5 bg-white border-2 border-slate-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <Image
                  src="/images/vit-its.jpg"
                  alt="IEEE Information Theory Society Team at VIT"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover object-center hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="p-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 font-medium rounded-b-xl mt-2 text-center"><E f="about">{"IEEE Information Theory Society Student Chapter Team"}</E></p>
            </div>
          </div>

          {/* Text flowing all around the picture */}
          <div className="space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00B4D8]/10 border border-[#00B4D8]/30 text-xs font-bold text-brand-secondary uppercase tracking-wider w-fit">
              <Globe2 className="w-3.5 h-3.5 text-[#00B4D8]" />
              <span><E f="about">{"Co-Organizing Chapter · VIT Vellore"}</E></span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-brand-primary font-bold leading-tight"><E f="about">{"About ITS"}</E></h2>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 text-justify"><E f="about">{"The "}</E><strong><E f="about">{"IEEE Information Theory Society at VIT"}</E></strong><E f="about">{" is a distinguished student chapter dedicated to exploring the latest advancements in information theory and applying them to address contemporary technological challenges. The chapter provides a nurturing platform for students to foster innovative ideas, develop technical expertise, and engage in meaningful research and development projects."}</E></p>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 text-justify"><E f="about">{"Through technical events, workshops, seminars, and collaborative initiatives, the chapter promotes knowledge sharing and practical learning while connecting students with partners and collaborators from academia and industry. By encouraging curiosity, creativity, and continuous learning, the IEEE Information Theory Society at VIT strives to empower students to develop innovative solutions, address emerging challenges, and contribute meaningfully to the advancement of information and communication technologies."}</E></p>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 text-justify"><E f="about">{"As co-organizers of ic-ETITE’28, IEEE ITS plays a central role in delivering national hackathons, coordinating delegate interactions, and managing modern digital platforms for the conference."}</E></p>
          </div>

          <div className="clear-both pt-4 flex flex-wrap gap-3">
            <a
              href="https://ieee-its-vit.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 text-xs py-2.5 px-5"
            >
              <span><E f="about">{"Visit Official ITS Website"}</E></span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
