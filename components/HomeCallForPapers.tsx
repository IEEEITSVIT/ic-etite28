import Link from "next/link";
import Image from "@/components/cms/EImage";
import { ExternalLink, Award, FileCheck, ShieldCheck, ArrowRight } from "lucide-react";
import E from "@/components/cms/E";

export default function HomeCallForPapers() {
  return (
    <section id="call-for-papers" className="border-b border-brand-border bg-white scroll-mt-20">
      <div className="container-x py-10 md:py-14">
        {/* Scopus Recommendation Highlight */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Award className="w-7 h-7 text-brand-accent shrink-0" />
            <p className="text-xs sm:text-sm font-semibold text-white"><E f="c.HomeCallForPapers">{"Extended versions of selected papers will be recommended for publication in Scopus indexed journals with impact factor."}</E></p>
          </div>
          <span className="shrink-0 px-3 py-1 rounded-full bg-brand-accent-dark text-brand-primary font-bold text-xs uppercase tracking-wider"><E f="c.HomeCallForPapers">{"Scopus Publication"}</E></span>
        </div>

        {/* Main Content Card: Text Wrapped Around Conference Image */}
        <div className="bg-brand-surface rounded-2xl border-2 border-slate-200/90 p-6 sm:p-8 md:p-10 shadow-sm flow-root mb-6">
          {/* Floated Image on Desktop */}
          <div className="w-full sm:w-[380px] md:w-[440px] lg:w-[480px] md:float-right md:ml-8 md:mb-5 mb-6">
            <div className="p-2.5 bg-white border-2 border-slate-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <Image
                  src="/images/icetite24/icetite24_16_inaugural_ceremony_dais.webp"
                  alt="Research Dignitaries and Conference Proceedings at ic-ETITE"
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover object-center hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <p className="p-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 font-medium rounded-b-xl mt-2 text-center"><E f="c.HomeCallForPapers">{"Chief Guest and academic leadership reviewing ic-ETITE conference proceedings at VIT Vellore"}</E></p>
            </div>
          </div>

          {/* Text flowing all around the picture */}
          <div className="space-y-3.5">
            <span className="text-xs tracking-wider uppercase text-brand-secondary font-bold bg-[#EBF3F8] px-3 py-1 rounded-full border border-brand-secondary/20 inline-block"><E f="c.HomeCallForPapers">{"Original Scientific Research"}</E></span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-primary tracking-tight"><E f="c.HomeCallForPapers">{"Call for Papers & Manuscript Submissions"}</E></h2>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify"><E f="c.HomeCallForPapers">{"Original, unpublished research papers addressing contemporary computational bottlenecks, innovative algorithms, resilient communication architectures, and smart electronic hardware are invited from researchers, academicians, and engineers worldwide. The "}</E><strong><E f="c.HomeCallForPapers">{"Third International Conference on Emerging Trends in Information Technology and Engineering (ic-ETITE’28)"}</E></strong><E f="c.HomeCallForPapers">{" emphasizes rigorous peer review and high scientific value across Information Technology, Computer Engineering, Communication Engineering, and Electronics Engineering."}</E></p>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify"><E f="c.HomeCallForPapers">{"In accordance with IEEE conference publication standards, all presented manuscripts will be submitted to the "}</E><strong><E f="c.HomeCallForPapers">{"IEEE Xplore Digital Library"}</E></strong><E f="c.HomeCallForPapers">{". In addition, extended versions of exceptional papers selected by the technical committee will be forwarded for expedited review and recommendation to Scopus-indexed partner journals."}</E></p>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify"><E f="c.HomeCallForPapers">{"All manuscripts must be submitted electronically via the "}</E><strong><E f="c.HomeCallForPapers">{"Microsoft Conference Management Toolkit (CMT)"}</E></strong><E f="c.HomeCallForPapers">{" portal. Email submissions will strictly not be entertained. Ensure that your paper complies with standard IEEE two-column formatting (4 to 6 pages in length) without scanned figures, hyperlinks, or page numbering before submission."}</E></p>
          </div>

          <div className="clear-both pt-4 flex flex-wrap gap-3">
            <Link
              href="/call-for-papers#submit"
              className="btn-primary inline-flex items-center gap-2 text-sm py-2.5 px-5 font-bold"
            >
              <span><E f="c.HomeCallForPapers">{"Submit on CMT Portal"}</E></span>
              <span className="text-base font-bold"><E f="c.HomeCallForPapers">{"→"}</E></span>
            </Link>
            <Link
              href="/call-for-papers"
              className="btn-outline inline-flex items-center gap-2 text-sm py-2.5 px-5 font-semibold"
            >
              <span><E f="c.HomeCallForPapers">{"Author Formatting Guidelines"}</E></span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Compliance Guidelines Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
            <FileCheck className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-brand-primary"><E f="c.HomeCallForPapers">{"IEEE 2-Column Template"}</E></h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed"><E f="c.HomeCallForPapers">{"Papers must strictly adhere to the standard IEEE conference template (4–6 pages)."}</E></p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-brand-primary"><E f="c.HomeCallForPapers">{"Rigorous Plagiarism Screening"}</E></h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed"><E f="c.HomeCallForPapers">{"All submissions undergo automated similarity screening prior to technical peer review."}</E></p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
            <ExternalLink className="w-5 h-5 text-[#DE6D1B] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-brand-primary"><E f="c.HomeCallForPapers">{"Microsoft CMT Submission"}</E></h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed"><E f="c.HomeCallForPapers">{"Direct portal uploads only. Email submissions will not be acknowledged or reviewed."}</E></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
