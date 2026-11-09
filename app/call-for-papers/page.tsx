import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import CFPSection from "@/components/CFPSection";
import TracksSection from "@/components/TracksSection";
import HomeImportantDates from "@/components/HomeImportantDates";
import { FileCheck, ShieldCheck, CheckCircle2, ExternalLink } from "lucide-react";

export const metadata: Metadata = pageMetadata("/call-for-papers", {
  title: "Call for Papers & Author Guidelines | ic-ETITE'28",
  description:
    "Author instructions, manuscript templates, IEEE publication rules, plagiarism criteria, and Microsoft (CMT) submission link for ic-ETITE'28.",
});

import PageHeader from "@/components/PageHeader";

export default function CallForPapersPage() {
  return (
    <div className="bg-white min-h-screen text-[#002147]">
      <PageHeader
        badge="Original Scientific Contributions"
        title="Call for Papers & Submission Guidelines"
        subtitle="Authors are invited to submit original, unpublished research papers. All presented papers will be submitted to IEEE for inclusion in IEEE Xplore® Digital Library."
        breadcrumb="Call for Papers"
        bgImage="/images/frame_.webp"
      />

      <CFPSection />

      {/* Detailed Manuscript Preparation Protocols */}
      <section className="py-8 sm:py-12 bg-[#F7F8FA] border-b border-[#E4E7EC]">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#002147] tracking-tight">
              Detailed Manuscript Preparation Guidelines
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Please ensure your submission adheres strictly to IEEE conference formatting requirements before upload.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-7 rounded-2xl border-2 border-slate-200 shadow-sm hover:border-[#002147] transition-all">
              <FileCheck className="w-7 h-7 text-[#002147] mb-4" />
              <h3 className="font-bold text-[#002147] text-lg sm:text-xl mb-2">
                1. Manuscript Length &amp; Layout
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Standard papers should typically be 4 to 6 pages in length, including figures, tables, and references,
                formatted according to the standard IEEE two-column conference template.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border-2 border-slate-200 shadow-sm hover:border-[#002147] transition-all">
              <ShieldCheck className="w-7 h-7 text-[#004B87] mb-4" />
              <h3 className="font-bold text-[#002147] text-lg sm:text-xl mb-2">
                2. IEEE PDF eXpress Compliance
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Accepted camera-ready papers must be validated through the IEEE PDF eXpress system to ensure full
                compatibility with the IEEE Xplore® digital archive.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border-2 border-slate-200 shadow-sm hover:border-[#002147] transition-all">
              <CheckCircle2 className="w-7 h-7 text-[#002147] mb-4" />
              <h3 className="font-bold text-[#002147] text-lg sm:text-xl mb-2">
                3. Author Presentation Policy
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                In adherence to IEEE policy, only papers presented in person or as scheduled by the conference committee
                will be considered for recommendation to IEEE Xplore.
              </p>
            </div>
          </div>
        </div>
      </section>

      <HomeImportantDates />
      <TracksSection isPreview={false} />

      {/* ── Final Submission CTA ── */}
      <section
        id="submit"
        className="py-10 md:py-14 bg-gradient-to-br from-[#001733] via-[#002147] to-[#0D2E5C] border-t border-white/10 scroll-mt-20"
      >
        <div className="container-x flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-bold tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-[#F5A623] animate-pulse" />
            Submissions Open — Microsoft (CMT) Portal
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
            Ready to Submit Your Paper?
          </h2>

          <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl font-normal">
            You have reviewed all the guidelines above. Click below to proceed to the official Microsoft (CMT) submission portal for ic-ETITE&apos;28. Ensure your manuscript follows IEEE two-column formatting before uploading.
          </p>

          {/* Checklist reminder */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-xl text-sm sm:text-[14.5px] text-white/85 mt-2 text-left">
            {[
              "IEEE standard formatting",
              "Scopus indexed journal recommendations for selected papers",
              "No embedded links / headers / footers",
              "No scanned images",
              "Original & unpublished work",
              "No email submissions accepted (Microsoft (CMT) only)",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#F5A623] shrink-0" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>

          {/* THE external Microsoft CMT button */}
          <a
            href="https://cmt3.research.microsoft.com/About"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#004B87] hover:bg-[#003366] text-white font-bold text-base sm:text-lg shadow-xl shadow-black/30 transition-all hover:scale-105 active:scale-95 border border-white/20"
          >
            <span>Submit on CMT</span>
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </section>
    </div>
  );
}
