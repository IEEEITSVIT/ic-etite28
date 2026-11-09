import Link from "next/link";
import { registrationFeesData, registrationGuidelines } from "@/data/registration";
import { CreditCard, ShieldCheck, AlertCircle, ExternalLink } from "lucide-react";

export default function RegistrationTable() {
  return (
    <section id="registration" className="py-8 sm:py-12 bg-white border-b border-[#E4E7EC]">
      <div className="container-x">
        {/* Academic Tariff Table */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-sm sm:text-base border-collapse">
              <thead>
                <tr className="bg-[#002147] text-white border-b border-white/10">
                  <th scope="col" className="py-4 px-5 sm:px-6 font-bold text-sm sm:text-base tracking-wide">
                    Category
                  </th>
                  <th scope="col" className="py-4 px-5 sm:px-6 text-center font-bold border-l border-white/10 bg-black/20 text-sm sm:text-base tracking-wide">
                    Indian Authors &amp; Delegates
                  </th>
                  <th scope="col" className="py-4 px-5 sm:px-6 text-center font-bold border-l border-white/10 bg-black/30 text-sm sm:text-base tracking-wide">
                    Foreign Authors &amp; Delegates
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 text-slate-900">
                {registrationFeesData.map((tier, idx) => (
                  <tr
                    key={tier.category}
                    className={`hover:bg-[#FFFDF7] transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                    }`}
                  >
                    <td className="py-4 px-5 sm:px-6 font-semibold text-[#002147]">
                      <div className="flex items-center gap-2.5">
                        <span className="font-sans font-semibold text-slate-900 text-sm sm:text-base">{tier.category}</span>
                        {tier.isIeeeDiscount && (
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-sans font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shrink-0">
                            IEEE Discount
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5 sm:px-6 text-center font-sans font-bold text-[#002147] border-l border-slate-200 text-sm sm:text-base tracking-tight tabular-nums">
                      {tier.indianFee}
                    </td>
                    <td className="py-4 px-5 sm:px-6 text-center font-sans font-bold text-[#004B87] border-l border-slate-200 text-sm sm:text-base tracking-tight tabular-nums">
                      {tier.foreignFee}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50/90 px-5 sm:px-6 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm text-slate-600 font-sans gap-2">
            <span className="flex items-center gap-1 font-normal text-slate-600">
              <span className="font-bold text-slate-700">*</span> All registration tariffs include applicable Goods and Services Tax (GST).
            </span>
            <span className="font-semibold text-[#002147] bg-amber-50 text-amber-900 border border-amber-200/80 px-2.5 py-1 rounded-md text-xs">
              Early bird rates apply until designated announcement deadline.
            </span>
          </div>
        </div>

        {/* Action & Guidelines */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider text-[#002147] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#F5A623]" />
              <span>Registration Protocols &amp; Terms</span>
            </h3>
            <ul className="space-y-3 text-sm sm:text-base text-slate-700">
              {registrationGuidelines.map((item, idx) => (
                <li
                  key={idx}
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    item.isImportant
                      ? "bg-amber-50/90 border-amber-300 text-amber-950 font-semibold"
                      : "bg-white border-slate-200 text-slate-800"
                  }`}
                >
                  <AlertCircle
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      item.isImportant ? "text-amber-700" : "text-[#004B87]"
                    }`}
                  />
                  <span className="leading-relaxed">{item.rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 bg-gradient-to-br from-[#002147] to-[#001733] text-white p-7 sm:p-8 rounded-2xl border border-white/10 shadow-lg flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5A623]/20 border border-[#F5A623]/40 text-[#F5A623] text-xs font-sans font-bold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-[#F5A623] animate-pulse"></span>
                Registration Notice
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mt-1 mb-3">
                Register For ic-ETITE&apos;28
              </h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-5 font-normal">
                Conference registration for delegates and presenting authors will open through the official VIT portal.
              </p>

              <div className="p-4 rounded-xl bg-white/5 border border-white/15 space-y-2 mb-6">
                <p className="text-sm font-bold text-[#F5A623]">
                  Registration Dates TBA
                </p>
                <p className="text-xs text-white/70 leading-relaxed">
                  Registration dates are to be announced soon. More details yet to come regarding official registration portals and instructions.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/10 border border-white/20 text-center">
              <span className="text-sm font-semibold text-white/90 block">
                Portal Opening Soon
              </span>
              <span className="text-xs text-white/60 mt-1 block">
                Registration dates TBA &bull; More details yet to come
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
