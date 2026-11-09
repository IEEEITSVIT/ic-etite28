import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Info } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import E from "@/components/cms/E";

export const metadata: Metadata = pageMetadata("/keynote-speakers", {
  title: "Keynote Speakers Directory | ic-ETITE'28",
  description:
    "Eminent global researchers, keynote luminaries, and plenary chairs of the IEEE ic-ETITE conference series.",
});

export default function KeynoteSpeakersPage() {
  return (
    <div className="bg-white min-h-screen text-brand-primary">
      <PageHeader
        badge="Distinguished Luminaries & Scientists"
        title="Keynote Speakers & Plenary Chairs"
        subtitle="Leading international researchers, IEEE Fellows, and corporate research directors who shape the intellectual trajectory of the ic-ETITE conference series."
        breadcrumb="Keynote Speakers"
        bgImage="/images/frame_.webp"
      />

      <div className="container-x py-8 sm:py-12">
        {/* Notice on ic-ETITE'28 Upcoming Lineup */}
        <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-brand-surface border border-brand-border flex items-start gap-4">
          <Info className="w-5 h-5 text-[#0B6B4A] shrink-0 mt-0.5" />
          <div className="text-[13.5px] text-brand-text/80 leading-relaxed">
            <strong className="font-semibold text-brand-text"><E f="keynote-speakers">{"ic-ETITE’28 Keynote Announcements:"}</E></strong><E f="keynote-speakers">{" The technical program committee is currently confirming the plenary keynote addresses for the February 2028 edition with international IEEE Fellows and distinguished research leaders. Keynote announcements will be published soon."}</E></div>
        </div>

        {/* Keynote Speakers Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0B6B4A]" />
            <h2 className="font-serif text-2xl font-bold text-brand-text"><E f="keynote-speakers">{"Keynote Luminaries"}</E></h2>
          </div>

          <div className="p-8 sm:p-10 rounded-2xl bg-brand-surface border-2 border-dashed border-slate-300 text-center">
            <p className="text-xl sm:text-2xl font-serif font-bold text-brand-primary"><E f="keynote-speakers">{"To be announced soon"}</E></p>
          </div>
        </div>

        {/* Panel Speakers Section */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1D5C82]" />
            <h2 className="font-serif text-2xl font-bold text-brand-text"><E f="keynote-speakers">{"Panel & Industry Leaders"}</E></h2>
          </div>

          <div className="p-8 sm:p-10 rounded-2xl bg-brand-surface border-2 border-dashed border-slate-300 text-center">
            <p className="text-xl sm:text-2xl font-serif font-bold text-brand-primary"><E f="keynote-speakers">{"To be announced soon"}</E></p>
          </div>
        </div>
      </div>
    </div>
  );
}
