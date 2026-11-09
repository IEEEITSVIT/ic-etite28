import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import {
  FileText,
  Plane,
  ShieldCheck,
  Globe2,
  Mail,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Building2,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = pageMetadata("/visa", {
  title: "Visa Information & Facilitation | ic-ETITE'28",
  description:
    "Official Indian Conference Visa guidelines, Government of India clearances, and invitation letter assistance for international delegates of ic-ETITE'28 at VIT Vellore.",
});

export default function VisaPage() {
  return (
    <div className="bg-[#FAFBFD] min-h-screen text-[#002147]">
      <PageHeader
        badge="International Delegates & Authors · Embassy Facilitation"
        title="Conference Visa & Travel Clearance"
        subtitle="Official visa facilitation guidelines, Government of India statutory clearances, and invitation letter protocols for international participants attending ic-ETITE'28 at VIT Vellore."
        breadcrumb="Visa Information"
        bgImage="/images/frame_.webp"
      />

      <div className="container-x py-8 sm:py-12 space-y-8">
        {/* Important Notice Callout */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#002147]/15 shadow-sm flex flex-col md:flex-row items-start gap-5">
          <div className="w-12 h-12 rounded-2xl bg-[#002147] text-[#FFB81C] flex items-center justify-center shrink-0 shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-[#FFF4DB] text-[#002147] border border-[#F5A623] px-2.5 py-0.5 rounded-full">
                Statutory Requirement
              </span>
              <span className="text-xs text-slate-500 font-medium">Government of India Regulations</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#002147]">
              Conference Visa Protocol for Foreign Nationals
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              All foreign nationals (except citizens of Nepal and Bhutan holding valid identification) require a valid{" "}
              <strong>Conference Visa</strong> or an <strong>e-Conference Visa</strong> issued by the Government of India
              to enter India and present research papers or attend ic-ETITE&apos;28. Tourist visas are{" "}
              <strong className="text-rose-700">strictly prohibited</strong> for presenting papers or attending academic conferences.
            </p>
          </div>
        </div>

        {/* Visa Types Comparison */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-extrabold text-[#DE6D1B] bg-[#FFF4EB] px-3 py-1 rounded-full border border-[#DE6D1B]/30">
              Visa Categories
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#002147] mt-3">
              Available Visa Pathways
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Choose the appropriate visa category based on your nationality and embassy regulations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Option 1: e-Conference Visa */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 shadow-sm hover:border-[#002147] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                    Recommended &amp; Fast-Track
                  </span>
                  <Clock className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#002147] mb-2">
                  e-Conference Visa (Online)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed font-normal">
                  Citizens of eligible countries (over 160+ nations) can apply online via the official Government of India portal without visiting an Indian Mission in person.
                </p>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Applied 100% online through <strong>indianvisaonline.gov.in</strong></span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Processing time: <strong>4 to 7 working days</strong></span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Valid for entry through 30+ designated international airports (including Chennai MAA &amp; Bengaluru BLR)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Requires official invitation letter and conference clearance copies from VIT</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <a
                  href="https://indianvisaonline.gov.in/evisa/tvoa.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full text-xs sm:text-sm flex items-center justify-center gap-2 py-3"
                >
                  <span>Apply on Official Indian e-Visa Portal</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Option 2: Regular Paper Conference Visa */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 shadow-sm hover:border-[#002147] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-300 uppercase tracking-wider">
                    Indian Mission / Embassy
                  </span>
                  <Building2 className="w-4 h-4 text-slate-500" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#002147] mb-2">
                  Regular Conference Visa
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed font-normal">
                  For delegates from non-eVisa countries or those requiring physical sticker visas stamped at the nearest Indian Embassy or Consulate General.
                </p>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#002147] shrink-0 mt-0.5" />
                    <span>Submitted to Indian Embassy, High Commission, or authorized VFS centre</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#002147] shrink-0 mt-0.5" />
                    <span>Processing time: <strong>3 to 6 weeks</strong> (apply at least 45 days before travel)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#002147] shrink-0 mt-0.5" />
                    <span>Requires signed original/electronic official invitation letter with seal</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#002147] shrink-0 mt-0.5" />
                    <span>Requires MHA, MEA, and MoE statutory clearance letters provided by VIT</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <a
                  href="https://indianvisaonline.gov.in/visa/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full text-xs sm:text-sm flex items-center justify-center gap-2 py-3"
                >
                  <span>Regular Visa Application Portal</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Step-by-Step Process */}
        <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#DE6D1B]">Roadmap</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#002147] mt-1">
              4 Steps to Obtain Your Indian Conference Visa
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#FAFBFD] border border-slate-200 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#002147] text-[#FFB81C] font-bold text-sm flex items-center justify-center">
                1
              </div>
              <h4 className="font-bold text-base text-[#002147]">Paper Acceptance &amp; Registration</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ensure your manuscript is accepted and complete delegate/author fee registration for ic-ETITE&apos;28.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFBFD] border border-slate-200 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#002147] text-[#FFB81C] font-bold text-sm flex items-center justify-center">
                2
              </div>
              <h4 className="font-bold text-base text-[#002147]">Request Invitation Letter</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit your passport details and Paper ID to the organizing team to receive an official personalized invitation letter.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFBFD] border border-slate-200 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#002147] text-[#FFB81C] font-bold text-sm flex items-center justify-center">
                3
              </div>
              <h4 className="font-bold text-base text-[#002147]">Apply Online / Embassy</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit the e-Conference Visa application online with the invitation letter and Government clearance documents attached.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFBFD] border border-slate-200 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#002147] text-[#FFB81C] font-bold text-sm flex items-center justify-center">
                4
              </div>
              <h4 className="font-bold text-base text-[#002147]">Receive Electronic Travel Auth</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive your Electronic Travel Authorization (ETA) via email, print it out, and board your flight to India!
              </p>
            </div>
          </div>
        </section>

        {/* How to Request an Official Invitation Letter */}
        <section id="invitation-letter" className="bg-gradient-to-br from-[#001C3D] to-[#002A5C] rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-[#FFB81C] bg-white/10 px-3 py-1 rounded-full border border-white/15 inline-block">
                Facilitation Protocol
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                Request Official Visa Invitation Letter
              </h2>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal">
                To issue your customized, official conference invitation letter bearing the seal of Vellore Institute of Technology, please email our Conference Secretariat with the following particulars:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-white/90">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFB81C]" />
                  <span>Full Legal Name (as printed on Passport)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFB81C]" />
                  <span>Passport Number &amp; Expiry Date</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFB81C]" />
                  <span>Nationality &amp; Country of Residence</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFB81C]" />
                  <span>Institutional Affiliation / University</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFB81C]" />
                  <span>Accepted Paper ID &amp; Title</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFB81C]" />
                  <span>Confirmed Registration Receipt Number</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8 backdrop-blur-md text-center space-y-4">
              <Mail className="w-10 h-10 text-[#FFB81C] mx-auto" />
              <h3 className="font-bold text-lg text-white">Direct Email Request</h3>
              <p className="text-xs text-white/75 leading-relaxed">
                Send your details to the official conference secretariat email with the subject line:
                <br />
                <code className="text-[#72EFDD] bg-black/40 px-2 py-0.5 rounded text-[11px] mt-1 inline-block">
                  [Visa Letter Request] Paper ID - Full Name
                </code>
              </p>

              <a
                href="mailto:icetiteconference@vit.ac.in?subject=%5BVisa%20Letter%20Request%5D%20Paper%20ID%20-%20Full%20Name&body=Dear%20ic-ETITE%2728%20Secretariat%2C%0A%0APlease%20find%20my%20details%20for%20an%20official%20visa%20invitation%20letter%3A%0A%0A1.%20Full%20Name%20(as%20in%20Passport)%3A%20%0A2.%20Passport%20Number%3A%20%0A3.%20Passport%20Expiry%20Date%3A%20%0A4.%20Nationality%3A%20%0A5.%20Institution%2FUniversity%3A%20%0A6.%20Designation%3A%20%0A7.%20Accepted%20Paper%20ID%20%26%20Title%3A%20%0A8.%20Registration%20Order%20ID%3A%20%0A%0AThank%20you%2C%0A"
                className="btn-primary w-full text-xs sm:text-sm py-3 flex items-center justify-center gap-2 font-bold shadow-lg"
              >
                <Mail className="w-4 h-4" />
                <span>Email: icetiteconference@vit.ac.in</span>
              </a>

              <p className="text-[11px] text-white/60">
                Letters are dispatched within 2–3 business days after registration verification.
              </p>
            </div>
          </div>
        </section>

        {/* Statutory Clearances Note */}
        <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm space-y-4">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#002147] flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-[#DE6D1B]" />
            <span>Government of India Statutory Clearances</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            As an IEEE technically co-sponsored conference hosted by an Institution of Eminence (VIT Vellore), ic-ETITE&apos;28 adheres strictly to the Ministry of Home Affairs (MHA) and Ministry of External Affairs (MEA) guidelines for international conferences held in India.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-bold text-[#002147]">MEA Clearance</p>
              <p className="text-[11px] text-slate-600 mt-1">Ministry of External Affairs Political Clearance</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-bold text-[#002147]">MHA Clearance</p>
              <p className="text-[11px] text-slate-600 mt-1">Ministry of Home Affairs Event Clearance &amp; Security Vetting</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-bold text-[#002147]">MoE Nodal Clearance</p>
              <p className="text-[11px] text-slate-600 mt-1">Ministry of Education Conference Clearance</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
