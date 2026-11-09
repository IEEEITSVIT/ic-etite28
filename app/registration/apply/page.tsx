import Link from "next/link";
import { first } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { formatInr, formatUsd, getSettings } from "@/lib/settings";
import { formatDeadline, isEarlyBird, priceNow, windowState } from "@/lib/pricing";
import { saveConferenceRegistrationAction } from "@/app/actions/registrations";
import SubmitButton from "@/components/portal/SubmitButton";
import PaymentCard from "@/components/portal/PaymentCard";
import { Card, Empty, Field, Flash, PortalPage, StatusBadge, btnSecondary, inputCls } from "@/components/portal/ui";
import { portalMetadata } from "@/lib/seo";

export const metadata = portalMetadata("Conference registration");

interface Reg {
  id: string;
  category_key: string;
  residency: string;
  ieee_member: number;
  ieee_number: string | null;
  affiliation: string;
  designation: string | null;
  country: string;
  paper_ids: string | null;
  paper_titles: string | null;
  presenting_author: number;
  status: string;
  payment_status: string;
  payment_amount: number;
  payment_currency: string;
}

export default async function ConferenceRegisterPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { ok, error } = await searchParams;
  const user = await requireUser("/registration/apply");
  const settings = await getSettings();
  const reg = await first<Reg>("SELECT * FROM conference_registrations WHERE user_id = ?", [user.id]);
  const locked = reg ? reg.status === "confirmed" || reg.payment_status === "paid" || reg.payment_status === "waived" : false;
  const win = windowState(settings.conference.opensAt, settings.conference.closesAt);
  // Existing registrations stay editable after the deadline until they are paid/confirmed.
  const open = settings.visibility.conferenceRegistration && (win === "open" || Boolean(reg));
  const eb = settings.conference.earlyBird;
  const early = isEarlyBird(eb);

  return (
    <PortalPage
      title="ic-ETITE'28 registration"
      subtitle="Author, delegate and participant registration. Fees follow the published registration tariff."
      width="max-w-4xl"
      actions={
        <Link href="/registration" className={btnSecondary}>
          Fee details
        </Link>
      }
    >
      <Flash ok={ok} error={error} />
      {!reg && settings.visibility.conferenceRegistration && (early || settings.conference.closesAt) && (
        <div className="mb-6 flex flex-wrap gap-2 text-xs font-bold">
          {early && <span className="rounded-full bg-emerald-600 px-3 py-1.5 text-white">Early-bird pricing until {formatDeadline(eb.endsAt)}</span>}
          {settings.conference.closesAt && <span className="rounded-full bg-brand-primary px-3 py-1.5 text-white">Registration deadline: {formatDeadline(settings.conference.closesAt)}</span>}
        </div>
      )}
      {reg && (
        <Card className="mb-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="font-bold text-brand-primary">Your registration</span>
            <StatusBadge status={reg.status} />
          </div>
          <PaymentCard purpose="conference" refId={reg.id} amount={reg.payment_amount} currency={reg.payment_currency} status={reg.payment_status} back="/registration/apply" />
        </Card>
      )}
      {!open && !reg ? (
        <Empty>
          {settings.visibility.conferenceRegistration && win === "closed"
            ? "The registration deadline has passed. Please contact the secretariat."
            : settings.visibility.conferenceRegistration && win === "not_open"
              ? `Registration opens on ${formatDeadline(settings.conference.opensAt)}.`
              : "Conference registration will open soon. Please check the Important Dates page."}
        </Empty>
      ) : (
        <Card title={reg ? "Registration details" : "Register"}>
          <form action={saveConferenceRegistrationAction} className="space-y-6">
            <fieldset disabled={locked || !open} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Registering as">
                  <input value={`${user.name} (${user.email})`} disabled className={inputCls} />
                </Field>
                <Field label="Delegate type">
                  <select name="residency" defaultValue={reg?.residency ?? "indian"} className={inputCls}>
                    <option value="indian">Indian delegate (INR)</option>
                    <option value="foreign">Foreign delegate (USD)</option>
                  </select>
                </Field>
              </div>
              <div>
                <span className="mb-2 block text-sm font-semibold text-slate-700">Category</span>
                <div className="space-y-2">
                  {settings.fees.map((f, i) => (
                    <label key={f.key} className="flex cursor-pointer flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 px-4 py-3 has-[:checked]:border-brand-primary has-[:checked]:ring-2 has-[:checked]:ring-brand-primary/15">
                      <span className="flex items-center gap-2.5">
                        <input type="radio" name="category" value={f.key} required defaultChecked={reg ? reg.category_key === f.key : i === 0} className="accent-brand-primary" />
                        <span className="font-semibold text-slate-800">{f.category}</span>
                      </span>
                      <span className="text-right text-sm font-bold text-brand-primary">
                        {(() => {
                          const inr = priceNow(f.inr, f.earlyInr, eb);
                          const usd = priceNow(f.usd, f.earlyUsd, eb);
                          return (
                            <>
                              {inr.early && <span className="mr-1 text-xs text-slate-400 line-through">{formatInr(f.inr)}</span>}
                              <span className={inr.early ? "text-emerald-700" : ""}>{formatInr(inr.amount)}</span>
                              {" · "}
                              {usd.early && <span className="mr-1 text-xs text-slate-400 line-through">{formatUsd(f.usd)}</span>}
                              <span className={usd.early ? "text-emerald-700" : ""}>{formatUsd(usd.amount)}</span>
                            </>
                          );
                        })()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Affiliation (institution / organisation)">
                  <input name="affiliation" required defaultValue={reg?.affiliation ?? user.institution ?? ""} className={inputCls} />
                </Field>
                <Field label="Designation">
                  <input name="designation" defaultValue={reg?.designation ?? ""} placeholder="Professor / Research Scholar / Student" className={inputCls} />
                </Field>
                <Field label="Country">
                  <input name="country" defaultValue={reg?.country ?? "India"} className={inputCls} />
                </Field>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 pt-7 text-sm font-semibold text-slate-700">
                    <input type="checkbox" name="ieee_member" defaultChecked={reg?.ieee_member === 1} className="h-4 w-4 accent-brand-primary" /> I am an IEEE member
                  </label>
                  <input name="ieee_number" defaultValue={reg?.ieee_number ?? ""} placeholder="IEEE membership number" inputMode="numeric" className={inputCls} />
                </div>
                <Field label="CMT paper ID(s)" hint="Comma-separated, e.g. 123, 456">
                  <input name="paper_ids" defaultValue={reg?.paper_ids ?? ""} className={inputCls} />
                </Field>
                <label className="flex items-center gap-2 pt-7 text-sm font-semibold text-slate-700">
                  <input type="checkbox" name="presenting_author" defaultChecked={reg?.presenting_author === 1} className="h-4 w-4 accent-brand-primary" /> I am the presenting author
                </label>
                <Field label="Paper title(s)" className="sm:col-span-2">
                  <textarea name="paper_titles" rows={2} defaultValue={reg?.paper_titles ?? ""} className={inputCls} />
                </Field>
              </div>
            </fieldset>
            {!locked && open && <SubmitButton pendingText="Saving…">{reg ? "Update registration" : "Register"}</SubmitButton>}
            {locked && <p className="text-sm text-slate-600">Your registration is confirmed. Contact the secretariat for any changes.</p>}
          </form>
        </Card>
      )}
    </PortalPage>
  );
}
