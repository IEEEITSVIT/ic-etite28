import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Award, FileCheck, ShieldCheck, ArrowRight } from "lucide-react";

export default function HomeCallForPapers() {
  return (
    <section id="call-for-papers" className="border-b border-[#E4E7EC] bg-white scroll-mt-20">
      <div className="container-x py-10 md:py-14">
        {/* Scopus Recommendation Highlight */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#002147] to-[#004B87] text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Award className="w-7 h-7 text-[#FFB81C] shrink-0" />
            <p className="text-xs sm:text-sm font-semibold text-white">
              Extended versions of selected papers will be recommended for publication in Scopus indexed journals with impact factor.
            </p>
          </div>
          <span className="shrink-0 px-3 py-1 rounded-full bg-[#F5A623] text-[#002147] font-bold text-xs uppercase tracking-wider">
            Scopus Publication
          </span>
        </div>

        {/* Main Content Card: Text Wrapped Around Conference Image */}
        <div className="bg-[#FAFBFD] rounded-2xl border-2 border-slate-200/90 p-6 sm:p-8 md:p-10 shadow-sm flow-root mb-6">
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
              <p className="p-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 font-medium rounded-b-xl mt-2 text-center">
                Chief Guest and academic leadership reviewing ic-ETITE conference proceedings at VIT Vellore
              </p>
            </div>
          </div>

          {/* Text flowing all around the picture */}
          <div className="space-y-3.5">
            <span className="text-xs tracking-wider uppercase text-[#004B87] font-bold bg-[#EBF3F8] px-3 py-1 rounded-full border border-[#004B87]/20 inline-block">
              Original Scientific Research
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#002147] tracking-tight">
              Call for Papers &amp; Manuscript Submissions
            </h2>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
              Original, unpublished research papers addressing contemporary computational bottlenecks, innovative algorithms, resilient communication architectures, and smart electronic hardware are invited from researchers, academicians, and engineers worldwide. The <strong>Third International Conference on Emerging Trends in Information Technology and Engineering (ic-ETITE’28)</strong> emphasizes rigorous peer review and high scientific value across Information Technology, Computer Engineering, Communication Engineering, and Electronics Engineering.
            </p>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
              In accordance with IEEE conference publication standards, all presented manuscripts will be submitted to the <strong>IEEE Xplore Digital Library</strong>. In addition, extended versions of exceptional papers selected by the technical committee will be forwarded for expedited review and recommendation to Scopus-indexed partner journals.
            </p>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
              All manuscripts must be submitted electronically via the <strong>Microsoft Conference Management Toolkit (CMT)</strong> portal. Email submissions will strictly not be entertained. Ensure that your paper complies with standard IEEE two-column formatting (4 to 6 pages in length) without scanned figures, hyperlinks, or page numbering before submission.
            </p>
          </div>

          <div className="clear-both pt-4 flex flex-wrap gap-3">
            <Link
              href="/call-for-papers#submit"
              className="btn-primary inline-flex items-center gap-2 text-sm py-2.5 px-5 font-bold"
            >
              <span>Submit on CMT Portal</span>
              <span className="text-base font-bold">→</span>
            </Link>
            <Link
              href="/call-for-papers"
              className="btn-outline inline-flex items-center gap-2 text-sm py-2.5 px-5 font-semibold"
            >
              <span>Author Formatting Guidelines</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Compliance Guidelines Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
            <FileCheck className="w-5 h-5 text-[#002147] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#002147]">IEEE 2-Column Template</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Papers must strictly adhere to the standard IEEE conference template (4–6 pages).
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#004B87] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#002147]">Rigorous Plagiarism Screening</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                All submissions undergo automated similarity screening prior to technical peer review.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
            <ExternalLink className="w-5 h-5 text-[#DE6D1B] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#002147]">Microsoft CMT Submission</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Direct portal uploads only. Email submissions will not be acknowledged or reviewed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
