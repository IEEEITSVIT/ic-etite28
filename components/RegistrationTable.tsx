import Link from "next/link";
import { registrationFeesData, registrationGuidelines } from "@/data/registration";
import { formatInr, formatUsd, type FeeTier } from "@/lib/settings";
import { formatDeadline, isEarlyBird, priceNow, windowState, type EarlyBird, type Prize } from "@/lib/pricing";
import PrizePool from "@/components/portal/PrizePool";
import { CreditCard, ShieldCheck, AlertCircle, ExternalLink } from "lucide-react";
import E from "@/components/cms/E";

interface Row {
  category: string;
  indianFee: string;
  foreignFee: string;
  indianEarly?: string;
  foreignEarly?: string;
  isIeeeDiscount?: boolean;
}

// Regular price, or early-bird price with the regular one struck through.
function FeeCell({ regular, early }: { regular: string; early?: string }) {
  if (!early) return <><E f="c.RegistrationTable">{regular}</E></>;
  return (
    <span className="inline-flex flex-col items-center leading-tight">
      <span className="text-xs font-semibold text-slate-400 line-through"><E f="c.RegistrationTable">{regular}</E></span>
      <span className="text-emerald-700"><E f="c.RegistrationTable">{early}</E></span>
    </span>
  );
}

export default function RegistrationTable({
  fees,
  registrationEnabled = false,
  opensAt = "",
  closesAt = "",
  earlyBird,
  prizes = [],
  prizePool = "",
}: {
  fees?: FeeTier[];
  registrationEnabled?: boolean;
  opensAt?: string;
  closesAt?: string;
  earlyBird?: EarlyBird;
  prizes?: Prize[];
  prizePool?: string;
}) {
  const early = isEarlyBird(earlyBird);
  const win = windowState(opensAt, closesAt);
  const registrationOpen = registrationEnabled && win === "open";
  const rows: Row[] = fees?.length
    ? fees.map((f) => {
        const inr = priceNow(f.inr, f.earlyInr, earlyBird);
        const usd = priceNow(f.usd, f.earlyUsd, earlyBird);
        return {
          category: f.category,
          indianFee: formatInr(f.inr),
          foreignFee: formatUsd(f.usd),
          indianEarly: inr.early ? formatInr(inr.amount) : undefined,
          foreignEarly: usd.early ? formatUsd(usd.amount) : undefined,
          isIeeeDiscount: f.isIeeeDiscount,
        };
      })
    : registrationFeesData;
  return (
    <section id="registration" className="py-8 sm:py-12 bg-white border-b border-brand-border">
      <div className="container-x">
        {/* Online registration (opened from admin → Site content → Visibility) */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border-2 border-brand-accent/60 bg-[#FFFBF0] p-5">
          <div>
            <p className="text-lg font-bold text-brand-primary">
              {registrationOpen ? "Online registration is open" : registrationEnabled && win === "closed" ? "Registration has closed" : "Online registration opens soon"}
            </p>
            <p className="text-sm text-slate-600">
              {registrationOpen
                ? "Create an account, choose your category and pay securely. Your fee is calculated from the table below."
                : registrationEnabled && win === "not_open" && opensAt
                  ? `Registration opens on ${formatDeadline(opensAt)}. Create an account now so you're ready.`
                  : registrationEnabled && win === "closed"
                    ? "The registration deadline has passed. Contact the secretariat for late registration."
                    : "Create an account now; you can register as soon as registration opens."}
            </p>
            {registrationOpen && (closesAt || early) && (
              <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold">
                {early && earlyBird && (
                  <span className="rounded-full bg-emerald-600 px-3 py-1 text-white"><E f="c.RegistrationTable">{"Early-bird pricing until "}</E>{formatDeadline(earlyBird.endsAt)}</span>
                )}
                {closesAt && <span className="rounded-full bg-brand-primary px-3 py-1 text-white"><E f="c.RegistrationTable">{"Deadline: "}</E>{formatDeadline(closesAt)}</span>}
              </div>
            )}
          </div>
          <Link
            href={registrationOpen ? "/registration/apply" : "/signup?next=/registration/apply"}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-3 text-sm font-bold text-white hover:bg-brand-primary-hover shrink-0"
          >
            {registrationOpen ? "Register now" : "Create account"}
          </Link>
        </div>

        {prizes.length > 0 || prizePool ? (
          <div className="mb-6">
            <PrizePool prizes={prizes} pool={prizePool} title="Best paper awards" />
          </div>
        ) : null}

        {/* Academic Tariff Table */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-sm sm:text-base border-collapse">
              <thead>
                <tr className="bg-brand-primary text-white border-b border-white/10">
                  <th scope="col" className="py-4 px-5 sm:px-6 font-bold text-sm sm:text-base tracking-wide"><E f="c.RegistrationTable">{"Category"}</E></th>
                  <th scope="col" className="py-4 px-5 sm:px-6 text-center font-bold border-l border-white/10 bg-black/20 text-sm sm:text-base tracking-wide"><E f="c.RegistrationTable">{"Indian Authors & Delegates"}</E></th>
                  <th scope="col" className="py-4 px-5 sm:px-6 text-center font-bold border-l border-white/10 bg-black/30 text-sm sm:text-base tracking-wide"><E f="c.RegistrationTable">{"Foreign Authors & Delegates"}</E></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 text-slate-900">
                {rows.map((tier, idx) => (
                  <tr
                    key={tier.category}
                    className={`hover:bg-[#FFFDF7] transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                    }`}
                  >
                    <td className="py-4 px-5 sm:px-6 font-semibold text-brand-primary">
                      <div className="flex items-center gap-2.5">
                        <span className="font-sans font-semibold text-slate-900 text-sm sm:text-base"><E f="c.RegistrationTable">{tier.category}</E></span>
                        {tier.isIeeeDiscount && (
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-sans font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shrink-0"><E f="c.RegistrationTable">{"IEEE Discount"}</E></span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5 sm:px-6 text-center font-sans font-bold text-brand-primary border-l border-slate-200 text-sm sm:text-base tracking-tight tabular-nums">
                      <FeeCell regular={tier.indianFee} early={tier.indianEarly} />
                    </td>
                    <td className="py-4 px-5 sm:px-6 text-center font-sans font-bold text-brand-secondary border-l border-slate-200 text-sm sm:text-base tracking-tight tabular-nums">
                      <FeeCell regular={tier.foreignFee} early={tier.foreignEarly} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50/90 px-5 sm:px-6 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm text-slate-600 font-sans gap-2">
            <span className="flex items-center gap-1 font-normal text-slate-600">
              <span className="font-bold text-slate-700"><E f="c.RegistrationTable">{"*"}</E></span><E f="c.RegistrationTable">{" All registration tariffs include applicable Goods and Services Tax (GST)."}</E></span>
            <span className="font-semibold text-brand-primary bg-amber-50 text-amber-900 border border-amber-200/80 px-2.5 py-1 rounded-md text-xs"><E f="c.RegistrationTable">{"Early bird rates apply until designated announcement deadline."}</E></span>
          </div>
        </div>

        {/* Action & Guidelines */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider text-brand-primary flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-accent-dark" />
              <span><E f="c.RegistrationTable">{"Registration Protocols & Terms"}</E></span>
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
                      item.isImportant ? "text-amber-700" : "text-brand-secondary"
                    }`}
                  />
                  <span className="leading-relaxed"><E f="c.RegistrationTable">{item.rule}</E></span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 bg-gradient-to-br from-brand-primary to-brand-primary-dark text-white p-7 sm:p-8 rounded-2xl border border-white/10 shadow-lg flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent-dark/20 border border-brand-accent-dark/40 text-brand-accent-dark text-xs font-sans font-bold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-brand-accent-dark animate-pulse"></span><E f="c.RegistrationTable">{"Registration Notice"}</E></div>
              <h3 className="text-2xl font-serif font-bold text-white mt-1 mb-3"><E f="c.RegistrationTable">{"Register For ic-ETITE'28"}</E></h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-5 font-normal"><E f="c.RegistrationTable">{"Conference registration for delegates and presenting authors will open through the official VIT portal."}</E></p>

              <div className="p-4 rounded-xl bg-white/5 border border-white/15 space-y-2 mb-6">
                <p className="text-sm font-bold text-brand-accent-dark"><E f="c.RegistrationTable">{"Registration Dates TBA"}</E></p>
                <p className="text-xs text-white/70 leading-relaxed"><E f="c.RegistrationTable">{"Registration dates are to be announced soon. More details yet to come regarding official registration portals and instructions."}</E></p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/10 border border-white/20 text-center">
              <span className="text-sm font-semibold text-white/90 block"><E f="c.RegistrationTable">{"Portal Opening Soon"}</E></span>
              <span className="text-xs text-white/60 mt-1 block"><E f="c.RegistrationTable">{"Registration dates TBA • More details yet to come"}</E></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
