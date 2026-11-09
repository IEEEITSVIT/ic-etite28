import { getSettings } from "@/lib/settings";
import { saveDatesAction, saveFeesAction, savePaymentsAction, saveTechnextAction, saveVisibilityAction } from "@/app/actions/admin-settings";
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
            <p className="text-sm text-slate-500">Shown on the Registration page and used to calculate the amount payable when delegates register. Leave an amount blank if the category does not apply.</p>
            <div className="space-y-2">
              <div className="hidden gap-2 px-3 text-xs font-bold uppercase tracking-wide text-slate-500 md:grid md:grid-cols-12">
                <span className="md:col-span-6">Category</span>
                <span className="md:col-span-2">Indian (INR)</span>
                <span className="md:col-span-2">Foreign (USD)</span>
                <span className="md:col-span-2" />
              </div>
              {feeRows.map((f, i) => (
                <div key={i} className="grid gap-2 rounded-xl border border-slate-200 p-3 md:grid-cols-12 md:items-center">
                  <input type="hidden" name={`fee_key_${i}`} defaultValue={f?.key ?? ""} />
                  <input name={`fee_category_${i}`} defaultValue={f?.category ?? ""} placeholder="Category" className={`${small} md:col-span-6`} />
                  <input name={`fee_inr_${i}`} inputMode="numeric" defaultValue={f?.inr ?? ""} placeholder="15000" className={`${small} md:col-span-2`} />
                  <input name={`fee_usd_${i}`} inputMode="numeric" defaultValue={f?.usd ?? ""} placeholder="400" className={`${small} md:col-span-2`} />
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

        <Card title="TechNext stalls">
          <form id="technext" action={saveTechnextAction} className="space-y-4 scroll-mt-28">
            <input type="hidden" name="stall_count" value={stallRows.length} />
            <div className="space-y-2">
              {stallRows.map((st, i) => (
                <div key={i} className="grid gap-2 rounded-xl border border-slate-200 p-3 md:grid-cols-12 md:items-center">
                  <input type="hidden" name={`stall_key_${i}`} defaultValue={st?.key ?? ""} />
                  <input name={`stall_label_${i}`} defaultValue={st?.label ?? ""} placeholder="Stall type" className={`${small} md:col-span-3`} />
                  <input name={`stall_size_${i}`} defaultValue={st?.size ?? ""} placeholder="3m × 3m" className={`${small} md:col-span-2`} />
                  <input name={`stall_desc_${i}`} defaultValue={st?.description ?? ""} placeholder="What's included" className={`${small} md:col-span-4`} />
                  <input name={`stall_price_${i}`} inputMode="numeric" defaultValue={st?.price ?? ""} placeholder="Price (INR)" className={`${small} md:col-span-2`} />
                  {st && (
                    <label className="flex items-center gap-1.5 text-sm text-red-600 md:col-span-1">
                      <input type="checkbox" name={`stall_delete_${i}`} className="accent-red-600" /> Delete
                    </label>
                  )}
                </div>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 max-w-xl">
              <Field label="Bookings close on">
                <input name="closes_at" type="date" defaultValue={s.technext.closesAt} className={small} />
              </Field>
              <Field label="Max representatives per stall">
                <input name="max_reps" type="number" min={1} max={20} defaultValue={s.technext.maxRepresentatives} className={small} />
              </Field>
            </div>
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
      </div>
    </PortalPage>
  );
}
