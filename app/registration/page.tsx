import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import RegistrationTable from "@/components/RegistrationTable";

export const metadata: Metadata = pageMetadata("/registration", {
  title: "Registration Guidelines & Tariff Schedule | ic-ETITE'28",
  description:
    "Official delegate and author registration fee structure, IEEE member discounts, payment options, and presentation guidelines for ic-ETITE'28.",
});

import PageHeader from "@/components/PageHeader";

export default async function RegistrationPage() {
  const settings = await getSettings();
  return (
    <div className="bg-white min-h-screen text-brand-primary">
      <PageHeader
        badge="Delegate Portal & Author Registration"
        title="Conference Registration & Fees"
        subtitle="Registration is mandatory for all attending delegates and presenting authors. Tariffs include access to all technical tracks, keynote addresses, and networking sessions."
        breadcrumb="Registration"
        bgImage="/images/frame_.webp"
      />

      <RegistrationTable
        fees={settings.fees}
        registrationEnabled={settings.visibility.conferenceRegistration}
        opensAt={settings.conference.opensAt}
        closesAt={settings.conference.closesAt}
        earlyBird={settings.conference.earlyBird}
        prizes={settings.conference.prizes}
        prizePool={settings.conference.prizePool}
      />
    </div>
  );
}
