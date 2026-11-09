import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { Clock, Mail, ArrowLeft } from "lucide-react";

export const metadata: Metadata = pageMetadata("/hotels", {
  title: "Hotels & Accommodation | ic-ETITE'28",
  description:
    "Hotels and accommodation details for ic-ETITE'28 at VIT Vellore will be updated soon.",
});

export default function HotelsPage() {
  return (
    <div className="bg-[#FAFBFD] min-h-screen text-[#002147] flex flex-col justify-between">
      <div>
        {/* Page Header */}
        <PageHeader
          badge="Conference Hospitality & Accommodation"
          title="Hotels & Accommodation"
          subtitle="Details regarding conference accommodation and partner hotels will be updated soon."
          breadcrumb="Hotels & Accommodation"
          bgImage="/images/frame_.webp"
        />

        <div className="container-x py-16 sm:py-24">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#001733] via-[#002147] to-[#001733] text-white rounded-3xl p-8 sm:p-12 md:p-16 border-2 border-white/15 shadow-2xl relative overflow-hidden text-center space-y-6">
            <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#FFB81C]/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#00B4D8]/15 blur-3xl" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFB81C]/20 border border-[#FFB81C]/40 text-[#FFB81C] text-xs font-bold uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span>Notice</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
                Will Be Updated Soon
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed max-w-xl mx-auto">
                Official accommodation options, partner hotel tariffs, and booking assistance details for ic-ETITE&apos;28 will be announced soon.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="mailto:icetiteconference@vit.ac.in?subject=Accommodation%20Inquiry%20-%20ic-ETITE'28"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FFB81C] text-[#002147] font-bold text-sm hover:bg-white transition-all shadow-lg hover:scale-105"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Hospitality Desk</span>
                </a>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-sm transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
