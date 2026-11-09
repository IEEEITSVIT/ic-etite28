import Link from "next/link";
import { conferenceData } from "@/data/conference";
import {
  FileText,
  AlertCircle,
  ExternalLink,
  Mail,
  ShieldCheck,
  CheckCircle,
  Download,
  AlertTriangle,
  Award,
} from "lucide-react";

export default function CFPSection() {
  const { submission, contact } = conferenceData;

  return (
    <section id="cfp" className="py-8 sm:py-12 bg-white border-b border-[#E4E7EC]">
      <div className="container-x">
        {/* Scopus Recommendation Banner */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#002147] to-[#004B87] text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5A623] text-[#002147] grid place-items-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-widest text-[#FFB81C] uppercase block">
                Journal Publication Opportunity
              </span>
              <p className="text-sm sm:text-base font-bold text-white mt-0.5 leading-snug">
                Extended version of selected papers will be recommended for publication in Scopus indexed journals with impact factor.
              </p>
            </div>
          </div>
          <span className="shrink-0 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold tracking-wide text-white uppercase">
            Scopus Indexed
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: CFP Overview & Submission CTA */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            <span className="text-xs sm:text-sm font-bold text-[#002147] uppercase tracking-wider bg-[#FFF4DB] px-3.5 py-1.5 rounded-full border border-[#F5A623]/50 self-start">
              Manuscript Submission
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#002147] tracking-tight leading-[1.15]">
              Manuscript Guidelines
            </h2>

            <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-medium">
              Original and unpublished research papers addressing emerging challenges, innovative technologies, and recent developments are invited from researchers worldwide.
            </p>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              The Third International Conference on Emerging Trends in Information Technology and Engineering (ic-ETITE’28) will be held at Vellore Institute of Technology (VIT), Vellore, India, on 10–11 February 2028. All submitted papers will go through a plagiarism check process.
            </p>

            <div className="mt-4 p-6 sm:p-7 rounded-2xl bg-[#FAFBFD] border-2 border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-sm">
              <div>
                <span className="text-xs tracking-wider uppercase text-slate-500 font-bold">
                  Official Submission Portal
                </span>
                <p className="text-xl font-bold text-[#002147] mt-1">
                  Microsoft Conference Management Toolkit (CMT)
                </p>
              </div>

              <Link
                href="/call-for-papers#submit"
                className="bg-[#004B87] hover:bg-[#003366] text-white rounded-full text-sm sm:text-base py-3 px-6 inline-flex items-center gap-2 shrink-0 font-bold shadow-md cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Submit on CMT</span>
                <span className="text-base font-bold">→</span>
              </Link>
            </div>

            {/* Template downloads */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-sm">
              <span className="font-bold text-[#002147] shrink-0">IEEE Manuscript Templates:</span>
              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap sm:flex-nowrap">
                <a
                  href="https://www.ieee.org/conferences/publishing/templates.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-[#002147] hover:bg-[#003366] text-white font-semibold text-xs sm:text-sm transition-colors inline-flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>Word Template (.docx)</span>
                </a>
                <a
                  href="https://www.ieee.org/conferences/publishing/templates.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-[#002147] hover:bg-[#003366] text-white font-semibold text-xs sm:text-sm transition-colors inline-flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>LaTeX Package (.zip)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Strict Submission Requirements */}
          <div className="lg:col-span-6 bg-[#FAFBFD] p-6 sm:p-8 rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-[#002147] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#F5A623]" />
              <span>Manuscript Submission Rules</span>
            </h3>

            <div className="space-y-3 text-sm sm:text-base text-slate-800">
              <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs">
                <CheckCircle className="w-5 h-5 text-[#002147] shrink-0 mt-0.5" />
                <span>
                  <strong>Plagiarism Check Process:</strong> All submitted papers will go through a plagiarism check process.
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs">
                <AlertCircle className="w-5 h-5 text-[#004B87] shrink-0 mt-0.5" />
                <span>
                  <strong>Formatting Requirements:</strong> The manuscript should not contain embedded links, scanned images, header and footer.
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs">
                <CheckCircle className="w-5 h-5 text-[#004B87] shrink-0 mt-0.5" />
                <span>
                  <strong>Originality:</strong> Original and unpublished research papers addressing emerging challenges, innovative technologies, and recent developments are invited.
                </span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-3 text-amber-950">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>No Email Submission:</strong> Email submission will not be accepted. The papers should be submitted through Microsoft (CMT): <Link href="/call-for-papers#submit" className="font-semibold underline text-[#002147]">Microsoft (CMT) Submission Portal</Link>.
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E4E7EC] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-[#4A5568]">
              <div className="flex items-center gap-1.5 font-medium">
                <Mail className="w-4 h-4 text-[#004B87]" />
                <span>All queries related to the conference:</span>
              </div>
              <a
                href={`mailto:${contact.email}`}
                className="font-bold text-[#004B87] hover:underline"
              >
                {contact.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
