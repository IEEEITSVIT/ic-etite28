"use client";

import Image from "next/image";
import Link from "next/link";
import { Handshake, ExternalLink, Mail, ShieldCheck, Download } from "lucide-react";

export default function HomeSponsorsPartners() {
  const previousCollaborators = [
    { name: "Intel", note: "Technology Partner (ic-ETITE'24)" },
    { name: "Cisco", note: "Title Sponsor (ic-ETITE'24)" },
    { name: "Yellow.ai", note: "AI Innovation Partner (ic-ETITE'24)" },
    { name: "Java Capital", note: "Venture Partner (ic-ETITE'24)" },
    { name: "Seed VC Innovation", note: "Ecosystem Partner (ic-ETITE'24)" },
  ];

  return (
    <section id="sponsors" className="border-b border-[#E4E7EC] bg-[#F7F8FA] scroll-mt-20">
      <div className="container-x py-20 md:py-24">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[12.5px] tracking-wider uppercase text-[#4A5568] font-semibold mb-2">
            Institutional Endorsements &amp; Industry Alliances
          </p>
          <h2 className="font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] text-[#101B2E]">
            Sponsors &amp; Technical Partners
          </h2>
          <p className="mt-3 text-[14.5px] text-[#4A5568]">
            Technically co-sponsored by premier global scientific bodies and supported by distinguished industry innovators.
          </p>
        </div>

        {/* Primary Technical Sponsor & Organizing Society Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* IEEE */}
          <div className="bg-white border border-[#E4E7EC] rounded-2xl p-8 text-center shadow-sm hover:border-[#1D5C82] transition-all flex flex-col items-center">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#1D5C82] bg-sky-50 border border-sky-100 px-3 py-1 rounded-full mb-4">
              Official Technical Sponsorship
            </span>
            <div className="w-16 h-16 rounded-full border border-[#E4E7EC] bg-[#F7F8FA] grid place-items-center mb-4 font-serif font-bold text-xl text-[#1D5C82]">
              IEEE
            </div>
            <h3 className="font-serif text-xl font-bold text-[#101B2E]">IEEE Technical Sponsorship</h3>
            <p className="text-[13px] text-[#4A5568] mt-2 max-w-sm leading-relaxed">
              Technically sponsoring ic-ETITE&apos;28, ensuring all accepted and presented papers meet rigorous quality and
              ethical benchmarks for inclusion in IEEE Xplore®.
            </p>
            <a
              href="https://www.ieee.org"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 text-[12.5px] font-semibold text-[#1D5C82] hover:underline inline-flex items-center gap-1"
            >
              <span>Visit IEEE Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* IEEE ITS VIT Student Chapter */}
          <div className="bg-white border border-[#E4E7EC] rounded-2xl p-8 text-center shadow-sm hover:border-[#0B6B4A] transition-all flex flex-col items-center">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#0B6B4A] bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4">
              Organizing Society Chapter
            </span>
            <div className="w-16 h-16 rounded-full border border-[#E4E7EC] bg-[#F7F8FA] grid place-items-center mb-4 font-serif font-bold text-xl text-[#0B6B4A]">
              ITS
            </div>
            <h3 className="font-serif text-xl font-bold text-[#101B2E]">IEEE ITS VIT Chapter</h3>
            <p className="text-[13px] text-[#4A5568] mt-2 max-w-sm leading-relaxed">
              Advancing student leadership, hackathons, doctoral consortiums, and technical paper dissemination across computing
              and engineering disciplines.
            </p>
            <a
              href="https://ieee-its-vit.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 text-[12.5px] font-semibold text-[#0B6B4A] hover:underline inline-flex items-center gap-1"
            >
              <span>Visit IEEE ITS Chapter</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Previous Edition Industry Collaborations */}
        <div className="bg-white border border-[#E4E7EC] rounded-2xl p-8 md:p-10 mb-14">
          <div className="text-center max-w-xl mx-auto mb-8">
            <p className="text-[11.5px] uppercase tracking-wider text-[#4A5568] font-semibold">
              Historical Industry Engagement
            </p>
            <h3 className="font-serif text-2xl text-[#101B2E] mt-1">Previous Edition Collaborations</h3>
            <p className="text-[12.5px] text-[#4A5568] mt-1.5">
              Organizations that engaged with ic-ETITE&apos;24. Listed for historical reference — not confirmed as sponsors of
              ic-ETITE&apos;28.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {previousCollaborators.map((c) => (
              <div
                key={c.name}
                className="badge-mono px-6 py-3.5 bg-white border border-[#E4E7EC] rounded-xl text-center"
              >
                <p className="text-[15px] font-bold text-[#101B2E] tracking-tight">{c.name}</p>
                <p className="text-[11px] text-[#4A5568] mt-0.5">{c.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call for Sponsorship for 2028 */}
        <div className="p-8 rounded-2xl border border-[#0B6B4A]/30 bg-gradient-to-br from-emerald-50/50 via-white to-sky-50/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0B6B4A] uppercase tracking-wider">
              <Handshake className="w-4 h-4" />
              <span>Partner With ic-ETITE&apos;28</span>
            </div>
            <h4 className="font-serif text-2xl text-[#101B2E] font-bold">
              Become an Official Sponsor of ic-ETITE&apos;28
            </h4>
            <p className="text-[14px] text-[#4A5568] max-w-xl">
              Gain visibility with 1,500+ global scientists, professors, engineers, and doctoral researchers. Sponsorship
              packages available for Platinum, Gold, Silver, and Innovation Partners.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href="mailto:icetiteconference@vit.ac.in?subject=Sponsorship%20Inquiry%20ic-ETITE%2728"
              className="btn-primary inline-flex items-center gap-2 text-xs"
            >
              <Mail className="w-4 h-4" />
              <span>Inquire for Sponsorship</span>
            </a>
            <a
              href="/ic-ETITE'28.pdf"
              download="ic-ETITE'28.pdf"
              className="btn-outline text-xs inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#FFB81C]" />
              <span>Download Brochure</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
