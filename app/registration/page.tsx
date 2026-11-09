import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import RegistrationTable from "@/components/RegistrationTable";

export const metadata: Metadata = pageMetadata("/registration", {
  title: "Registration Guidelines & Tariff Schedule | ic-ETITE'28",
  description:
    "Official delegate and author registration fee structure, IEEE member discounts, payment options, and presentation guidelines for ic-ETITE'28.",
});

import PageHeader from "@/components/PageHeader";

export default function RegistrationPage() {
  return (
    <div className="bg-white min-h-screen text-[#002147]">
      <PageHeader
        badge="Delegate Portal & Author Registration"
        title="Conference Registration & Fees"
        subtitle="Registration is mandatory for all attending delegates and presenting authors. Tariffs include access to all technical tracks, keynote addresses, and networking sessions."
        breadcrumb="Registration"
        bgImage="/images/frame_.webp"
      />

      <RegistrationTable />
    </div>
  );
}
