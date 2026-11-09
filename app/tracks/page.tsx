import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import TracksSection from "@/components/TracksSection";

export const metadata: Metadata = pageMetadata("/tracks", {
  title: "Conference Research Tracks & Indicative Topics | ic-ETITE'28",
  description:
    "Comprehensive directory of research tracks across Information Technology, Communication Engineering, Computer Engineering, and Electronics Engineering for ic-ETITE'28.",
});

import PageHeader from "@/components/PageHeader";

export default function TracksPage() {
  return (
    <div className="bg-white min-h-screen text-[#002147]">
      <PageHeader
        badge="Academic Scope & Specializations"
        title="Research Tracks & Indicative Topics"
        subtitle="Explore 100+ research domains across four core disciplines: Information Technology, Computer Science, Communication Engineering, and Electronics."
        breadcrumb="Research Tracks"
        bgImage="/images/frame_.webp"
      />

      <TracksSection isPreview={false} />
    </div>
  );
}
