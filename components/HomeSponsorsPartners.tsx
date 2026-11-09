"use client";

import Image from "@/components/cms/EImage";
import Link from "next/link";
import { Handshake, ExternalLink, Mail, ShieldCheck, Download } from "lucide-react";
import E from "@/components/cms/E";

export default function HomeSponsorsPartners() {
  const previousCollaborators = [
    { name: "Intel", note: "Technology Partner (ic-ETITE'24)" },
    { name: "Cisco", note: "Title Sponsor (ic-ETITE'24)" },
    { name: "Yellow.ai", note: "AI Innovation Partner (ic-ETITE'24)" },
    { name: "Java Capital", note: "Venture Partner (ic-ETITE'24)" },
    { name: "Seed VC Innovation", note: "Ecosystem Partner (ic-ETITE'24)" },
  ];

  return (
    <section id="sponsors" className="border-b border-brand-border bg-brand-surface scroll-mt-20">
      <div className="container-x py-20 md:py-24">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[12.5px] tracking-wider uppercase text-brand-muted font-semibold mb-2"><E f="c.HomeSponsorsPartners">{"Institutional Endorsements & Industry Alliances"}</E></p>
          <h2 className="font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] text-brand-text"><E f="c.HomeSponsorsPartners">{"Sponsors & Technical Partners"}</E></h2>
          <p className="mt-3 text-[14.5px] text-brand-muted"><E f="c.HomeSponsorsPartners">{"Technically co-sponsored by premier global scientific bodies and supported by distinguished industry innovators."}</E></p>
        </div>

        {/* Primary Technical Sponsor & Organizing Society Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* IEEE */}
          <div className="bg-white border border-brand-border rounded-2xl p-8 text-center shadow-sm hover:border-[#1D5C82] transition-all flex flex-col items-center">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#1D5C82] bg-sky-50 border border-sky-100 px-3 py-1 rounded-full mb-4"><E f="c.HomeSponsorsPartners">{"Official Technical Sponsorship"}</E></span>
            <div className="w-16 h-16 rounded-full border border-brand-border bg-brand-surface grid place-items-center mb-4 font-serif font-bold text-xl text-[#1D5C82]"><E f="c.HomeSponsorsPartners">{"IEEE"}</E></div>
            <h3 className="font-serif text-xl font-bold text-brand-text"><E f="c.HomeSponsorsPartners">{"IEEE Technical Sponsorship"}</E></h3>
            <p className="text-[13px] text-brand-muted mt-2 max-w-sm leading-relaxed"><E f="c.HomeSponsorsPartners">{"Technically sponsoring ic-ETITE'28, ensuring all accepted and presented papers meet rigorous quality and ethical benchmarks for inclusion in IEEE Xplore®."}</E></p>
            <a
              href="https://www.ieee.org"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 text-[12.5px] font-semibold text-[#1D5C82] hover:underline inline-flex items-center gap-1"
            >
              <span><E f="c.HomeSponsorsPartners">{"Visit IEEE Portal"}</E></span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* IEEE ITS VIT Student Chapter */}
          <div className="bg-white border border-brand-border rounded-2xl p-8 text-center shadow-sm hover:border-[#0B6B4A] transition-all flex flex-col items-center">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#0B6B4A] bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4"><E f="c.HomeSponsorsPartners">{"Organizing Society Chapter"}</E></span>
            <div className="w-16 h-16 rounded-full border border-brand-border bg-brand-surface grid place-items-center mb-4 font-serif font-bold text-xl text-[#0B6B4A]"><E f="c.HomeSponsorsPartners">{"ITS"}</E></div>
            <h3 className="font-serif text-xl font-bold text-brand-text"><E f="c.HomeSponsorsPartners">{"IEEE ITS VIT Chapter"}</E></h3>
            <p className="text-[13px] text-brand-muted mt-2 max-w-sm leading-relaxed"><E f="c.HomeSponsorsPartners">{"Advancing student leadership, hackathons, doctoral consortiums, and technical paper dissemination across computing and engineering disciplines."}</E></p>
            <a
              href="https://ieee-its-vit.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 text-[12.5px] font-semibold text-[#0B6B4A] hover:underline inline-flex items-center gap-1"
            >
              <span><E f="c.HomeSponsorsPartners">{"Visit IEEE ITS Chapter"}</E></span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Previous Edition Industry Collaborations */}
        <div className="bg-white border border-brand-border rounded-2xl p-8 md:p-10 mb-14">
          <div className="text-center max-w-xl mx-auto mb-8">
            <p className="text-[11.5px] uppercase tracking-wider text-brand-muted font-semibold"><E f="c.HomeSponsorsPartners">{"Historical Industry Engagement"}</E></p>
            <h3 className="font-serif text-2xl text-brand-text mt-1"><E f="c.HomeSponsorsPartners">{"Previous Edition Collaborations"}</E></h3>
            <p className="text-[12.5px] text-brand-muted mt-1.5"><E f="c.HomeSponsorsPartners">{"Organizations that engaged with ic-ETITE'24. Listed for historical reference — not confirmed as sponsors of ic-ETITE'28."}</E></p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {previousCollaborators.map((c) => (
              <div
                key={c.name}
                className="badge-mono px-6 py-3.5 bg-white border border-brand-border rounded-xl text-center"
              >
                <p className="text-[15px] font-bold text-brand-text tracking-tight"><E f="c.HomeSponsorsPartners">{c.name}</E></p>
                <p className="text-[11px] text-brand-muted mt-0.5"><E f="c.HomeSponsorsPartners">{c.note}</E></p>
              </div>
            ))}
          </div>
        </div>

        {/* Call for Sponsorship for 2028 */}
        <div className="p-8 rounded-2xl border border-[#0B6B4A]/30 bg-gradient-to-br from-emerald-50/50 via-white to-sky-50/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0B6B4A] uppercase tracking-wider">
              <Handshake className="w-4 h-4" />
              <span><E f="c.HomeSponsorsPartners">{"Partner With ic-ETITE'28"}</E></span>
            </div>
            <h4 className="font-serif text-2xl text-brand-text font-bold"><E f="c.HomeSponsorsPartners">{"Become an Official Sponsor of ic-ETITE'28"}</E></h4>
            <p className="text-[14px] text-brand-muted max-w-xl"><E f="c.HomeSponsorsPartners">{"Gain visibility with 1,500+ global scientists, professors, engineers, and doctoral researchers. Sponsorship packages available for Platinum, Gold, Silver, and Innovation Partners."}</E></p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href="mailto:icetiteconference@vit.ac.in?subject=Sponsorship%20Inquiry%20ic-ETITE%2728"
              className="btn-primary inline-flex items-center gap-2 text-xs"
            >
              <Mail className="w-4 h-4" />
              <span><E f="c.HomeSponsorsPartners">{"Inquire for Sponsorship"}</E></span>
            </a>
            <a
              href="/ic-ETITE'28.pdf"
              download="ic-ETITE'28.pdf"
              className="btn-outline text-xs inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-brand-accent" />
              <span><E f="c.HomeSponsorsPartners">{"Download Brochure"}</E></span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
