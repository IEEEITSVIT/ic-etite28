import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import type { SponsorStyle } from "@/data/sponsorship";
import Link from "next/link";
import Image from "@/components/cms/EImage";
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
import E from "@/components/cms/E";

export const metadata: Metadata = pageMetadata("/sponsorship", {
  title: "Sponsorship Packages & Corporate Partnerships | ic-ETITE",
  description:
    "Official corporate and academic sponsorship tiers for ic-ETITE at VIT Vellore. Gain unmatched national branding, prominent campus LED broadcasts, keynote slots, hackathon judging, and premier exhibition spaces.",
});

// Card look per package style; content comes from the CMS (admin → Site content).
const STYLES: Record<SponsorStyle, { icon: typeof Crown; headerBg: string; accentColor: string; borderColor: string; buttonBg: string }> = {
  platinum: {
    icon: Crown,
    headerBg: "bg-gradient-to-br from-brand-primary-dark via-[#002B5B] to-brand-primary-dark",
    accentColor: "text-brand-accent",
    borderColor: "border-brand-accent ring-2 ring-brand-accent/25 shadow-xl",
    buttonBg: "bg-brand-primary hover:bg-brand-primary-hover text-brand-accent border border-brand-accent/30",
  },
  gold: {
    icon: Award,
    headerBg: "bg-gradient-to-br from-[#1C1404] via-[#332208] to-[#140D02]",
    accentColor: "text-[#F59E0B]",
    borderColor: "border-amber-300/80 hover:border-amber-400 shadow-md",
    buttonBg: "bg-[#2A1B0A] hover:bg-[#3D270F] text-[#FBBF24] border border-amber-400/30",
  },
  silver: {
    icon: Medal,
    headerBg: "bg-gradient-to-br from-[#1E293B] via-[#334155] to-[#0F172A]",
    accentColor: "text-slate-200",
    borderColor: "border-slate-300 hover:border-slate-400 shadow-md",
    buttonBg: "bg-brand-primary hover:bg-brand-primary-hover text-white",
  },
  bronze: {
    icon: Medal,
    headerBg: "bg-gradient-to-br from-[#3B1F0E] via-[#5C3317] to-[#2A160A]",
    accentColor: "text-orange-300",
    borderColor: "border-orange-300/80 hover:border-orange-400 shadow-md",
    buttonBg: "bg-[#3B1F0E] hover:bg-[#5C3317] text-orange-200",
  },
};

export default async function SponsorshipPage() {
  const { sponsorship } = await getSettings();
  const sponsorTiers = sponsorship.packages.map((p) => ({ ...p, ...STYLES[p.style] ?? STYLES.silver, isPopular: p.popular }));
  return (
    <div className="bg-brand-surface min-h-screen text-brand-primary">
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
            <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary bg-[#EBF3F8] px-3.5 py-1.5 rounded-full border border-brand-secondary/20 inline-block"><E f="sponsorship">{"Sponsorship Packages & Entitlements"}</E></span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-brand-primary tracking-tight"><E f="sponsorship">{"Select Your Sponsorship Tier"}</E></h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto"><E f="sponsorship">{"Tailored sponsorship packages designed to maximize corporate visibility, talent pipeline acquisition, and thought leadership at VIT Vellore."}</E></p>
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
                    <div className="bg-brand-accent text-brand-primary text-center py-2 text-xs font-black uppercase tracking-widest border-b border-[#E5A717] shadow-xs flex items-center justify-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 fill-brand-primary" />
                      <span><E f="sponsorship">{"★ Most Comprehensive Package"}</E></span>
                    </div>
                  )}

                  {/* Header Box */}
                  <div className={`p-5 sm:p-6 text-white ${tier.headerBg} border-b border-white/10`}>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold tracking-wide">
                        <TierIcon className={`w-3.5 h-3.5 ${tier.accentColor}`} />
                        <span><E f="sponsorship">{tier.badge}</E></span>
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
                      <E f="sponsorship">{tier.name}</E>
                    </h3>
                    <p className="text-xs text-white/80 mt-1.5 leading-relaxed font-normal">
                      <E f="sponsorship">{tier.tagline}</E>
                    </p>

                    <div className="mt-5 pt-4 border-t border-white/15 flex items-baseline gap-2 whitespace-nowrap">
                      <span className="text-2xl sm:text-[26px] xl:text-3xl font-serif font-black text-white tracking-tight whitespace-nowrap">
                        <E f="sponsorship">{tier.price}</E>
                      </span>
                      <span className="text-[10px] sm:text-xs font-semibold text-white/70 uppercase tracking-wide whitespace-nowrap"><E f="sponsorship">{"+ Applicable GST"}</E></span>
                    </div>
                  </div>

                  {/* Benefits List */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2"><E f="sponsorship">{"Included Entitlements & Benefits:"}</E></p>
                      <ul className="space-y-3 text-xs sm:text-[13px] text-slate-700 font-normal">
                        {tier.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
                            <span><E f="sponsorship">{benefit}</E></span>
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
                        <span><E f="sponsorship">{"Inquire for "}</E><E f="sponsorship">{tier.name}</E></span>
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
            <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary bg-[#EBF3F8] px-3.5 py-1.5 rounded-full border border-brand-secondary/20 inline-block"><E f="sponsorship">{"Institutional & Technical Backing"}</E></span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-primary"><E f="sponsorship">{"Conference Partners & Patrons"}</E></h2>
            <p className="text-xs sm:text-sm text-slate-500"><E f="sponsorship">{"Corporate and academic sponsors are announced on a rolling basis following committee reviews."}</E></p>
          </div>

          {/* 1. TECHNICAL CO-SPONSOR */}
          <div className="flex flex-col items-center text-center space-y-5">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-brand-primary underline decoration-brand-secondary underline-offset-8"><E f="sponsorship">{"TECHNICAL CO-SPONSOR"}</E></h3>
            {/* Blank placeholder frame as requested */}
            <div className="w-full max-w-2xl min-h-[100px] border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center p-6 bg-slate-50/70">
              <span className="text-xs sm:text-sm text-slate-400 font-semibold tracking-wide uppercase"><E f="sponsorship">{"To Be Announced"}</E></span>
            </div>
          </div>

          {/* 2. TITLE SPONSOR */}
          <div className="flex flex-col items-center text-center space-y-5">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-brand-primary underline decoration-brand-secondary underline-offset-8"><E f="sponsorship">{"TITLE SPONSOR"}</E></h3>
            {/* Blank placeholder frame as requested */}
            <div className="w-full max-w-2xl min-h-[100px] border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center p-6 bg-slate-50/70">
              <span className="text-xs sm:text-sm text-slate-400 font-semibold tracking-wide uppercase"><E f="sponsorship">{"To Be Announced"}</E></span>
            </div>
          </div>

          {/* 3. TECHNOLOGY PARTNER AND CO-TITLE SPONSOR */}
          <div className="flex flex-col items-center text-center space-y-5">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-brand-primary underline decoration-brand-secondary underline-offset-8"><E f="sponsorship">{"TECHNOLOGY PARTNER AND CO-TITLE SPONSOR"}</E></h3>
            {/* Blank placeholder frame as requested */}
            <div className="w-full max-w-2xl min-h-[100px] border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center p-6 bg-slate-50/70">
              <span className="text-xs sm:text-sm text-slate-400 font-semibold tracking-wide uppercase"><E f="sponsorship">{"To Be Announced"}</E></span>
            </div>
          </div>

          {/* 4. SUPPORTED BY */}
          <div className="flex flex-col items-center text-center space-y-5">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-brand-primary underline decoration-brand-secondary underline-offset-8"><E f="sponsorship">{"SUPPORTED BY"}</E></h3>
            {/* Blank placeholder frame as requested */}
            <div className="w-full max-w-3xl min-h-[120px] border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center p-6 bg-slate-50/70">
              <span className="text-xs sm:text-sm text-slate-400 font-semibold tracking-wide uppercase"><E f="sponsorship">{"To Be Announced"}</E></span>
            </div>
          </div>
        </section>

        {/* ── BROCHURES & CONTACT SECRETARIAT ── */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-brand-primary to-brand-primary-dark text-white shadow-xl border border-white/15">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#CCFF00] bg-white/10 px-3 py-1 rounded-full border border-white/20 inline-block"><E f="sponsorship">{"Sponsorship Secretariat & Inquiries"}</E></span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight"><E f="sponsorship">{"Interested in Custom Sponsorship or Event Co-Hosting?"}</E></h3>
              <p className="text-sm text-white/80 leading-relaxed font-normal max-w-2xl"><E f="sponsorship">{"We offer tailored exhibition booths at "}</E><strong><E f="sponsorship">{"TechNext Expo"}</E></strong><E f="sponsorship">{", customized challenge statements for the "}</E><strong><E f="sponsorship">{"BOLT Hackathon"}</E></strong><E f="sponsorship">{", and branded keynote halls. Reach out to our organizing committee to receive customized proposals."}</E></p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-white/90">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-brand-accent" />
                  <a
                    href="mailto:icetiteconference@vit.ac.in"
                    className="hover:underline font-bold text-white"
                  ><E f="sponsorship">{"icetiteconference@vit.ac.in"}</E></a>
                </div>
                <span><E f="sponsorship">{"•"}</E></span>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#CCFF00]" />
                  <span><E f="sponsorship">{"SCORE, VIT Vellore, Tamil Nadu 632014"}</E></span>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-3">
              <a
                href="https://icetite.vit.ac.in/docs/CONF_BROCHURE_INR.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-brand-secondary hover:bg-brand-primary-hover text-white font-bold text-xs sm:text-sm transition-all shadow-md border border-white/20 hover:scale-[1.02]"
              >
                <Download className="w-4 h-4 text-[#CCFF00]" />
                <span><E f="sponsorship">{"Download Sponsorship Brochure (PDF)"}</E></span>
              </a>

              <a
                href="/ic-ETITE'28.pdf"
                download="ic-ETITE'28.pdf"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all border border-white/25 hover:scale-[1.02]"
              >
                <FileText className="w-4 h-4 text-brand-accent" />
                <span><E f="sponsorship">{"Download Conference Brochure (PDF)"}</E></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
