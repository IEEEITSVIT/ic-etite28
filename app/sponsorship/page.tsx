import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";
import {
  Crown,
  Award,
  Medal,
  CheckCircle2,
  Download,
  Mail,
  Building2,
  FileText,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = pageMetadata("/sponsorship", {
  title: "Sponsorship Packages & Corporate Partnerships | ic-ETITE",
  description:
    "Official corporate and academic sponsorship tiers for ic-ETITE at VIT Vellore. Gain unmatched national branding, prominent campus LED broadcasts, keynote slots, hackathon judging, and premier exhibition spaces.",
});

interface SponsorTier {
  name: string;
  price: string;
  badge: string;
  tagline: string;
  icon: typeof Crown;
  headerBg: string;
  accentColor: string;
  borderColor: string;
  buttonBg: string;
  isPopular?: boolean;
  benefits: string[];
}

const sponsorTiers: SponsorTier[] = [
  {
    name: "Platinum Sponsor",
    price: "₹ 5,00,000",
    badge: "Title Sponsor · Maximum Brand Impact",
    tagline:
      "Premier tier with title sponsor naming rights, premier campus visibility, and dedicated event slots.",
    icon: Crown,
    headerBg: "bg-gradient-to-br from-[#001733] via-[#002B5B] to-[#001733]",
    accentColor: "text-[#FFB81C]",
    borderColor: "border-[#FFB81C] ring-2 ring-[#FFB81C]/25 shadow-xl",
    buttonBg: "bg-[#002147] hover:bg-[#003366] text-[#FFB81C] border border-[#FFB81C]/30",
    isPopular: true,
    benefits: [
      "Company will be identified as the Title Sponsor for ic-ETITE'28.",
      "Branding around campus during the conference through high-impact LED screens across academic blocks and plazas.",
      "One full-page advertisement in the official conference program booklet.",
      "Publicity on campus at the Academic Blocks (during Pre-ic-ETITE and all two days of ic-ETITE).",
      "Nation-wide circulation of commercials through our online media partners.",
      "Marketing through standees inside the campus everywhere.",
      "Dedicated speaker time pre/post conference with non-competing program.",
      "Prominent advertisement on the ic-ETITE'28 website and mobile app.",
      "Name and Logo printed on the official conference T-Shirt.",
      "Dedicated sponsor webpage on conference website (content delivered once approved by committee).",
      "Official judge for the TechNext '28 Exhibition and BOLT 3.0 Hackathon.",
      "Keynote speaker session and tailored corporate event during the conference.",
      "Complimentary 10×10 sq ft exhibition stall for two full days.",
    ],
  },
  {
    name: "Gold Sponsor",
    price: "₹ 3,50,000",
    badge: "Co-Sponsor · High Campus Visibility",
    tagline:
      "Distinguished co-sponsor prominence across academic blocks, digital media, and exhibition arena.",
    icon: Award,
    headerBg: "bg-gradient-to-br from-[#1C1404] via-[#332208] to-[#140D02]",
    accentColor: "text-[#F59E0B]",
    borderColor: "border-amber-300/80 hover:border-amber-400 shadow-md",
    buttonBg: "bg-[#2A1B0A] hover:bg-[#3D270F] text-[#FBBF24] border border-amber-400/30",
    benefits: [
      "Company will be identified as a Co-Sponsor for ic-ETITE'28.",
      "Branding around campus during the conference through LED screens (more than 30–40 times daily).",
      "Publicity on campus at the Academic Blocks (during Pre-ic-ETITE and all two days of ic-ETITE).",
      "One half-page advertisement in the official conference program booklet.",
      "Nation-wide circulation of commercials through our online media partners.",
      "Marketing through standees placed strategically inside the campus.",
      "Prominent advertisement on the ic-ETITE'28 website and mobile app.",
      "Name and Logo printed on the official conference T-Shirt.",
      "Dedicated speaker session at the conference.",
      "Complimentary 10×10 sq ft exhibition stall for two full days.",
    ],
  },
  {
    name: "Silver Sponsor",
    price: "₹ 2,00,000",
    badge: "Conference Sponsor · Essential Presence",
    tagline:
      "Core conference sponsor package with campus LED branding, marketing standees, and stall space.",
    icon: Medal,
    headerBg: "bg-gradient-to-br from-[#1E293B] via-[#334155] to-[#0F172A]",
    accentColor: "text-slate-200",
    borderColor: "border-slate-300 hover:border-slate-400 shadow-md",
    buttonBg: "bg-[#002147] hover:bg-[#003366] text-white",
    benefits: [
      "Company will be identified as a Sponsor for ic-ETITE'28.",
      "Branding around campus during the conference through LED screens (more than 10–25 times daily).",
      "Publicity on campus at the Academic Blocks (during Pre-ic-ETITE and all two days of ic-ETITE).",
      "Nation-wide circulation of commercials through our online media partners.",
      "Marketing through standees inside the campus.",
      "Advertisement on the ic-ETITE'28 website and mobile app.",
      "Name and Logo printed on the official conference T-Shirt.",
      "Speaker session at the conference.",
      "Complimentary 5×5 sq ft exhibition stall for one full day.",
    ],
  },
];

export default function SponsorshipPage() {
  return (
    <div className="bg-[#FAFBFD] min-h-screen text-[#002147]">
      {/* ── HERO BANNER ── */}
      <PageHeader
        badge="Corporate Partnerships · Global Visibility"
        title="Conference Sponsorship"
        subtitle="Partner with ic-ETITE at VIT Vellore. Gain unmatched national branding, prominent campus LED broadcasts, keynote slots, hackathon judging, and premier exhibition spaces."
        breadcrumb="Sponsorship"
        bgImage="/images/frame_15.webp"
      />

      <div className="container-x py-10 sm:py-16 space-y-16">
        {/* ── SPONSORSHIP PACKAGES SECTION ── */}
        <section id="packages" className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#004B87] bg-[#EBF3F8] px-3.5 py-1.5 rounded-full border border-[#004B87]/20 inline-block">
              Sponsorship Packages &amp; Entitlements
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#002147] tracking-tight">
              Select Your Sponsorship Tier
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Tailored sponsorship packages designed to maximize corporate visibility, talent pipeline acquisition, and thought leadership at VIT Vellore.
            </p>
          </div>

          {/* Pricing Tier Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-2">
            {sponsorTiers.map((tier) => {
              const TierIcon = tier.icon;
              return (
                <div
                  key={tier.name}
                  className={`relative flex flex-col rounded-3xl bg-white border-2 transition-all duration-300 hover:-translate-y-1 overflow-hidden ${tier.borderColor}`}
                >
                  {/* Highlight Ribbon for Title Sponsor */}
                  {tier.isPopular && (
                    <div className="bg-[#FFB81C] text-[#002147] text-center py-2 text-xs font-black uppercase tracking-widest border-b border-[#E5A717] shadow-xs flex items-center justify-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 fill-[#002147]" />
                      <span>★ Most Comprehensive Package</span>
                    </div>
                  )}

                  {/* Header Box */}
                  <div className={`p-5 sm:p-6 text-white ${tier.headerBg} border-b border-white/10`}>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold tracking-wide">
                        <TierIcon className={`w-3.5 h-3.5 ${tier.accentColor}`} />
                        <span>{tier.badge}</span>
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
                      {tier.name}
                    </h3>
                    <p className="text-xs text-white/80 mt-1.5 leading-relaxed font-normal">
                      {tier.tagline}
                    </p>

                    <div className="mt-5 pt-4 border-t border-white/15 flex items-baseline gap-2 whitespace-nowrap">
                      <span className="text-2xl sm:text-[26px] xl:text-3xl font-serif font-black text-white tracking-tight whitespace-nowrap">
                        {tier.price}
                      </span>
                      <span className="text-[10px] sm:text-xs font-semibold text-white/70 uppercase tracking-wide whitespace-nowrap">
                        + Applicable GST
                      </span>
                    </div>
                  </div>

                  {/* Benefits List */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
                        Included Entitlements &amp; Benefits:
                      </p>
                      <ul className="space-y-3 text-xs sm:text-[13px] text-slate-700 font-normal">
                        {tier.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 text-[#004B87] shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Inquiry Button */}
                    <div className="pt-4 border-t border-slate-100">
                      <a
                        href={`mailto:icetiteconference@vit.ac.in?subject=ic-ETITE%20${encodeURIComponent(
                          tier.name
                        )}%20Inquiry`}
                        className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md hover:scale-[1.02] ${tier.buttonBg}`}
                      >
                        <Mail className="w-4 h-4" />
                        <span>Inquire for {tier.name}</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── PARTNERS & SPONSORS SECTIONS (KEPT BLANK PER INSTRUCTION) ── */}
        <section id="partners" className="pt-8 border-t border-slate-200 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#004B87] bg-[#EBF3F8] px-3.5 py-1.5 rounded-full border border-[#004B87]/20 inline-block">
              Institutional &amp; Technical Backing
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#002147]">
              Conference Partners &amp; Patrons
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Corporate and academic sponsors are announced on a rolling basis following committee reviews.
            </p>
          </div>

          {/* 1. TECHNICAL CO-SPONSOR */}
          <div className="flex flex-col items-center text-center space-y-5">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-[#002147] underline decoration-[#004B87] underline-offset-8">
              TECHNICAL CO-SPONSOR
            </h3>
            {/* Blank placeholder frame as requested */}
            <div className="w-full max-w-2xl min-h-[100px] border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center p-6 bg-slate-50/70">
              <span className="text-xs sm:text-sm text-slate-400 font-semibold tracking-wide uppercase">
                To Be Announced
              </span>
            </div>
          </div>

          {/* 2. TITLE SPONSOR */}
          <div className="flex flex-col items-center text-center space-y-5">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-[#002147] underline decoration-[#004B87] underline-offset-8">
              TITLE SPONSOR
            </h3>
            {/* Blank placeholder frame as requested */}
            <div className="w-full max-w-2xl min-h-[100px] border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center p-6 bg-slate-50/70">
              <span className="text-xs sm:text-sm text-slate-400 font-semibold tracking-wide uppercase">
                To Be Announced
              </span>
            </div>
          </div>

          {/* 3. TECHNOLOGY PARTNER AND CO-TITLE SPONSOR */}
          <div className="flex flex-col items-center text-center space-y-5">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-[#002147] underline decoration-[#004B87] underline-offset-8">
              TECHNOLOGY PARTNER AND CO-TITLE SPONSOR
            </h3>
            {/* Blank placeholder frame as requested */}
            <div className="w-full max-w-2xl min-h-[100px] border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center p-6 bg-slate-50/70">
              <span className="text-xs sm:text-sm text-slate-400 font-semibold tracking-wide uppercase">
                To Be Announced
              </span>
            </div>
          </div>

          {/* 4. SUPPORTED BY */}
          <div className="flex flex-col items-center text-center space-y-5">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-[#002147] underline decoration-[#004B87] underline-offset-8">
              SUPPORTED BY
            </h3>
            {/* Blank placeholder frame as requested */}
            <div className="w-full max-w-3xl min-h-[120px] border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center p-6 bg-slate-50/70">
              <span className="text-xs sm:text-sm text-slate-400 font-semibold tracking-wide uppercase">
                To Be Announced
              </span>
            </div>
          </div>
        </section>

        {/* ── BROCHURES & CONTACT SECRETARIAT ── */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#002147] to-[#001733] text-white shadow-xl border border-white/15">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#CCFF00] bg-white/10 px-3 py-1 rounded-full border border-white/20 inline-block">
                Sponsorship Secretariat &amp; Inquiries
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Interested in Custom Sponsorship or Event Co-Hosting?
              </h3>
              <p className="text-sm text-white/80 leading-relaxed font-normal max-w-2xl">
                We offer tailored exhibition booths at <strong>TechNext Expo</strong>, customized challenge statements for the <strong>BOLT Hackathon</strong>, and branded keynote halls. Reach out to our organizing committee to receive customized proposals.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-white/90">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-[#FFB81C]" />
                  <a
                    href="mailto:icetiteconference@vit.ac.in"
                    className="hover:underline font-bold text-white"
                  >
                    icetiteconference@vit.ac.in
                  </a>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#CCFF00]" />
                  <span>SCORE, VIT Vellore, Tamil Nadu 632014</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-3">
              <a
                href="https://icetite.vit.ac.in/docs/CONF_BROCHURE_INR.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#004B87] hover:bg-[#003366] text-white font-bold text-xs sm:text-sm transition-all shadow-md border border-white/20 hover:scale-[1.02]"
              >
                <Download className="w-4 h-4 text-[#CCFF00]" />
                <span>Download Sponsorship Brochure (PDF)</span>
              </a>

              <a
                href="/ic-ETITE'28.pdf"
                download="ic-ETITE'28.pdf"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all border border-white/25 hover:scale-[1.02]"
              >
                <FileText className="w-4 h-4 text-[#FFB81C]" />
                <span>Download Conference Brochure (PDF)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
