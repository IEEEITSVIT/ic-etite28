import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import DatesTimeline from "@/components/DatesTimeline";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = pageMetadata("/important-dates", {
  title: "Important Dates & Milestone Schedule | ic-ETITE'28",
  description:
    "Official schedule and milestone dates for ic-ETITE'28 at Vellore Institute of Technology (VIT), Vellore.",
});

export default function ImportantDatesPage() {
  return (
    <div className="bg-white min-h-screen text-[#002147]">
      <PageHeader
        badge="Official Milestone Schedule"
        title="Important Dates & Timeline"
        subtitle="Official conference dates and milestone schedule for ic-ETITE'28. All deadlines are 23:59 IST (UTC +05:30)."
        breadcrumb="Important Dates"
        bgImage="/images/frame_.webp"
      />

      <DatesTimeline />
    </div>
  );
}
