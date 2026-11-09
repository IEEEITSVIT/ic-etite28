import Link from "next/link";
import { CreditCard, ExternalLink } from "lucide-react";
import E from "@/components/cms/E";

export default function HomeRegistration() {
  const fees = [
    { category: "Industry Professionals", inr: "INR 15,000", usd: "USD 400" },
    { category: "Faculty / Academicians", inr: "INR 14,000", usd: "USD 350" },
    { category: "Faculty / Academicians (IEEE Members)", inr: "INR 12,000", usd: "USD 325" },
    { category: "Research Scholars, UG and PG Students", inr: "INR 10,000", usd: "USD 300" },
    { category: "Research Scholars, UG and PG Students (IEEE Members)", inr: "INR 8,000", usd: "USD 275" },
    { category: "VIT (internal)", inr: "INR 10,000", usd: "—" },
    { category: "Co-Authors / Participants (non-authors)", inr: "INR 5,000", usd: "USD 200" },
  ];

  return (
    <section id="registration" className="border-b border-brand-border bg-white scroll-mt-20">
      <div className="container-x py-20 md:py-24">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-border bg-brand-surface text-[12px] font-semibold text-[#0B6B4A] mb-3">
            <CreditCard className="w-3.5 h-3.5" />
            <span><E f="c.HomeRegistration">{"Delegate & Author Access"}</E></span>
          </div>
          <h2 className="font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] text-brand-text"><E f="c.HomeRegistration">{"Registration Fees"}</E></h2>
          <p className="mt-3 text-[14px] text-brand-muted"><E f="c.HomeRegistration">{"Discounted pricing is available for IEEE members and registered students upon credential verification."}</E></p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-brand-border rounded-2xl shadow-sm mb-8 bg-white">
          <table className="reg-table w-full text-left font-sans text-sm sm:text-base min-w-[640px]">
            <thead>
              <tr className="bg-brand-primary text-white">
                <th className="px-6 py-4 font-bold text-sm tracking-wide"><E f="c.HomeRegistration">{"Category"}</E></th>
                <th className="px-6 py-4 text-center font-bold text-sm tracking-wide border-l border-white/10 bg-black/20"><E f="c.HomeRegistration">{"Indian Authors & Delegates"}</E></th>
                <th className="px-6 py-4 text-center font-bold text-sm tracking-wide border-l border-white/10 bg-black/30"><E f="c.HomeRegistration">{"Foreign Authors & Delegates"}</E></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {fees.map((f, idx) => (
                <tr key={f.category} className={`hover:bg-[#FFFDF7] transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}`}>
                  <td className="px-6 py-4 font-semibold text-brand-primary">
                    <div className="flex items-center gap-2.5">
                      <span className="font-sans text-slate-900"><E f="c.HomeRegistration">{f.category}</E></span>
                      {f.category.includes("(IEEE Members)") && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-sans font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shrink-0"><E f="c.HomeRegistration">{"IEEE Discount"}</E></span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-sans font-bold text-brand-primary border-l border-slate-200 tracking-tight tabular-nums"><E f="c.HomeRegistration">{f.inr}</E></td>
                  <td className="px-6 py-4 text-center font-sans font-bold text-brand-secondary border-l border-slate-200 tracking-tight tabular-nums"><E f="c.HomeRegistration">{f.usd}</E></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="bg-slate-50/90 px-6 py-3.5 border-t border-brand-border flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm text-slate-600 font-sans gap-2">
            <span className="flex items-center gap-1 font-normal text-slate-600">
              <span className="font-bold text-slate-700"><E f="c.HomeRegistration">{"*"}</E></span><E f="c.HomeRegistration">{" All registration tariffs include applicable Goods and Services Tax (GST)."}</E></span>
            <span className="font-semibold text-brand-primary bg-amber-50 text-amber-900 border border-amber-200/80 px-2.5 py-1 rounded-md text-xs"><E f="c.HomeRegistration">{"Early bird rates apply until designated announcement deadline."}</E></span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl border border-brand-border bg-brand-surface">
          <p className="text-[13px] text-brand-muted text-center sm:text-left"><E f="c.HomeRegistration">{"At least one author per accepted paper must register at the standard author category to enable IEEE Xplore indexing."}</E></p>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/registration" className="btn-outline text-xs"><E f="c.HomeRegistration">{"View Payment Instructions"}</E></Link>
            <Link href="/registration" className="btn-primary text-xs"><E f="c.HomeRegistration">{"Register Now"}</E></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
