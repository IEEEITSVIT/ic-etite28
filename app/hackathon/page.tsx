import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import GallerySlideshow from "@/components/GallerySlideshow";
import { boltGalleryItems } from "@/data/boltGalleryData";
import BoltFloatingReturn from "@/components/BoltFloatingReturn";
import { pageMetadata } from "@/lib/seo";
import {
  Zap,
  Calendar,
  Clock,
  Trophy,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  MapPin,
} from "lucide-react";

export const metadata: Metadata = pageMetadata("/hackathon", {
  title: "BOLT 3.0 Hackathon | ic-ETITE'28",
  description:
    "BOLT 3.0 (Breakthrough On Locked Technology), the national flagship 24-hour hackathon organized by the IEEE ITS Student Chapter and SCORE at VIT Vellore alongside ic-ETITE'28.",
});

export default function HackathonPage() {
  return (
    <div className="bg-[#FAFBFD] min-h-screen text-slate-900">
      {/* ── HERO SECTION ── */}
      <section id="hero" className="relative py-10 md:py-16 overflow-hidden bg-[#002147] border-b border-white/15 text-white">
        <div className="container-x relative z-10">
          {/* Top Left Return Button */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/25 shadow-sm transition-all hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 text-[#CCFF00]" />
              <span>Back to ic-ETITE&apos;28 Home</span>
            </Link>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            {/* Centered BOLT 3.0 Logo */}
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="inline-flex items-center justify-center px-8 sm:px-12 py-5 sm:py-6 rounded-3xl bg-[#001733]/90 backdrop-blur-md border-2 border-[#CCFF00] shadow-[0_0_40px_rgba(204,255,0,0.3)] hover:scale-105 transition-all duration-300">
                <div className="relative h-14 sm:h-20 md:h-24 w-52 sm:w-72 md:w-80">
                  <Image
                    src="/logos/bolt-logo-white.png"
                    alt="BOLT 3.0 Flagship Hackathon Logo"
                    fill
                    sizes="(max-width: 640px) 208px, (max-width: 768px) 288px, 320px"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
              Breakthrough On Locked Technology
            </h1>
            <p className="text-sm sm:text-base text-white/85 max-w-2xl mx-auto leading-relaxed mb-5 font-normal">
              Organized by the <strong>IEEE Information Theory Society (ITS) Student Chapter</strong> and the{" "}
              <strong>School of Computer Science Engineering &amp; Information Systems (SCORE)</strong> at Anna Auditorium, VIT Vellore.
            </p>

            {/* Quick Meta Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs sm:text-sm font-semibold text-white/95 mb-6">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15">
                <Trophy className="w-4 h-4 text-[#FFB81C]" />
                <span>Prize Pool: ₹_ ,_ _, _ _ _</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15">
                <Clock className="w-4 h-4 text-[#CCFF00]" />
                <span>24-Hour Offline Hackathon</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15">
                <Calendar className="w-4 h-4 text-[#FFB81C]" />
                <span>February 10–11, 2028</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15">
                <MapPin className="w-4 h-4 text-[#CCFF00]" />
                <span>Anna Auditorium, VIT Vellore</span>
              </span>
            </div>

            {/* Hero CTA */}
            <div className="flex items-center justify-center">
              <a
                href="#register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#004B87] hover:bg-[#003366] text-white font-extrabold text-sm sm:text-base transition-all hover:scale-105 shadow-md border border-white/20"
              >
                <span>Registration Status &amp; Updates (TBA)</span>
                <ChevronRight className="w-4 h-4 text-[#CCFF00] stroke-[3]" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT BOLT SECTION: TEXT WRAPS ALL AROUND FLOATED PHOTO ── */}
      <section id="about" className="py-8 sm:py-12 bg-white border-b border-slate-200">
        <div className="container-x">
          <div className="bg-[#FAFBFD] rounded-2xl border-2 border-slate-200/90 p-6 sm:p-8 md:p-10 shadow-sm flow-root">
            {/* Floated Image on Desktop */}
            <div className="w-full sm:w-[380px] md:w-[460px] lg:w-[480px] md:float-right md:ml-8 md:mb-5 mb-6">
              <div className="p-2.5 bg-white border-2 border-slate-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <Image
                    src="/images/bolt20/bolt_01.webp"
                    alt="BOLT Hackathon Sprint at Anna Auditorium"
                    fill
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 font-medium rounded-b-xl mt-2 text-center">
                  Participants coding through the night at the 24-hour BOLT Sprint, VIT Vellore
                </div>
              </div>
            </div>

            {/* Text flowing all around the picture */}
            <div className="space-y-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#004B87] bg-[#EBF3F8] px-3 py-1 rounded-full border border-[#004B87]/20 inline-block">
                Hackathon Legacy &amp; Overview
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#002147] tracking-tight">
                24 Hours. Boundless Computing. Unlocked Innovation.
              </h2>

              <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
                <strong>BOLT (Breakthrough On Locked Technology)</strong> is the premier national 24-hour hackathon hosted at Anna Auditorium, VIT Vellore. Organized collaboratively by the <strong>IEEE Information Theory Society (ITS) Student Chapter</strong> and the <strong>School of Computer Science Engineering and Information Systems (SCORE)</strong>, BOLT challenges passionate engineering students, software developers, and product creators to design, build, and deploy production-ready prototypes within a high-octane 24-hour coding sprint.
              </p>

              <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
                In 2024, BOLT 2.0 witnessed an extraordinary response with over <strong>683 participant registrations</strong> spanning 45+ premier academic institutions across India. Teams developed end-to-end solutions in AI agents, cybersecurity, decentralized protocols, smart mobility, and social impact technologies. Throughout the sprint, participants receive continuous hands-on guidance from industry mentors, technical architects, and startup partners including Cisco, Intel, Yellow.ai, and Java Capital.
              </p>

              <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
                Final prototypes are evaluated by a distinguished panel of industry leaders, venture investors, and IEEE Fellows. Winning teams earn substantial cash awards, trophy honours, internship opportunities, and pre-incubation grants to scale their prototypes into commercially viable startups.
              </p>

              {/* BOLT Historical Metrics */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2 mt-4">
                <p className="text-xs font-bold text-[#004B87] uppercase tracking-wide">
                  BOLT Verified Track Record:
                </p>
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xl font-bold text-[#002147]">683+</p>
                    <p className="text-[10.5px] text-slate-600 uppercase font-semibold">Hackers Registered</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xl font-bold text-[#15803d]">45+</p>
                    <p className="text-[10.5px] text-slate-600 uppercase font-semibold">Institutes</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xl font-bold text-[#002147]">24h</p>
                    <p className="text-[10.5px] text-slate-600 uppercase font-semibold">Sprint Duration</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-2.5 text-slate-700 text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                  <span>One-on-one mentorship by engineers from leading cloud and deep-tech enterprises.</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-700 text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                  <span>Opportunity to pitch working prototypes directly to conference delegates and venture investors.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PHOTO GALLERY SLIDESHOW ── */}
      <section id="gallery" className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-[#F7F9FC] border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 px-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#004B87] bg-[#EBF3F8] px-3 py-1.5 rounded-full border border-[#004B87]/20 inline-block mb-4">
              Official Photo Archive
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#002147] mb-2">
              BOLT Hackathon Highlights
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">
              Memorable moments from the 24-hour national hackathon, rapid prototyping sprints, and stage awards at VIT Vellore.
            </p>
          </div>
          <GallerySlideshow items={boltGalleryItems} showCategoryFilter={false} />
        </div>
      </section>

      {/* ── DOMAINS & TRACKS GRID ── */}
      <section id="domains" className="py-8 sm:py-12 bg-white border-b border-slate-200">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#004B87] bg-[#EBF3F8] px-3 py-1 rounded-full border border-[#004B87]/20 inline-block mb-2">
              Problem Tracks
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#002147] tracking-tight">
              Innovate, Build &amp; Deploy at Scale
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              BOLT 3.0 challenges developers, designers, and engineers across 4 frontier technical domains:
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl border border-slate-200 bg-[#FAFBFD] hover:border-[#004B87] hover:bg-white transition-all shadow-2xs">
              <div className="w-9 h-9 rounded-lg bg-[#EBF3F8] text-[#004B87] flex items-center justify-center mb-3">
                <Zap className="w-4 h-4 text-[#004B87]" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#002147]">
                1. AI &amp; Autonomous Agents
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Generative AI workflows, multi-agent frameworks, neuro-symbolic reasoning, and intelligent automation.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-[#FAFBFD] hover:border-[#004B87] hover:bg-white transition-all shadow-2xs">
              <div className="w-9 h-9 rounded-lg bg-[#EBF3F8] text-[#004B87] flex items-center justify-center mb-3">
                <Zap className="w-4 h-4 text-[#004B87]" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#002147]">
                2. Cyber Trust &amp; Web3
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Zero-knowledge proofs, decentralized identity, post-quantum cryptosystems, and threat detection.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-[#FAFBFD] hover:border-[#004B87] hover:bg-white transition-all shadow-2xs">
              <div className="w-9 h-9 rounded-lg bg-[#EBF3F8] text-[#004B87] flex items-center justify-center mb-3">
                <Zap className="w-4 h-4 text-[#004B87]" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#002147]">
                3. Smart Mobility &amp; IoT
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                V2X communication, electric vehicle telematics, drone telemetry, and real-time edge processing.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-[#FAFBFD] hover:border-[#004B87] hover:bg-white transition-all shadow-2xs">
              <div className="w-9 h-9 rounded-lg bg-[#EBF3F8] text-[#004B87] flex items-center justify-center mb-3">
                <Zap className="w-4 h-4 text-[#004B87]" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#002147]">
                4. Open Innovation &amp; Social Impact
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                HealthTech diagnosis platforms, AgriTech supply monitors, and clean energy optimization engines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRIZES & REGISTRATION STATUS ── */}
      <section id="register" className="py-8 sm:py-12 bg-[#FAFBFD]">
        <div className="container-x">
          <div className="grid md:grid-cols-12 gap-6 items-start">
            {/* Left: Prize Pool Breakdown */}
            <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border-2 border-slate-200 shadow-sm space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#004B87] bg-[#EBF3F8] px-3 py-1 rounded-full border border-[#004B87]/20 inline-block">
                Rewards &amp; Grants
              </span>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#002147] tracking-tight">
                Prize Pool: ₹_ ,_ _, _ _ _
              </h2>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                Top teams will receive cash awards, certificates of excellence issued by IEEE ITS, and project incubation support at VIT Vellore.
              </p>

              <div className="grid sm:grid-cols-3 gap-2.5 pt-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs text-center">
                  <p className="text-xs text-[#004B87] font-bold uppercase tracking-wider">1st Prize</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">Cash + Trophy</p>
                  <p className="text-xl font-black text-[#002147] tracking-tight mt-0.5">₹_ _,_ _ _</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs text-center">
                  <p className="text-xs text-[#004B87] font-bold uppercase tracking-wider">2nd Prize</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">Cash + Trophy</p>
                  <p className="text-xl font-black text-[#002147] tracking-tight mt-0.5">₹_ _,_ _ _</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs text-center">
                  <p className="text-xs text-[#004B87] font-bold uppercase tracking-wider">3rd Prize</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">Cash + Trophy</p>
                  <p className="text-xl font-black text-[#002147] tracking-tight mt-0.5">₹_ _,_ _ _</p>
                </div>
              </div>
            </div>

            {/* Right: Registration Status Box */}
            <div className="md:col-span-5">
              <div className="p-6 sm:p-8 rounded-2xl border-2 border-slate-200 bg-white shadow-sm space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Registration: TBA (Opening Soon)</span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#002147] tracking-tight">
                    Register for BOLT 3.0
                  </h3>
                  <p className="text-xs font-semibold text-[#004B87] mt-1">
                    Registration dates TBA — Portal details launching soon
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    Official registration dates for BOLT 3.0 at Anna Auditorium, VIT Vellore will be announced shortly along with the release of full problem statements, team guidelines, and judging rubrics.
                  </p>

                  <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs text-slate-700 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-[#15803d]">✓</span>
                      <span>Teams of 2 to 4 members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#15803d]">✓</span>
                      <span>Venue: Anna Auditorium, VIT Vellore</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#FAFBFD] border border-slate-200 text-center">
                  <p className="text-xs text-slate-600">
                    Questions? Reach out to the secretariat at{" "}
                    <a
                      href="mailto:icetiteconference@vit.ac.in"
                      className="text-[#004B87] font-semibold underline hover:text-[#002147]"
                    >
                      icetiteconference@vit.ac.in
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Overlay Button */}
      <BoltFloatingReturn />
    </div>
  );
}
