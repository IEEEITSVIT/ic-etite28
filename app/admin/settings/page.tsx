import { getSettings } from "@/lib/settings";
import {
  saveConferenceAction,
  saveDatesAction,
  saveFeesAction,
  saveInvoiceTemplateAction,
  savePaymentsAction,
  saveSponsorshipAction,
  saveTechnextAction,
  saveTickerAction,
  saveVisibilityAction,
} from "@/app/actions/admin-settings";
import { EarlyBirdFields, PrizeFields } from "@/components/admin/CmsFields";
import SubmitButton from "@/components/portal/SubmitButton";
import { Card, Field, Flash, PortalPage, inputCls } from "@/components/portal/ui";

const small = `${inputCls} !py-2 !text-sm`;
const BLANK_ROWS = 2;

function Toggle({ name, label, hint, checked }: { name: string; label: string; hint: string; checked: boolean }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
      <input type="checkbox" name={name} defaultChecked={checked} className="mt-1 h-4 w-4 accent-[#002147]" />
      <span>
        <span className="block font-semibold text-slate-800">{label}</span>
        <span className="block text-sm text-slate-500">{hint}</span>
      </span>
    </label>
  );
}

export default async function AdminSettingsPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { ok, error } = await searchParams;
  const s = await getSettings();
  const dateRows = [...s.dates, ...Array.from({ length: BLANK_ROWS }, () => null)];
  const feeRows = [...s.fees, ...Array.from({ length: BLANK_ROWS }, () => null)];
  const stallRows = [...s.technext.stallTypes, ...Array.from({ length: BLANK_ROWS }, () => null)];
  const tickRows = [...s.ticker.items, ...Array.from({ length: BLANK_ROWS }, () => null)];
  const pkgRows = [...s.sponsorship.packages, null];
  const startLocal = s.conferenceStart.slice(0, 16);

  return (
    <PortalPage
      title="Site content (CMS)"
      subtitle="Changes here update the public website within seconds: important dates, registration fees, section visibility, TechNext stalls and payment links."
      width="max-w-7xl"
    >
      <Flash ok={ok} error={error} />
      <div className="space-y-6">
        <Card title="Visibility">
          <form id="visibility" action={saveVisibilityAction} className="space-y-4 scroll-mt-28">
            <div className="grid gap-3 sm:grid-cols-2">
              <Toggle name="bolt" label="BOLT hackathon" hint="Shows the BOLT page, navbar badge and menu card." checked={s.visibility.bolt} />
              <Toggle name="technext" label="TechNext expo" hint="Shows the TechNext page, navbar badge and menu card." checked={s.visibility.technext} />
              <Toggle
                name="conferenceRegistration"
                label="Conference registration open"
                hint="Shows the Register button on the Registration page and dashboard."
                checked={s.visibility.conferenceRegistration}
              />
              <Toggle name="technextRegistration" label="TechNext stall booking open" hint="Lets exhibitors book stalls from the TechNext page." checked={s.visibility.technextRegistration} />
            </div>
            <Field label="BOLT event slug" hint="The portal event that the BOLT page's Register button opens (Events & BOLT → event URL).">
              <input name="bolt_slug" defaultValue={s.bolt.eventSlug} className={`${inputCls} max-w-sm`} />
            </Field>
            <SubmitButton pendingText="Saving…">Save visibility</SubmitButton>
          </form>
        </Card>

        <Card title="Scrolling announcement bar">
          <form id="ticker" action={saveTickerAction} className="space-y-4 scroll-mt-28">
            <input type="hidden" name="tick_count" value={tickRows.length} />
            <div className="flex flex-wrap items-end gap-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input type="checkbox" name="enabled" defaultChecked={s.ticker.enabled} className="h-4 w-4 accent-[#002147]" /> Show the bar on the website
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input type="checkbox" name="dismissible" defaultChecked={s.ticker.dismissible} className="h-4 w-4 accent-[#002147]" /> Visitors can close it
              </label>
              <Field label="Label" className="w-48">
                <input name="label" defaultValue={s.ticker.label} placeholder="Announcements" className={small} />
              </Field>
              <Field label="Scroll speed" className="w-40">
                <select name="speed" defaultValue={s.ticker.speed} className={small}>
                  <option value="slow">Slow</option>
                  <option value="normal">Normal</option>
                  <option value="fast">Fast</option>
                </select>
              </Field>
            </div>
            <div className="space-y-2">
              {tickRows.map((t, i) => (
                <div key={i} className="grid gap-2 rounded-xl border border-slate-200 p-3 md:grid-cols-12 md:items-center">
                  <input name={`tick_text_${i}`} defaultValue={t?.text ?? ""} placeholder="Announcement text" className={`${small} md:col-span-6`} />
                  <input name={`tick_url_${i}`} defaultValue={t?.url ?? ""} placeholder="Link: /registration or https://…" className={`${small} md:col-span-4`} />
                  <label className="flex items-center gap-1.5 text-sm text-slate-600 md:col-span-1">
                    <input type="checkbox" name={`tick_new_${i}`} defaultChecked={t?.isNew ?? false} className="accent-[#002147]" /> New
                  </label>
                  {t && (
                    <label className="flex items-center gap-1.5 text-sm text-red-600 md:col-span-1">
                      <input type="checkbox" name={`tick_delete_${i}`} className="accent-red-600" /> Delete
                    </label>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">Items scroll continuously above the navbar and pause when hovered. It is not shown on admin or evaluator pages.</p>
            <SubmitButton pendingText="Saving…">Save announcement bar</SubmitButton>
          </form>
        </Card>

        <Card title="Important dates">
          <form id="dates" action={saveDatesAction} className="space-y-4 scroll-mt-28">
            <input type="hidden" name="date_count" value={dateRows.length} />
            <p className="text-sm text-slate-500">
              Shown on the home page, Important Dates page, Call for Papers and the hero countdown. Rows are sorted by date. Leave a row empty to skip it.
            </p>
            <div className="space-y-3">
              {dateRows.map((d, i) => (
                <div key={i} className="grid gap-2 rounded-xl border border-slate-200 p-3 md:grid-cols-12">
                  <input type="hidden" name={`date_id_${i}`} defaultValue={d?.id ?? ""} />
                  <input name={`date_title_${i}`} defaultValue={d?.title ?? ""} placeholder="Title (e.g. Full Paper Submission)" className={`${small} md:col-span-4`} />
                  <input name={`date_short_${i}`} defaultValue={d?.shortTitle ?? ""} placeholder="Short title (countdown)" className={`${small} md:col-span-3`} />
                  <input name={`date_iso_${i}`} type="date" defaultValue={d?.isoDate ?? ""} className={`${small} md:col-span-2`} />
                  <input name={`date_label_${i}`} defaultValue={d?.date ?? ""} placeholder="Display (05 October 2027)" className={`${small} md:col-span-3`} />
                  <input name={`date_shortlabel_${i}`} defaultValue={d?.shortDate ?? ""} placeholder="Short display (05 Oct 2027)" className={`${small} md:col-span-3`} />
                  <input name={`date_desc_${i}`} defaultValue={d?.description ?? ""} placeholder="Description" className={`${small} md:col-span-6`} />
                  <label className="flex items-center gap-2 text-sm text-slate-600 md:col-span-2">
                    <input type="checkbox" name={`date_key_${i}`} defaultChecked={d?.isKeyMilestone ?? false} className="accent-[#002147]" /> Key milestone
                  </label>
                  {d && (
                    <label className="flex items-center gap-2 text-sm text-red-600 md:col-span-1">
                      <input type="checkbox" name={`date_delete_${i}`} className="accent-red-600" /> Delete
                    </label>
                  )}
                </div>
              ))}
            </div>
            <Field label="Conference start (IST) for the countdown" className="max-w-xs">
              <input name="conference_start" type="datetime-local" defaultValue={startLocal} className={small} />
            </Field>
            <SubmitButton pendingText="Saving…">Save dates</SubmitButton>
          </form>
        </Card>

        <Card title="Conference registration fees">
          <form id="fees" action={saveFeesAction} className="space-y-4 scroll-mt-28">
            <input type="hidden" name="fee_count" value={feeRows.length} />
            <p className="text-sm text-slate-500">
              Shown on the Registration page and used to calculate the amount payable when delegates register. Leave an amount blank if the category does not apply. Early columns are optional: during the early-bird period
              (set under Conference registration below) they replace the regular price; tiers without one get the default early-bird %.
            </p>
            <div className="space-y-2">
              <div className="hidden gap-2 px-3 text-xs font-bold uppercase tracking-wide text-slate-500 md:grid md:grid-cols-12">
                <span className="md:col-span-4">Category</span>
                <span className="md:col-span-2">Indian (INR)</span>
                <span className="md:col-span-2">Foreign (USD)</span>
                <span className="md:col-span-1 text-emerald-700">Early INR</span>
                <span className="md:col-span-1 text-emerald-700">Early USD</span>
                <span className="md:col-span-2" />
              </div>
              {feeRows.map((f, i) => (
                <div key={i} className="grid gap-2 rounded-xl border border-slate-200 p-3 md:grid-cols-12 md:items-center">
                  <input type="hidden" name={`fee_key_${i}`} defaultValue={f?.key ?? ""} />
                  <input name={`fee_category_${i}`} defaultValue={f?.category ?? ""} placeholder="Category" className={`${small} md:col-span-4`} />
                  <input name={`fee_inr_${i}`} inputMode="numeric" defaultValue={f?.inr ?? ""} placeholder="15000" className={`${small} md:col-span-2`} />
                  <input name={`fee_usd_${i}`} inputMode="numeric" defaultValue={f?.usd ?? ""} placeholder="400" className={`${small} md:col-span-2`} />
                  <input name={`fee_einr_${i}`} inputMode="numeric" defaultValue={f?.earlyInr ?? ""} placeholder="—" title="Early-bird INR" className={`${small} md:col-span-1`} />
                  <input name={`fee_eusd_${i}`} inputMode="numeric" defaultValue={f?.earlyUsd ?? ""} placeholder="—" title="Early-bird USD" className={`${small} md:col-span-1`} />
                  <div className="flex flex-wrap gap-3 md:col-span-2">
                    <label className="flex items-center gap-1.5 text-sm text-slate-600">
                      <input type="checkbox" name={`fee_ieee_${i}`} defaultChecked={f?.isIeeeDiscount ?? false} className="accent-[#002147]" /> IEEE
                    </label>
                    {f && (
                      <label className="flex items-center gap-1.5 text-sm text-red-600">
                        <input type="checkbox" name={`fee_delete_${i}`} className="accent-red-600" /> Delete
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <SubmitButton pendingText="Saving…">Save fees</SubmitButton>
          </form>
        </Card>

        <Card title="Conference registration: deadlines, early bird & awards">
          <form id="conference" action={saveConferenceAction} className="space-y-4 scroll-mt-28">
            <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
              <Field label="Registration opens on" hint="Empty = open as soon as it is switched on under Visibility.">
                <input name="opens_at" type="date" defaultValue={s.conference.opensAt} className={small} />
              </Field>
              <Field label="Registration closes on (deadline)">
                <input name="closes_at" type="date" defaultValue={s.conference.closesAt} className={small} />
              </Field>
            </div>
            <EarlyBirdFields prefix="conf" value={s.conference.earlyBird} note="Fee tiers with Early INR / USD prices use them; others get the default %." />
            <PrizeFields prefix="conf" prizes={s.conference.prizes} pool={s.conference.prizePool} poolName="conf_prize_pool" label="Best paper awards" />
            <SubmitButton pendingText="Saving…">Save conference settings</SubmitButton>
          </form>
        </Card>

        <Card title="TechNext stalls">
          <form id="technext" action={saveTechnextAction} className="space-y-4 scroll-mt-28">
            <input type="hidden" name="stall_count" value={stallRows.length} />
            <div className="space-y-2">
              {stallRows.map((st, i) => (
                <div key={i} className="grid gap-2 rounded-xl border border-slate-200 p-3 md:grid-cols-12 md:items-center">
                  <input type="hidden" name={`stall_key_${i}`} defaultValue={st?.key ?? ""} />
                  <input name={`stall_label_${i}`} defaultValue={st?.label ?? ""} placeholder="Stall type" className={`${small} md:col-span-3`} />
                  <input name={`stall_size_${i}`} defaultValue={st?.size ?? ""} placeholder="3m × 3m" className={`${small} md:col-span-2`} />
                  <input name={`stall_desc_${i}`} defaultValue={st?.description ?? ""} placeholder="What's included" className={`${small} md:col-span-3`} />
                  <input name={`stall_price_${i}`} inputMode="numeric" defaultValue={st?.price ?? ""} placeholder="Price (INR)" className={`${small} md:col-span-1`} />
                  <input name={`stall_eprice_${i}`} inputMode="numeric" defaultValue={st?.earlyPrice ?? ""} placeholder="Early ₹" title="Early-bird price (INR)" className={`${small} md:col-span-2`} />
                  {st && (
                    <label className="flex items-center gap-1.5 text-sm text-red-600 md:col-span-1">
                      <input type="checkbox" name={`stall_delete_${i}`} className="accent-red-600" /> Delete
                    </label>
                  )}
                </div>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-3 max-w-3xl">
              <Field label="Bookings open on" hint="Empty = open as soon as booking is switched on.">
                <input name="opens_at" type="date" defaultValue={s.technext.opensAt} className={small} />
              </Field>
              <Field label="Bookings close on (deadline)">
                <input name="closes_at" type="date" defaultValue={s.technext.closesAt} className={small} />
              </Field>
              <Field label="Max representatives per stall">
                <input name="max_reps" type="number" min={1} max={20} defaultValue={s.technext.maxRepresentatives} className={small} />
              </Field>
            </div>
            <EarlyBirdFields prefix="tn" value={s.technext.earlyBird} note="Stall types with an Early ₹ price use it; others get the default %." />
            <PrizeFields prefix="tn" prizes={s.technext.prizes} pool={s.technext.prizePool} poolName="tn_prize_pool" label="TechNext awards & prize pool" />
            <SubmitButton pendingText="Saving…">Save TechNext options</SubmitButton>
          </form>
        </Card>

        <Card title="Payments">
          <form id="payments" action={savePaymentsAction} className="space-y-4 scroll-mt-28">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Provider" hint="Switch to VIT payment API once its credentials are set in the environment.">
                <select name="provider" defaultValue={s.payments.provider} className={inputCls}>
                  <option value="manual">Manual — payment link + admin confirmation</option>
                  <option value="vit">VIT payment API</option>
                </select>
              </Field>
              <div />
              <Field label="Conference payment link" hint="Payers are sent here with ?ref=<payment id>.">
                <input name="conference_link" type="url" defaultValue={s.payments.conferenceLink} placeholder="https://" className={inputCls} />
              </Field>
              <Field label="TechNext payment link">
                <input name="technext_link" type="url" defaultValue={s.payments.technextLink} placeholder="https://" className={inputCls} />
              </Field>
              <Field label="Instructions shown when no link is set" className="md:col-span-2">
                <textarea name="instructions" rows={3} defaultValue={s.payments.instructions} className={inputCls} />
              </Field>
            </div>
            <p className="text-sm text-slate-500">Each event has its own payment link (Events & BOLT → event settings), and any single registration can be given its own link from its admin page.</p>
            <SubmitButton pendingText="Saving…">Save payment settings</SubmitButton>
          </form>
        </Card>

        <Card title="Sponsorship packages">
          <form id="sponsorship" action={saveSponsorshipAction} className="space-y-4 scroll-mt-28">
            <input type="hidden" name="pkg_count" value={pkgRows.length} />
            <p className="text-sm text-slate-500">Shown on the Sponsorship page, in this order. Benefits: one per line. Leave a package name empty to skip that row.</p>
            {pkgRows.map((p, i) => (
              <div key={i} className="space-y-2 rounded-2xl border border-slate-200 p-4">
                <div className="grid gap-2 md:grid-cols-12">
                  <input name={`pkg_name_${i}`} defaultValue={p?.name ?? ""} placeholder="Package name (e.g. Platinum Sponsor)" className={`${small} md:col-span-4`} />
                  <input name={`pkg_price_${i}`} defaultValue={p?.price ?? ""} placeholder="Price (e.g. ₹ 5,00,000)" className={`${small} md:col-span-3`} />
                  <select name={`pkg_style_${i}`} defaultValue={p?.style ?? "silver"} className={`${small} md:col-span-2`}>
                    <option value="platinum">Platinum style</option>
                    <option value="gold">Gold style</option>
                    <option value="silver">Silver style</option>
                    <option value="bronze">Bronze style</option>
                  </select>
                  <label className="flex items-center gap-1.5 text-sm text-slate-600 md:col-span-2">
                    <input type="checkbox" name={`pkg_popular_${i}`} defaultChecked={p?.popular ?? false} className="accent-[#002147]" /> Highlight
                  </label>
                  {p && (
                    <label className="flex items-center gap-1.5 text-sm text-red-600 md:col-span-1">
                      <input type="checkbox" name={`pkg_delete_${i}`} className="accent-red-600" /> Delete
                    </label>
                  )}
                </div>
                <input name={`pkg_badge_${i}`} defaultValue={p?.badge ?? ""} placeholder="Badge line (e.g. Title Sponsor · Maximum Brand Impact)" className={small} />
                <input name={`pkg_tagline_${i}`} defaultValue={p?.tagline ?? ""} placeholder="Tagline" className={small} />
                <textarea name={`pkg_benefits_${i}`} rows={4} defaultValue={p?.benefits.join("\n") ?? ""} placeholder="Benefits, one per line" className={small} />
              </div>
            ))}
            <SubmitButton pendingText="Saving…">Save sponsorship packages</SubmitButton>
          </form>
        </Card>

        <Card
          title="Invoice template"
          actions={
            <a href="/api/admin/invoices/preview" target="_blank" className="text-sm font-semibold text-[#004B87] hover:underline">
              Preview sample invoice →
            </a>
          }
        >
          <form id="invoice" action={saveInvoiceTemplateAction} className="grid gap-4 scroll-mt-28 md:grid-cols-2">
            <Field label="Invoice number prefix" hint="Numbers look like PREFIX/2027-28/00001 — unique and sequential.">
              <input name="prefix" defaultValue={s.invoice.prefix} required className={inputCls} />
            </Field>
            <Field label="Document title">
              <input name="title" defaultValue={s.invoice.title} className={inputCls} />
            </Field>
            <Field label="Issued by (organisation)">
              <input name="orgName" defaultValue={s.invoice.orgName} className={inputCls} />
            </Field>
            <Field label="Contact email / phone">
              <div className="flex gap-2">
                <input name="email" defaultValue={s.invoice.email} placeholder="Email" className={inputCls} />
                <input name="phone" defaultValue={s.invoice.phone} placeholder="Phone" className={inputCls} />
              </div>
            </Field>
            <Field label="Address" className="md:col-span-2">
              <textarea name="orgAddress" rows={2} defaultValue={s.invoice.orgAddress} className={inputCls} />
            </Field>
            <Field label="GSTIN">
              <input name="gstin" defaultValue={s.invoice.gstin} maxLength={15} className={`${inputCls} uppercase`} />
            </Field>
            <Field label="PAN">
              <input name="pan" defaultValue={s.invoice.pan} maxLength={10} className={`${inputCls} uppercase`} />
            </Field>
            <Field label="GST % included in fees" hint="0 hides the GST line; otherwise the invoice shows the taxable value and GST included in the total.">
              <input name="gstPercent" type="number" min={0} max={50} step="0.01" defaultValue={s.invoice.gstPercent} className={inputCls} />
            </Field>
            <Field label="Signatory">
              <input name="signatory" defaultValue={s.invoice.signatory} className={inputCls} />
            </Field>
            <Field label="Footer note" className="md:col-span-2">
              <textarea name="notes" rows={2} defaultValue={s.invoice.notes} className={inputCls} />
            </Field>
            <div className="md:col-span-2">
              <SubmitButton pendingText="Saving…">Save invoice template</SubmitButton>
            </div>
          </form>
        </Card>
      </div>
    </PortalPage>
  );
}
