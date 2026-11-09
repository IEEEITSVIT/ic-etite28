import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";
import Icetite24PhotoGrid from "@/components/Icetite24PhotoGrid";

import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Users,
  FileText,
  Globe,
  Mic2,
  CheckCircle2,
  BookOpen,
  Award,
  Cpu,
} from "lucide-react";

export const metadata: Metadata = pageMetadata("/ic-ETITE24", {
  title: "ic-ETITE'24 — Second Edition | Highlights & Photo Archive",
  description:
    "Official highlights, stats, and photo archive of the Second IEEE International Conference on Emerging Trends in Information Technology and Engineering (ic-ETITE'24), held on 22–23 Feb 2024 at VIT Vellore.",
});

const stats = [
  { label: "Papers Received", value: "1,688", icon: FileText },
  { label: "Countries", value: "19", icon: Globe },
  { label: "Participants", value: "1,088", icon: Users },
  { label: "Tech Sessions", value: "32", icon: Cpu },
  { label: "Keynotes", value: "22", icon: Mic2 },
  { label: "BOLT 2.0 Reg.", value: "683", icon: Award },
];

const highlights = [
  {
    title: "Chief Guests",
    body: "Dr. Zvi Galil, Georgia Institute of Technology, USA and Shri S. Krishnan, IAS, Secretary, MeitY, Government of India.",
  },
  {
    title: "Keynote Sessions",
    body: "22 keynote sessions delivered by eminent international academicians, Vice-Chancellors, IIT professors, and industry experts from Microsoft, Amazon, and other organizations.",
  },
  {
    title: "Panel Discussions",
    body: "Expert panel discussions were conducted with distinguished speakers from academia, IEEE, and industry.",
  },
  {
    title: "TechNext'24",
    body: "Industrial expo and project competition conducted alongside the conference, featuring live prototype demonstrations to an industry jury.",
  },
  {
    title: "Industry Collaborations & Sponsorships",
    body: "Intel, Cisco, Yellow.ai, Java Capital, and Seed VC Innovation as sponsors and industry partners.",
  },
  {
    title: "IEEE Xplore Indexed",
    body: "All accepted and presented papers were indexed in IEEE Xplore, providing global research visibility for authors.",
  },
];

const sponsors = [
  {
    label: "TECHNICAL CO-SPONSOR",
    name: "IEEE Madras Section",
    logo: "/logos/IEEE Madras section.png",
    alt: "IEEE Madras Section",
  },
  {
    label: "TITLE SPONSOR",
    name: "Cisco",
    logo: "/logos/cisco.svg",
    alt: "Cisco",
  },
  {
    label: "TECHNOLOGY PARTNER & CO-TITLE SPONSOR",
    name: "Intel",
    logo: "/logos/intel.svg",
    alt: "Intel",
  },
];

const supportedOrganizations = [
  "ACM",
  "IEEE Information Theory Society",
  "IEEE Computer Society Madras Chapter",
  "IEEE Communications Society Madras Chapter",
  "Institution's Innovation Council",
  "ROX",
  "Solaris",
  "Eaglewings",
  "Yellow.ai",
];

export default function Icetite24Page() {
  return (
    <div className="bg-white min-h-screen text-[#002147]">

      {/* ── HERO ── */}
      <section className="relative min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] flex items-end overflow-hidden">
        {/* Background Image with Dark Navy Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/gallery/icetite24_shield_unveiling_hero.webp"
            alt="ic-ETITE'24 Official Unveiling Ceremony with Chief Guest Dr. Zvi Galil, Dignitaries, and IEEE Leadership"
            fill
            sizes="100vw"
            priority
            className="object-cover object-[center_28%] opacity-90"
          />
          {/* Directional gradient: deep navy on left to guarantee crisp readability, clear on right to showcase dignitaries and unveiled shield */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00142E]/95 via-[#00142E]/75 via-45% to-[#00142E]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#00142E] via-[#00142E]/35 to-black/35" />
        </div>

        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-5 z-[1] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 pb-10 pt-20">
          <Link href="/about" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to About
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="bg-[#00A3FF] text-[#00142E] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-[0_2px_10px_rgba(0,163,255,0.35)]">
              Second Edition
            </span>
            <span className="bg-white/15 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border border-white/20">
              IEEE Xplore Indexed
            </span>
            <span className="bg-white/10 text-white/90 text-xs font-medium px-3 py-1.5 rounded-full border border-white/15 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> 22–23 February 2024
            </span>
          </div>

          <div className="mb-5 pt-1">
            <Image
              src="/logos/ic-etite24-logo-clean.png"
              alt="ic-ETITE'24 Official Logo"
              width={355}
              height={64}
              priority
              className="h-8 sm:h-10 md:h-12 w-auto object-contain drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
            />
            <h1 className="sr-only">ic-ETITE&apos;24</h1>
          </div>
          <p className="text-lg sm:text-xl text-white/90 font-medium max-w-2xl leading-relaxed mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            Second International Conference on Emerging Trends in Information Technology and Engineering
          </p>

          <a
            href="https://ieeexplore.ieee.org/xpl/conhome/10493200/proceeding"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#00A3FF] hover:bg-[#38BDF8] text-[#00142E] font-bold px-6 py-3 rounded-xl shadow-[0_4px_20px_rgba(0,163,255,0.35)] hover:shadow-[0_6px_24px_rgba(56,189,248,0.5)] transition-all text-sm"
          >
            <BookOpen className="w-4 h-4" />
            IEEE Xplore Proceedings
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-[#001a3d] py-12 px-6 sm:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#38BDF8] mb-1">{value}</div>
              <div className="text-white/60 text-xs uppercase tracking-wider font-semibold">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT: TEXT WRAPS ALL AROUND FLOATED PHOTO ── */}
      <section className="py-8 sm:py-12 px-4 sm:px-8 lg:px-12 bg-[#F7F9FC] border-b border-slate-200">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl border-2 border-slate-200/90 p-6 sm:p-8 md:p-10 shadow-sm flow-root">
          {/* Floated Image on Desktop */}
          <div className="w-full sm:w-[380px] md:w-[460px] lg:w-[500px] md:float-right md:ml-8 md:mb-5 mb-6">
            <div className="p-2.5 bg-white border-2 border-slate-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <Image
                  src="/images/icetite24/icetite24_16_inaugural_ceremony_dais.webp"
                  alt="ic-ETITE'24 Inaugural Dais and Chief Guests"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <p className="p-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 font-medium rounded-b-xl mt-2 text-center">
                Chief Guest Shri S. Krishnan, IAS, Secretary MeitY, and university leadership on dais at ic-ETITE&apos;24
              </p>
            </div>
          </div>

          {/* Text flowing all around the picture */}
          <div className="space-y-3.5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#004B87] bg-[#EBF3F8] px-3 py-1 rounded-full border border-[#004B87]/20 inline-block">
              Second Edition Legacy
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#002147] leading-tight">
              About ic-ETITE&apos;24: The Second Edition
            </h2>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
              The <strong>Second IEEE International Conference on Emerging Trends in Information Technology and Engineering (ic-ETITE&apos;24)</strong> was organized on <strong>22nd &amp; 23rd February 2024</strong> at Vellore Institute of Technology (VIT), Vellore, India. Technically co-sponsored by the <strong>IEEE Madras Section</strong> and hosted by the School of Computer Science Engineering and Information Systems (SCORE), the conference demonstrated extraordinary international academic participation.
            </p>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
              The second edition received an astounding <strong>1,688 research manuscript submissions from 19 countries</strong> across the Americas, Europe, Asia, and Africa. Following rigorous double-blind peer reviews, the conference hosted <strong>32 parallel technical sessions</strong> and <strong>22 keynote addresses</strong> delivered by eminent global academicians and industry architects from Microsoft, Amazon, Cisco, and leading research institutes.
            </p>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
              The conference was inaugurated by Chief Guests <strong>Dr. Zvi Galil</strong> (former Dean of Computing at Georgia Institute of Technology, USA) and <strong>Shri S. Krishnan, IAS</strong> (Secretary, Ministry of Electronics and Information Technology [MeitY], Government of India). Alongside scientific proceedings, ic-ETITE&apos;24 featured the national hackathon <strong>BOLT 2.0</strong> with 683 participant registrations and the <strong>TechNext’24</strong> industrial expo showcasing 120+ student engineering prototypes to corporate venture partners.
            </p>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
              All accepted and presented papers were published in the <strong>IEEE Xplore Digital Library</strong> (Conference Record #60085), ensuring lasting global scholarly impact and international citations for the contributing authors.
            </p>
          </div>

          <div className="clear-both pt-4 flex flex-wrap gap-3">
            <a
              href="https://ieeexplore.ieee.org/xpl/conhome/10493200/proceeding"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#00A3FF] hover:bg-[#38BDF8] text-[#00142E] font-bold px-5 py-2.5 rounded-xl transition-all text-xs sm:text-sm shadow-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span>Access IEEE Proceedings</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ── HIGHLIGHTS ── */}
      <section className="py-16 sm:py-20 px-6 sm:px-12 lg:px-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#004B87] bg-[#EBF3F8] px-3 py-1.5 rounded-full border border-[#004B87]/20 inline-block mb-4">
              Key Highlights
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#002147]">
              Highlights of ic-ETITE&apos;24
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map(({ title, body }) => (
              <div key={title} className="bg-[#F7F9FC] border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-[#004B87] shrink-0 mt-0.5" />
                  <h3 className="font-bold text-[#002147] text-base">{title}</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHOTO GALLERY (4x4 Grid, No Captions, Load More) ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 lg:px-12 bg-[#F7F9FC] border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center px-6 mb-10 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#004B87] bg-[#EBF3F8] px-3.5 py-1.5 rounded-full border border-[#004B87]/20 inline-block mb-3">
              Official Photo Archive
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#002147] mb-3">
              ic-ETITE&apos;24 Photo Gallery
            </h2>
            <p className="text-slate-600 text-base max-w-2xl mx-auto">
              Every memorable moment captured during the second edition — inaugural assembly, keynote plenary, 24-hour BOLT 2.0 hackathon, TechNext industrial expo, and international delegate fellowship.
            </p>
          </div>

          {/* 4x4 Photo Grid without caption, with Load More option */}
          <Icetite24PhotoGrid />
        </div>
      </section>

      {/* ── SPONSORS ── */}
      <section className="py-16 sm:py-20 px-6 sm:px-12 lg:px-20 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#004B87] bg-[#EBF3F8] px-3 py-1.5 rounded-full border border-[#004B87]/20 inline-block mb-4">
              Partners & Sponsors
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#002147]">Sponsors & Support</h2>
          </div>
          {/* 1. Main Sponsors Row: 3 columns in a single row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.label}
                className="bg-[#F7F9FC] border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between items-center text-center shadow-xs hover:border-[#004B87]/40 transition-colors min-h-[220px]"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-[#004B87] mb-2">
                  {sponsor.label}
                </div>

                <div className="my-auto py-3 flex items-center justify-center w-full min-h-[80px]">
                  <div className="relative w-full max-w-[200px] h-16 flex items-center justify-center">
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.alt || sponsor.name}
                      width={200}
                      height={64}
                      className="max-h-16 w-auto object-contain"
                    />
                  </div>
                </div>

                <div className="text-[#002147] font-semibold text-sm sm:text-base mt-2">
                  {sponsor.name}
                </div>
              </div>
            ))}
          </div>

          {/* 2. Supported By Section: Dedicated showcase with official logos */}
          <div className="bg-[#F7F9FC] border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs hover:border-[#004B87]/40 transition-colors">
            <div className="text-center mb-6">
              <div className="text-xs font-bold uppercase tracking-wider text-[#004B87] mb-1.5">
                SUPPORTED BY
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#002147]">
                Technical Societies &amp; Corporate Collaborators
              </h3>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/80 p-6 sm:p-8 flex items-center justify-center shadow-xs">
              <div className="relative w-full max-w-4xl aspect-[1024/397]">
                <Image
                  src="/logos/icetite24-supported-by-logos.png"
                  alt="Organizations and companies that supported ic-ETITE'24"
                  fill
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-contain"
                />
              </div>
            </div>

            {/* List of supporting entities */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6 max-w-4xl mx-auto">
              {supportedOrganizations.map((org) => (
                <span
                  key={org}
                  className="px-3 py-1 rounded-full bg-white border border-slate-200 text-[#002147] font-semibold text-xs tracking-tight shadow-xs"
                >
                  {org}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
