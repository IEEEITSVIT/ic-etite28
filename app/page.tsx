import type { Metadata } from "next";
import Hero from "@/components/Hero";
import AboutAndThemesSection from "@/components/AboutAndThemesSection";
import HomePastEditions from "@/components/HomePastEditions";
import HomePhotoMomentsSlideshow from "@/components/HomePhotoMomentsSlideshow";
import TechnicalSponsorsSection from "@/components/TechnicalSponsorsSection";
import HomeCallForPapers from "@/components/HomeCallForPapers";
import HomeImportantDates from "@/components/HomeImportantDates";
import HomeKeynoteSpeakers from "@/components/HomeKeynoteSpeakers";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero with Video Background, Countdown Bar & Credential Strips */}
      <Hero />

      {/* 2. About IC-ETITE, Theme, About VIT, About SCORE, About IEEE ITS (Old-School Photo Frames & Hyperlinks) */}
      <AboutAndThemesSection />

      {/* 3. Previous Editions: ic-ETITE'20 & ic-ETITE'24 Details & Heritage (Redirecting to About) */}
      <HomePastEditions />

      {/* 4. ic-ETITE'24 Curated Moments & Highlights Showcase */}
      <HomePhotoMomentsSlideshow />

      {/* 5. Technical Sponsorship (IEEE) & Organizing Chapter (IEEE ITS) */}
      <TechnicalSponsorsSection />

      {/* 6. Call for Papers & Guidelines */}
      <HomeCallForPapers />

      {/* 7. Important Dates Milestone Timeline */}
      <HomeImportantDates />

      {/* 8. Keynote Speakers with Guest Pictures */}
      <HomeKeynoteSpeakers />
    </div>
  );
}
