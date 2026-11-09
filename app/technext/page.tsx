import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { getSettings } from "@/lib/settings";
import { formatDeadline, isEarlyBird, priceNow, windowState } from "@/lib/pricing";
import PrizePool from "@/components/portal/PrizePool";
import Link from "next/link";
import Image from "@/components/cms/EImage";
import GallerySlideshow, { GalleryItem } from "@/components/GallerySlideshow";
import TechNextFloatingReturn from "@/components/TechNextFloatingReturn";
import {
  ArrowLeft,
  ArrowRight,
  Cpu,
  Layers,
  Award,
  Calendar,
  MapPin,
  CheckCircle2,
  Rocket,
  Building,
  Clock,
  Mail,
} from "lucide-react";
import E from "@/components/cms/E";

export const metadata: Metadata = pageMetadata("/technext", {
  title: "TechNext '28 | National Industrial Expo & Innovation Showcase",
  description:
    "Official page of TechNext '28, the flagship national industrial exposition and student project innovation showcase at VIT Vellore.",
});

const technextGalleryItems: GalleryItem[] = [
  {
    id: "technext24-01",
    image: "/images/technext24/technext_01.webp",
    title: "TechNext'24 Industrial Expo Launch & Inception",
    edition: "TechNext'24 Industrial Expo",
    location: "Technology Tower Expo Grounds, VIT Vellore",
    caption:
      "Inaugural walkthrough of student-built hardware prototypes and corporate booths at VIT Vellore.",
    category: "2024",
  },
  {
    id: "technext24-02",
    image: "/images/technext24/technext_02.webp",
    title: "Student Hardware Innovation & Embedded Systems",
    edition: "TechNext'24 Industrial Expo",
    location: "Expo Arena, VIT Vellore",
    caption:
      "Teams demonstrating microcontroller architectures and live automation solutions to visiting jury members.",
    category: "2024",
  },
  {
    id: "technext24-03",
    image: "/images/technext24/technext_03.webp",
    title: "Autonomous Robotics & Smart Mobility Chassis",
    edition: "TechNext'24 Industrial Expo",
    location: "Robotics Arena, VIT Vellore",
    caption:
      "3D-printed modular rover chassis and autonomous vehicle prototypes engineered by student innovators.",
    category: "2024",
  },
  {
    id: "technext24-04",
    image: "/images/technext24/technext_04.webp",
    title: "Precision Sensor Array & Motor Controllers",
    edition: "TechNext'24 Industrial Expo",
    location: "Hardware Prototyping Hall, VIT Vellore",
    caption:
      "Testing custom motor control circuits and telemetry sensor systems during live exhibition trials.",
    category: "2024",
  },
  {
    id: "technext24-05",
    image: "/images/technext24/technext_05.webp",
    title: "Industry Dignitaries & Jury Evaluation Track",
    edition: "TechNext'24 Industrial Expo",
    location: "Evaluation Dais, VIT Vellore",
    caption:
      "Distinguished academic deans and industry architects examining project feasibility and commercial viability.",
    category: "2024",
  },
  {
    id: "technext24-06",
    image: "/images/technext24/technext_06.webp",
    title: "Deep Tech & Applied AI Demonstrations",
    edition: "TechNext'24 Industrial Expo",
    location: "Software & AI Pavilion, VIT Vellore",
    caption:
      "Interactive software frameworks and intelligent edge-computing algorithms solving real-world challenges.",
    category: "2024",
  },
  {
    id: "technext24-07",
    image: "/images/technext24/technext_07.webp",
    title: "Interactive STEM Demonstrations & Peer Exchange",
    edition: "TechNext'24 Industrial Expo",
    location: "Exhibition Floor, VIT Vellore",
    caption:
      "Cross-disciplinary collaboration and knowledge sharing among engineering participants and researchers.",
    category: "2024",
  },
  {
    id: "technext24-08",
    image: "/images/technext24/technext_08.webp",
    title: "Industry Mentors Reviewing Working Prototypes",
    edition: "TechNext'24 Industrial Expo",
    location: "Demonstration Booths, VIT Vellore",
    caption:
      "Mentors from leading tech corporate partners providing technical feedback on functional circuit designs.",
    category: "2024",
  },
  {
    id: "technext24-09",
    image: "/images/technext24/technext_09.webp",
    title: "Hardware Telemetry & IoT Sensor Exhibits",
    edition: "TechNext'24 Industrial Expo",
    location: "IoT Showcase Hall, VIT Vellore",
    caption:
      "Live environmental and industrial sensor metrics streamed to cloud analytics dashboards.",
    category: "2024",
  },
  {
    id: "technext24-10",
    image: "/images/technext24/technext_10.webp",
    title: "Project Architecture Defense & Technical Q&A",
    edition: "TechNext'24 Industrial Expo",
    location: "Jury Review Stalls, VIT Vellore",
    caption:
      "Student project creators defending design choices, cost structures, and power efficiency metrics.",
    category: "2024",
  },
  {
    id: "technext24-11",
    image: "/images/technext24/technext_11.webp",
    title: "Robotics Arena Live Maneuvering Demonstration",
    edition: "TechNext'24 Industrial Expo",
    location: "Robotics Testing Floor, VIT Vellore",
    caption:
      "Field testing of obstacle-avoidance rovers and precision actuator mechanisms before the judges.",
    category: "2024",
  },
  {
    id: "technext24-12",
    image: "/images/technext24/technext_12.webp",
    title: "Faculty Convenors & Organizers Tour",
    edition: "TechNext'24 Industrial Expo",
    location: "SCORE Pavilion, VIT Vellore",
    caption:
      "School of Computer Science Engineering faculty convenors visiting project stalls across exhibition zones.",
    category: "2024",
  },
  {
    id: "technext24-13",
    image: "/images/technext24/technext_13.webp",
    title: "Startup Incubation & Venture Evaluation",
    edition: "TechNext'24 Industrial Expo",
    location: "Startup Pavilion, VIT Vellore",
    caption:
      "Early-stage venture pitches evaluated for patenting, incubation support, and prototype acceleration.",
    category: "2024",
  },
  {
    id: "technext24-14",
    image: "/images/technext24/technext_14.webp",
    title: "Hardware Interface & Debugging Sessions",
    edition: "TechNext'24 Industrial Expo",
    location: "Innovation Arena, VIT Vellore",
    caption:
      "Hands-on calibration and real-time sensor tuning conducted during continuous booth exhibitions.",
    category: "2024",
  },
  {
    id: "technext24-15",
    image: "/images/technext24/technext_15.webp",
    title: "Finalist Review & Outstanding Project Nominations",
    edition: "TechNext'24 Industrial Expo",
    location: "Main Exhibition Dais, VIT Vellore",
    caption:
      "Selecting the top engineering innovations across smart hardware, healthcare tech, and automation.",
    category: "2024",
  },
  {
    id: "technext24-16",
    image: "/images/technext24/technext_16.webp",
    title: "Inter-University Student Innovator Delegations",
    edition: "TechNext'24 Industrial Expo",
    location: "Central Expo Concourse, VIT Vellore",
    caption:
      "Delegations representing leading technical institutions from across the country showcasing inventions.",
    category: "2024",
  },
  {
    id: "technext24-17",
    image: "/images/technext24/technext_17.webp",
    title: "Sustainable Green Technology & IoT Clean Energy",
    edition: "TechNext'24 Industrial Expo",
    location: "Sustainability Pavilion, VIT Vellore",
    caption:
      "Renewable energy controllers, smart micro-grids, and efficiency monitors exhibited by participants.",
    category: "2024",
  },
  {
    id: "technext24-18",
    image: "/images/technext24/technext_18.webp",
    title: "Valedictory Awards & Innovation Cash Prize Ceremony",
    edition: "TechNext'24 Industrial Expo",
    location: "Auditorium Stage, VIT Vellore",
    caption:
      "Celebrating winning innovator teams with merit certificates, cash prizes, and incubation grants.",
    category: "2024",
  },
  {
    id: "technext24-19",
    image: "/images/technext24/technext_19.webp",
    title: "Excellence in Engineering Project Awards",
    edition: "TechNext'24 Industrial Expo",
    location: "Valedictory Hall, VIT Vellore",
    caption:
      "Honoring pioneering student breakthroughs with coveted TechNext'24 trophies.",
    category: "2024",
  },
  {
    id: "technext24-20",
    image: "/images/technext24/technext_20.webp",
    title: "Interactive STEM Demonstrations & Gadget Trials",
    edition: "TechNext'24 Industrial Expo",
    location: "Exhibition Floor, VIT Vellore",
    caption:
      "Attendees and visitors trying out functional prototypes across technical tracks.",
    category: "2024",
  },
  {
    id: "technext24-21",
    image: "/images/technext24/technext_21.webp",
    title: "Industry Partnerships & Corporate Booth Tour",
    edition: "TechNext'24 Industrial Expo",
    location: "Partner Stalls, VIT Vellore",
    caption:
      "Corporate delegates showcasing advanced hardware developer toolkits to university researchers.",
    category: "2024",
  },
  {
    id: "technext24-22",
    image: "/images/technext24/technext_22.webp",
    title: "Innovators Group Showcase at VIT Vellore",
    edition: "TechNext'24 Industrial Expo",
    location: "Technology Tower, VIT Vellore",
    caption:
      "Student hardware designers gathered for milestone event photography.",
    category: "2024",
  },
  {
    id: "technext24-23",
    image: "/images/technext24/technext_23.webp",
    title: "Hands-on Product Testing & Sensor Calibrations",
    edition: "TechNext'24 Industrial Expo",
    location: "Expo Arena, VIT Vellore",
    caption:
      "Real-time accuracy validation of medical instrumentation and robotic manipulators.",
    category: "2024",
  },
  {
    id: "technext24-24",
    image: "/images/technext24/technext_24.webp",
    title: "Cash Prizes & Incubation Grant Handover",
    edition: "TechNext'24 Industrial Expo",
    location: "Anna Auditorium, VIT Vellore",
    caption:
      "Cheque handover to top podium finishers by academic dignitaries and industry leads.",
    category: "2024",
  },
  {
    id: "technext24-25",
    image: "/images/technext24/technext_25.webp",
    title: "TechNext'24 Concluding Delegation & Organizer Portrait",
    edition: "TechNext'24 Industrial Expo",
    location: "Technology Tower Front Lawns, VIT Vellore",
    caption:
      "Grand group photo uniting project teams, faculty coordinators, and corporate guests at VIT Vellore.",
    category: "2024",
  },
];

export default async function TechNextPage() {
  const settings = await getSettings();
  if (!settings.visibility.technext) notFound();
  const tn = settings.technext;
  const bookingOpen = settings.visibility.technextRegistration && windowState(tn.opensAt, tn.closesAt) === "open";
  const early = isEarlyBird(tn.earlyBird);
  const categories = [
    {
      icon: Cpu,
      title: "Smart Hardware & Embedded Systems",
      desc: "Microcontroller prototypes, FPGA boards, edge AI devices, and robotics systems solving industrial automation challenges.",
    },
    {
      icon: Layers,
      title: "AI, Deep Tech & Software Platforms",
      desc: "Applied machine learning prototypes, computer vision tools, real-time analytics, and cybersecurity demonstrations.",
    },
    {
      icon: Rocket,
      title: "Startup & Venture Pavilion",
      desc: "Early-stage deep tech startups exhibiting commercially viable products to investors, mentors, and corporate partners.",
    },
    {
      icon: Building,
      title: "Industry & Corporate Partner Stalls",
      desc: "Leading multinational tech firms displaying next-generation industrial toolkits, cloud platforms, and developer hardware.",
    },
  ];

  return (
    <div className="bg-brand-surface text-slate-900 min-h-screen">
      {/* ── HERO SECTION (MATCHES IC-ETITE HOME NAVY BG) ── */}
      <section id="hero" className="relative pt-10 pb-16 sm:pt-14 sm:pb-24 overflow-hidden bg-brand-primary border-b border-white/15 text-white">
        <div className="container-x">
          {/* Top Left Return Button - ONLY ONE ON THE PAGE */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/25 shadow-sm transition-all hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 text-[#84E320]" />
              <span><E f="technext">{"Back to ic-ETITE'28 Home"}</E></span>
            </Link>
          </div>

          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* TechNext '28 Official Brand Logo */}
            <div className="flex justify-center mb-4">
              <div className="relative h-16 sm:h-22 md:h-26 w-72 sm:w-96 md:w-[440px]">
                <Image
                  src="/logos/technext-logo.png"
                  alt="TechNext '28 Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]"><E f="technext">{"The National Industrial Expo & Innovation Showcase"}</E></h1>

            <p className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed font-normal"><E f="technext">{"Bringing together student inventors, corporate R&D teams, venture capital investors, and deep-tech startups at VIT Vellore."}</E></p>

            {/* Quick Meta Pills - Location: VIT Vellore */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-semibold">
                <Calendar className="w-4 h-4 text-[#84E320]" />
                <span><E f="technext">{"10–11 February 2028"}</E></span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-semibold">
                <MapPin className="w-4 h-4 text-[#84E320]" />
                <span><E f="technext">{"VIT Vellore"}</E></span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-semibold">
                <Award className="w-4 h-4 text-[#84E320]" />
                <span><E f="technext">{"Best Engineering Project Awards"}</E></span>
              </div>
            </div>

            {/* Hero CTA - Only registration button, no duplicate back button */}
            <div className="flex items-center justify-center pt-4">
              <a
                href={bookingOpen ? "/technext/register" : "#register"}
                className="bg-brand-secondary hover:bg-brand-primary-hover text-white font-bold text-sm sm:text-base py-3.5 px-8 rounded-xl inline-flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 shadow-lg border border-white/20"
              >
                <span>{bookingOpen ? "Book Your Stall" : "Register Your Project / Stall (TBA)"}</span>
                <ArrowRight className="w-4 h-4 text-[#84E320]" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT TECHNEXT: TEXT WRAPS ALL AROUND FLOATED PHOTO ── */}
      <section id="about" className="py-8 sm:py-12 bg-white border-b border-slate-200">
        <div className="container-x">
          <div className="bg-brand-surface rounded-2xl border-2 border-slate-200/90 p-6 sm:p-8 md:p-10 shadow-sm flow-root">
            {/* Floated Image on Desktop */}
            <div className="w-full sm:w-[380px] md:w-[460px] lg:w-[500px] md:float-right md:ml-8 md:mb-5 mb-6">
              <div className="p-2.5 bg-white border-2 border-slate-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <Image
                    src="/images/technext24/technext_01.webp"
                    alt="TechNext Expo Showcase at VIT Vellore"
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 font-medium rounded-b-xl mt-2 text-center"><E f="technext">{"Live hardware prototype demonstrations by innovators to industry jury at VIT Vellore"}</E></div>
              </div>
            </div>

            {/* Text flowing all around the picture */}
            <div className="space-y-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary bg-[#EBF3F8] px-3 py-1 rounded-full border border-brand-secondary/20 inline-block"><E f="technext">{"Expo Overview & Hardware Showcase"}</E></span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-primary tracking-tight"><E f="technext">{"Empowering Tangible Hardware & Deep-Tech Ingenuity"}</E></h2>

              <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
                <strong><E f="technext">{"TechNext"}</E></strong><E f="technext">{" is the flagship industrial expo and engineering project competition hosted as a core feature of the ic-ETITE conference at VIT Vellore. It brings academic theory into tangible physical reality with live functional prototypes, autonomous robotics, edge IoT sensor suites, embedded electronic telemetry, and applied deep-tech demonstrations."}</E></p>

              <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify"><E f="technext">{"Student innovators, research scholars, and early-stage deep-tech startups are provided with equipped demonstration booths complete with power supplies, oscilloscope testing benches, high-speed Wi-Fi, and public exhibition areas. Corporate architects, IEEE Fellows, and venture partners from top firms directly evaluate project designs based on algorithmic novelty, structural elegance, commercial viability, and societal impact."}</E></p>

              <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify"><E f="technext">{"In addition to competitive exhibition tracks, TechNext hosts interactive corporate pavilions where multinational technology leaders display emerging development platforms, developer boards, and quantum computing simulators to student delegates."}</E></p>

              {/* Milestones Card */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2 mt-4">
                <p className="text-xs font-bold text-brand-secondary uppercase tracking-wide"><E f="technext">{"TechNext '24 Key Milestones:"}</E></p>
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xl font-bold text-brand-primary"><E f="technext">{"120+"}</E></p>
                    <p className="text-[10.5px] text-slate-600 uppercase font-semibold"><E f="technext">{"Working Projects"}</E></p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xl font-bold text-[#15803d]"><E f="technext">{"15+"}</E></p>
                    <p className="text-[10.5px] text-slate-600 uppercase font-semibold"><E f="technext">{"Startups & Stalls"}</E></p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xl font-bold text-brand-primary"><E f="technext">{"₹50K+"}</E></p>
                    <p className="text-[10.5px] text-slate-600 uppercase font-semibold"><E f="technext">{"Award Grants"}</E></p>
                  </div>
                </div>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 pt-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                  <span><E f="technext">{"Jury evaluation by industrial architects from leading tech corporations."}</E></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                  <span><E f="technext">{"Dedicated demo booths with power supply, testing benches, and Wi-Fi at VIT Vellore."}</E></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                  <span><E f="technext">{"Direct recruitment & seed funding evaluation by investor delegations."}</E></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── PHOTO GALLERY SLIDESHOW ── */}
      <section id="gallery" className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-[#F7F9FC] border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 px-6">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-secondary bg-[#EBF3F8] px-3 py-1.5 rounded-full border border-brand-secondary/20 inline-block mb-4"><E f="technext">{"Official Photo Archive"}</E></span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-primary mb-2"><E f="technext">{"TechNext '24 Highlights"}</E></h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto"><E f="technext">{"Moments from the 2024 industrial expo and project showcase at VIT Vellore."}</E></p>
          </div>
          <GallerySlideshow items={technextGalleryItems} showCategoryFilter={false} />
        </div>
      </section>

      {/* ── EXPO CATEGORIES ── */}
      <section id="categories" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary bg-[#EBF3F8] px-3 py-1.5 rounded-full border border-brand-secondary/20 inline-block mb-3"><E f="technext">{"Exhibition Domains"}</E></span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-primary tracking-tight underline decoration-brand-secondary underline-offset-8"><E f="technext">{"TechNext '28 Exhibit Categories"}</E></h2>
            <p className="text-sm sm:text-base text-slate-600 mt-4"><E f="technext">{"Teams and enterprises can register to display products and prototypes at VIT Vellore across the following tracks:"}</E></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.title}
                  className="p-7 rounded-2xl bg-brand-surface border border-slate-200 hover:border-brand-secondary hover:bg-white shadow-2xs hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#EBF3F8] text-brand-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-primary mb-2 group-hover:text-brand-secondary transition-colors">
                    <E f="technext">{cat.title}</E>
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    <E f="technext">{cat.desc}</E>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── REGISTRATION SECTION (TBA) ── */}
      <section id="register" className="py-16 sm:py-24 bg-brand-surface">
        <div className="container-x text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>{bookingOpen ? "Stall Booking Open" : "Registration: TBA (Opening Soon)"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-primary tracking-tight leading-tight underline decoration-brand-secondary underline-offset-8"><E f="technext">{"Ready to Exhibit at TechNext ’28?"}</E></h2>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal pt-2">
            {bookingOpen
              ? "Choose a stall, tell us what you will exhibit, and track approval and payment from your dashboard."
              : "Registration details, stall allocation, and project entry guidelines for VIT Vellore will be formally announced soon (TBA)."}
          </p>

          {(tn.prizes.length > 0 || tn.prizePool) && (
            <div className="mx-auto max-w-2xl text-left">
              <PrizePool prizes={tn.prizes} pool={tn.prizePool} title="TechNext awards" />
            </div>
          )}

          {bookingOpen && (
            <div className="flex flex-wrap justify-center gap-3">
              {(early || tn.closesAt) && (
                <div className="flex w-full flex-wrap justify-center gap-2 text-xs font-bold">
                  {early && <span className="rounded-full bg-emerald-600 px-3 py-1.5 text-white"><E f="technext">{"Early-bird prices until "}</E>{formatDeadline(tn.earlyBird.endsAt)}</span>}
                  {tn.closesAt && <span className="rounded-full bg-brand-primary px-3 py-1.5 text-white"><E f="technext">{"Booking deadline: "}</E>{formatDeadline(tn.closesAt)}</span>}
                </div>
              )}
              {tn.stallTypes.map((st) => {
                const p = priceNow(st.price, st.earlyPrice, tn.earlyBird);
                return (
                  <div key={st.key} className="rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-left shadow-sm">
                    <p className="font-bold text-brand-primary"><E f="technext">{st.label}</E></p>
                    <p className="text-xs text-slate-500"><E f="technext">{st.size}</E></p>
                    {p.early && <p className="mt-1 text-xs font-semibold text-slate-400 line-through"><E f="technext">{"INR "}</E>{st.price.toLocaleString("en-IN")}</p>}
                    <p className={`font-black ${p.early ? "text-emerald-700" : "text-[#F37021]"}`}>{p.amount ? `INR ${p.amount.toLocaleString("en-IN")}` : "Free"}</p>
                  </div>
                );
              })}
              <div className="w-full">
                <Link
                  href="/technext/register"
                  className="inline-flex items-center gap-2 rounded-full bg-[#F37021] px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#d85f15]"
                ><E f="technext">{"Book a stall "}</E><ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}

          <div className="p-6 rounded-2xl bg-white border-2 border-slate-200 shadow-md max-w-md mx-auto text-left space-y-3">
            <p className="text-xs uppercase font-bold text-brand-secondary tracking-wider flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-brand-secondary" />
              <span><E f="technext">{"Exhibitor Enquiries"}</E></span>
            </p>
            <p className="text-sm text-slate-700"><E f="technext">{"For industry booth bookings, sponsorships, or academic project submissions:"}</E></p>
            <p className="text-base font-bold text-brand-primary pt-1">
              <a href="mailto:icetiteconference@vit.ac.in" className="text-brand-secondary hover:underline"><E f="technext">{"icetiteconference@vit.ac.in"}</E></a>
            </p>
          </div>

          <div className="pt-4 flex items-center justify-center">
            <Link
              href="/hackathon"
              className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-sm sm:text-base py-3.5 px-7 rounded-xl inline-flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              <span><E f="technext">{"Explore BOLT 3.0 Hackathon"}</E></span>
              <ArrowRight className="w-4 h-4 text-[#84E320]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Overlay Button to Return to Home on Scroll */}
      <TechNextFloatingReturn />
    </div>
  );
}
