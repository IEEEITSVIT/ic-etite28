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
import E from "@/components/cms/E";

export default function CFPSection() {
  const { submission, contact } = conferenceData;

  return (
    <section id="cfp" className="py-8 sm:py-12 bg-white border-b border-brand-border">
      <div className="container-x">
        {/* Scopus Recommendation Banner */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-accent-dark text-brand-primary grid place-items-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-widest text-brand-accent uppercase block"><E f="c.CFPSection">{"Journal Publication Opportunity"}</E></span>
              <p className="text-sm sm:text-base font-bold text-white mt-0.5 leading-snug"><E f="c.CFPSection">{"Extended version of selected papers will be recommended for publication in Scopus indexed journals with impact factor."}</E></p>
            </div>
          </div>
          <span className="shrink-0 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold tracking-wide text-white uppercase"><E f="c.CFPSection">{"Scopus Indexed"}</E></span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: CFP Overview & Submission CTA */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            <span className="text-xs sm:text-sm font-bold text-brand-primary uppercase tracking-wider bg-[#FFF4DB] px-3.5 py-1.5 rounded-full border border-brand-accent-dark/50 self-start"><E f="c.CFPSection">{"Manuscript Submission"}</E></span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary tracking-tight leading-[1.15]"><E f="c.CFPSection">{"Manuscript Guidelines"}</E></h2>

            <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-medium"><E f="c.CFPSection">{"Original and unpublished research papers addressing emerging challenges, innovative technologies, and recent developments are invited from researchers worldwide."}</E></p>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal"><E f="c.CFPSection">{"The Third International Conference on Emerging Trends in Information Technology and Engineering (ic-ETITE’28) will be held at Vellore Institute of Technology (VIT), Vellore, India, on 10–11 February 2028. All submitted papers will go through a plagiarism check process."}</E></p>

            <div className="mt-4 p-6 sm:p-7 rounded-2xl bg-brand-surface border-2 border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-sm">
              <div>
                <span className="text-xs tracking-wider uppercase text-slate-500 font-bold"><E f="c.CFPSection">{"Official Submission Portal"}</E></span>
                <p className="text-xl font-bold text-brand-primary mt-1"><E f="c.CFPSection">{"Microsoft Conference Management Toolkit (CMT)"}</E></p>
              </div>

              <Link
                href="/call-for-papers#submit"
                className="bg-brand-secondary hover:bg-brand-primary-hover text-white rounded-full text-sm sm:text-base py-3 px-6 inline-flex items-center gap-2 shrink-0 font-bold shadow-md cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span><E f="c.CFPSection">{"Submit on CMT"}</E></span>
                <span className="text-base font-bold"><E f="c.CFPSection">{"→"}</E></span>
              </Link>
            </div>

            {/* Template downloads */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-sm">
              <span className="font-bold text-brand-primary shrink-0"><E f="c.CFPSection">{"IEEE Manuscript Templates:"}</E></span>
              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap sm:flex-nowrap">
                <a
                  href="https://www.ieee.org/conferences/publishing/templates.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-xs sm:text-sm transition-colors inline-flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span><E f="c.CFPSection">{"Word Template (.docx)"}</E></span>
                </a>
                <a
                  href="https://www.ieee.org/conferences/publishing/templates.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-xs sm:text-sm transition-colors inline-flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span><E f="c.CFPSection">{"LaTeX Package (.zip)"}</E></span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Strict Submission Requirements */}
          <div className="lg:col-span-6 bg-brand-surface p-6 sm:p-8 rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-brand-primary flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-accent-dark" />
              <span><E f="c.CFPSection">{"Manuscript Submission Rules"}</E></span>
            </h3>

            <div className="space-y-3 text-sm sm:text-base text-slate-800">
              <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs">
                <CheckCircle className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                <span>
                  <strong><E f="c.CFPSection">{"Plagiarism Check Process:"}</E></strong><E f="c.CFPSection">{" All submitted papers will go through a plagiarism check process."}</E></span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs">
                <AlertCircle className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5" />
                <span>
                  <strong><E f="c.CFPSection">{"Formatting Requirements:"}</E></strong><E f="c.CFPSection">{" The manuscript should not contain embedded links, scanned images, header and footer."}</E></span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs">
                <CheckCircle className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5" />
                <span>
                  <strong><E f="c.CFPSection">{"Originality:"}</E></strong><E f="c.CFPSection">{" Original and unpublished research papers addressing emerging challenges, innovative technologies, and recent developments are invited."}</E></span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-3 text-amber-950">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong><E f="c.CFPSection">{"No Email Submission:"}</E></strong><E f="c.CFPSection">{" Email submission will not be accepted. The papers should be submitted through Microsoft (CMT): "}</E><Link href="/call-for-papers#submit" className="font-semibold underline text-brand-primary"><E f="c.CFPSection">{"Microsoft (CMT) Submission Portal"}</E></Link><E f="c.CFPSection">{"."}</E></span>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-brand-muted">
              <div className="flex items-center gap-1.5 font-medium">
                <Mail className="w-4 h-4 text-brand-secondary" />
                <span><E f="c.CFPSection">{"All queries related to the conference:"}</E></span>
              </div>
              <a
                href={`mailto:${contact.email}`}
                className="font-bold text-brand-secondary hover:underline"
              >
                <E f="c.CFPSection">{contact.email}</E>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
