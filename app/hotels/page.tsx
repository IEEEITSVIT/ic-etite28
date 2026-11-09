import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { Clock, Mail, ArrowLeft } from "lucide-react";
import { getSettings } from "@/lib/settings";
import HotelBookingDirectory from "@/components/HotelBookingDirectory";
import E from "@/components/cms/E";

export const metadata: Metadata = pageMetadata("/hotels", {
  title: "Hotels & Accommodation | ic-ETITE'28",
  description:
    "Hotels and accommodation details for ic-ETITE'28 at VIT Vellore will be updated soon.",
});

export default async function HotelsPage() {
  const { hotels } = await getSettings();
  if (hotels.published && hotels.items.length > 0) {
    return (
      <div className="bg-brand-surface min-h-screen text-brand-primary">
        <PageHeader
          badge="Conference Hospitality & Accommodation"
          title="Hotels & Accommodation"
          subtitle={hotels.intro}
          breadcrumb="Hotels & Accommodation"
          bgImage="/images/frame_.webp"
        />
        <HotelBookingDirectory hotels={hotels.items} />
      </div>
    );
  }
  return (
    <div className="bg-brand-surface min-h-screen text-brand-primary flex flex-col justify-between">
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
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-brand-primary-dark via-brand-primary to-brand-primary-dark text-white rounded-3xl p-8 sm:p-12 md:p-16 border-2 border-white/15 shadow-2xl relative overflow-hidden text-center space-y-6">
            <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-brand-accent/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#00B4D8]/15 blur-3xl" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-accent/20 border border-brand-accent/40 text-brand-accent text-xs font-bold uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span><E f="hotels">{"Notice"}</E></span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight"><E f="hotels">{"Will Be Updated Soon"}</E></h2>

              <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed max-w-xl mx-auto"><E f="hotels">{"Official accommodation options, partner hotel tariffs, and booking assistance details for ic-ETITE'28 will be announced soon."}</E></p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="mailto:icetiteconference@vit.ac.in?subject=Accommodation%20Inquiry%20-%20ic-ETITE'28"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-accent text-brand-primary font-bold text-sm hover:bg-white transition-all shadow-lg hover:scale-105"
                >
                  <Mail className="w-4 h-4" />
                  <span><E f="hotels">{"Contact Hospitality Desk"}</E></span>
                </a>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-sm transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span><E f="hotels">{"Back to Home"}</E></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
