import Link from "next/link";
import { notFound } from "next/navigation";
import { first, parseJson } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { formatInr, getSettings } from "@/lib/settings";
import { formatDeadline, isEarlyBird, priceNow, windowState } from "@/lib/pricing";
import { ORG_TYPES } from "@/lib/portal/technext";
import { cancelTechnextBookingAction, saveTechnextBookingAction } from "@/app/actions/registrations";
import SubmitButton from "@/components/portal/SubmitButton";
import { Card, Empty, Field, Flash, PortalPage, StatusBadge, btnDanger, btnSecondary, inputCls } from "@/components/portal/ui";
import { portalMetadata } from "@/lib/seo";

export const metadata = portalMetadata("Book a TechNext stall");

interface Booking {
  id: string;
  organization_name: string;
  organization_type: string;
  sector: string;
  contact_name: string;
  designation: string | null;
  email: string;
  phone: string;
  city: string;
  state: string | null;
  website: string | null;
  stall_type: string;
  representatives: string;
  exhibit_description: string;
  power_required: number;
  special_requirements: string | null;
  gst_number: string | null;
  status: string;
  payment_status: string;
  admin_notes: string | null;
}

export default async function TechnextRegisterPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { ok, error } = await searchParams;
  const user = await requireUser("/technext/register");
  const settings = await getSettings();
  if (!settings.visibility.technext) notFound();
  const booking = await first<Booking>("SELECT * FROM technext_bookings WHERE user_id = ? AND status != 'cancelled' ORDER BY created_at DESC LIMIT 1", [user.id]);
  const tw = windowState(settings.technext.opensAt, settings.technext.closesAt);
  const open = settings.visibility.technextRegistration && tw === "open";
  const eb = settings.technext.earlyBird;
  const editable = booking ? booking.status === "pending" && settings.visibility.technextRegistration : open;
  const b = booking;

  return (
    <PortalPage
      title="TechNext '28 stall booking"
      subtitle="National industrial expo & innovation showcase at VIT Vellore, 10–11 February 2028."
      width="max-w-4xl"
      actions={
        <Link href="/dashboard" className={btnSecondary}>
          Dashboard
        </Link>
      }
    >
      <Flash ok={ok} error={error} />
      {b && (
        <Card className="mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-brand-primary">{b.organization_name}</span>
            <StatusBadge status={b.status} />
            <StatusBadge status={b.payment_status} />
          </div>
          {b.status === "pending" && <p className="mt-2 text-sm text-slate-600">Your booking is under review. Payment opens on your dashboard once it is approved.</p>}
          {b.admin_notes && <p className="mt-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">Note from organisers: {b.admin_notes}</p>}
        </Card>
      )}

      {!b && open && (isEarlyBird(eb) || settings.technext.closesAt) && (
        <div className="mb-6 flex flex-wrap gap-2 text-xs font-bold">
          {isEarlyBird(eb) && <span className="rounded-full bg-emerald-600 px-3 py-1.5 text-white">Early-bird prices until {formatDeadline(eb.endsAt)}</span>}
          {settings.technext.closesAt && <span className="rounded-full bg-brand-primary px-3 py-1.5 text-white">Booking deadline: {formatDeadline(settings.technext.closesAt)}</span>}
        </div>
      )}
      {!editable && !b ? (
        <Empty>
          {settings.visibility.technextRegistration && tw === "not_open"
            ? `Stall bookings open on ${formatDeadline(settings.technext.opensAt)}.`
            : settings.visibility.technextRegistration && tw === "closed"
              ? "The stall booking deadline has passed. Contact the organisers for late bookings."
              : "Stall bookings are closed right now."}
        </Empty>
      ) : (
        <Card title={b ? "Booking details" : "Book a stall"}>
          <form action={saveTechnextBookingAction} className="space-y-6">
            <fieldset disabled={!editable} className="space-y-6">
              <div>
                <span className="mb-2 block text-sm font-semibold text-slate-700">Stall type</span>
                <div className="grid gap-3 sm:grid-cols-3">
                  {settings.technext.stallTypes.map((s, i) => (
                    <label key={s.key} className="flex cursor-pointer flex-col gap-1 rounded-xl border border-slate-200 p-4 has-[:checked]:border-brand-primary has-[:checked]:ring-2 has-[:checked]:ring-brand-primary/15">
                      <span className="flex items-center gap-2">
                        <input type="radio" name="stall_type" value={s.key} required defaultChecked={b ? b.stall_type === s.key : i === 0} className="accent-brand-primary" />
                        <span className="font-bold text-brand-primary">{s.label}</span>
                      </span>
                      <span className="text-xs text-slate-500">
                        {s.size} · {s.description}
                      </span>
                      {(() => {
                        const p = priceNow(s.price, s.earlyPrice, eb);
                        return (
                          <span className="mt-1 font-extrabold">
                            {p.early && <span className="mr-1.5 text-xs font-semibold text-slate-400 line-through">{formatInr(s.price)}</span>}
                            <span className={p.early ? "text-emerald-700" : "text-[#F37021]"}>{p.amount ? formatInr(p.amount) : "Free"}</span>
                          </span>
                        );
                      })()}
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Organisation / project name">
                  <input name="organization_name" required defaultValue={b?.organization_name ?? user.institution ?? ""} className={inputCls} />
                </Field>
                <Field label="Organisation type">
                  <select name="organization_type" required defaultValue={b?.organization_type ?? ""} className={inputCls}>
                    <option value="" disabled>
                      Choose…
                    </option>
                    {ORG_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Sector / domain" hint="e.g. EV, Robotics, AI, IoT, FinTech">
                  <input name="sector" required defaultValue={b?.sector ?? ""} className={inputCls} />
                </Field>
                <Field label="Website (optional)">
                  <input name="website" type="url" defaultValue={b?.website ?? ""} placeholder="https://" className={inputCls} />
                </Field>
                <Field label="Contact person">
                  <input name="contact_name" required defaultValue={b?.contact_name ?? user.name} className={inputCls} />
                </Field>
                <Field label="Designation">
                  <input name="designation" defaultValue={b?.designation ?? ""} className={inputCls} />
                </Field>
                <Field label="Contact email">
                  <input name="email" type="email" required defaultValue={b?.email ?? user.email} className={inputCls} />
                </Field>
                <Field label="Contact phone">
                  <input name="phone" type="tel" required defaultValue={b?.phone ?? user.phone ?? ""} className={inputCls} />
                </Field>
                <Field label="City">
                  <input name="city" required defaultValue={b?.city ?? user.city ?? ""} className={inputCls} />
                </Field>
                <Field label="State">
                  <input name="state" defaultValue={b?.state ?? ""} className={inputCls} />
                </Field>
              </div>
              <Field label="What will you exhibit?" hint="Products, prototypes or projects, and anything visitors can try.">
                <textarea name="exhibit_description" required rows={4} defaultValue={b?.exhibit_description ?? ""} className={inputCls} />
              </Field>
              <Field label={`Stall representatives (max ${settings.technext.maxRepresentatives})`} hint="One name per line. Badges and certificates are issued to these people.">
                <textarea name="representatives" required rows={3} defaultValue={b ? parseJson<string[]>(b.representatives, []).join("\n") : user.name} className={inputCls} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Special requirements (optional)">
                  <textarea name="special_requirements" rows={2} defaultValue={b?.special_requirements ?? ""} className={inputCls} />
                </Field>
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input type="checkbox" name="power_required" defaultChecked={b ? b.power_required === 1 : true} className="h-4 w-4 accent-brand-primary" /> Power supply required
                  </label>
                  <Field label="GSTIN (optional, for invoice)">
                    <input name="gst_number" maxLength={15} defaultValue={b?.gst_number ?? ""} className={`${inputCls} uppercase`} />
                  </Field>
                </div>
              </div>
            </fieldset>
            {editable && <SubmitButton pendingText="Submitting…">{b ? "Update booking" : "Submit booking"}</SubmitButton>}
          </form>
          {b && b.status === "pending" && b.payment_status !== "paid" && (
            <form action={cancelTechnextBookingAction} className="mt-4 border-t border-slate-100 pt-4">
              <SubmitButton className={btnDanger} confirm="Cancel this stall booking?">
                Cancel booking
              </SubmitButton>
            </form>
          )}
        </Card>
      )}
    </PortalPage>
  );
}
