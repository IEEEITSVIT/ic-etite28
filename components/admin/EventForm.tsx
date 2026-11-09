import { saveEventAction } from "@/app/actions/admin-events";
import SubmitButton from "@/components/portal/SubmitButton";
import { Field, inputCls } from "@/components/portal/ui";
import { isoToIstInput } from "@/lib/portal/actions";
import { submissionFields, type EventRow } from "@/lib/portal/events";

const DEFAULT_FIELDS = [
  { key: "github", label: "GitHub repository", required: true },
  { key: "demo_video", label: "Demo video (YouTube / Drive)", required: false },
  { key: "presentation", label: "Presentation (PPT / PDF link)", required: false },
  { key: "live_demo", label: "Live demo / Figma", required: false },
];

export default function EventForm({ event }: { event?: EventRow }) {
  const fields = event ? submissionFields(event) : DEFAULT_FIELDS;
  const rows = [...fields, ...Array.from({ length: Math.max(0, 6 - fields.length) }, () => null)].slice(0, 6);
  return (
    <form action={saveEventAction} className="space-y-6">
      {event && <input type="hidden" name="id" value={event.id} />}
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title">
          <input name="title" required defaultValue={event?.title ?? ""} placeholder="BOLT 3.0 Hackathon" className={inputCls} />
        </Field>
        <Field label="URL slug" hint="The event page lives at /events/<slug>.">
          <input name="slug" defaultValue={event?.slug ?? ""} placeholder="bolt-3" className={inputCls} />
        </Field>
        <Field label="Tagline" className="md:col-span-2">
          <input name="tagline" defaultValue={event?.tagline ?? ""} placeholder="Breakthrough On Locked Technology — national 24-hour hackathon" className={inputCls} />
        </Field>
        <Field label="Description" className="md:col-span-2" hint="Plain text; line breaks are kept.">
          <textarea name="description" rows={6} defaultValue={event?.description ?? ""} className={inputCls} />
        </Field>
        <Field label="Venue">
          <input name="venue" defaultValue={event?.venue ?? ""} placeholder="Anna Auditorium, VIT Vellore" className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Starts (IST)">
            <input name="starts_at" type="datetime-local" defaultValue={isoToIstInput(event?.starts_at)} className={inputCls} />
          </Field>
          <Field label="Ends (IST)">
            <input name="ends_at" type="datetime-local" defaultValue={isoToIstInput(event?.ends_at)} className={inputCls} />
          </Field>
        </div>
      </div>

      <fieldset className="grid gap-4 rounded-2xl border border-slate-200 p-4 md:grid-cols-3">
        <legend className="px-2 text-sm font-bold text-[#002147]">Access & registration</legend>
        <Field label="Visibility" hint="Hidden: admins only. Unlisted: anyone with the link.">
          <select name="visibility" defaultValue={event?.visibility ?? "hidden"} className={inputCls}>
            <option value="hidden">Hidden</option>
            <option value="unlisted">Unlisted (link only)</option>
            <option value="public">Public</option>
          </select>
        </Field>
        <Field label="Who can register">
          <select name="registration_mode" defaultValue={event?.registration_mode ?? "open"} className={inputCls}>
            <option value="open">Anyone with an account</option>
            <option value="allowlist">Only invited emails</option>
          </select>
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={event?.status ?? "active"} className={inputCls}>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </Field>
        <Field label="Registration opens (IST)">
          <input name="reg_opens_at" type="datetime-local" defaultValue={isoToIstInput(event?.reg_opens_at)} className={inputCls} />
        </Field>
        <Field label="Registration closes (IST)" hint="Teams lock when registration closes.">
          <input name="reg_closes_at" type="datetime-local" defaultValue={isoToIstInput(event?.reg_closes_at)} className={inputCls} />
        </Field>
        <div />
        <Field label="Participation">
          <select name="participation" defaultValue={event?.participation ?? "team"} className={inputCls}>
            <option value="team">Teams</option>
            <option value="solo">Individual (solo)</option>
          </select>
        </Field>
        <Field label="Min team size">
          <input name="min_team_size" type="number" min={1} max={20} defaultValue={event?.min_team_size ?? 2} className={inputCls} />
        </Field>
        <Field label="Max team size">
          <input name="max_team_size" type="number" min={1} max={20} defaultValue={event?.max_team_size ?? 4} className={inputCls} />
        </Field>
      </fieldset>

      <fieldset className="space-y-3 rounded-2xl border border-slate-200 p-4">
        <legend className="px-2 text-sm font-bold text-[#002147]">Submission links (up to 6)</legend>
        <p className="text-sm text-slate-500">Teams submit these links for every round. Leave a label empty to remove the field.</p>
        {rows.map((f, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-12 sm:items-center">
            <input type="hidden" name={`field_key_${i}`} defaultValue={f?.key ?? ""} />
            <input name={`field_label_${i}`} defaultValue={f?.label ?? ""} placeholder={`Link ${i + 1} label`} className={`${inputCls} sm:col-span-9`} />
            <label className="flex items-center gap-2 text-sm text-slate-600 sm:col-span-3">
              <input type="checkbox" name={`field_required_${i}`} defaultChecked={f?.required ?? false} className="accent-[#002147]" /> Required
            </label>
          </div>
        ))}
      </fieldset>

      <fieldset className="grid gap-4 rounded-2xl border border-slate-200 p-4 md:grid-cols-4">
        <legend className="px-2 text-sm font-bold text-[#002147]">Fee, payment & results</legend>
        <Field label="Fee (0 = free)">
          <input name="fee_amount" type="number" min={0} defaultValue={event?.fee_amount ?? 0} className={inputCls} />
        </Field>
        <Field label="Currency">
          <select name="fee_currency" defaultValue={event?.fee_currency ?? "INR"} className={inputCls}>
            <option>INR</option>
            <option>USD</option>
          </select>
        </Field>
        <Field label="Charged">
          <select name="fee_scope" defaultValue={event?.fee_scope ?? "per_team"} className={inputCls}>
            <option value="per_team">Per team (lead pays)</option>
            <option value="per_member">Per member</option>
          </select>
        </Field>
        <Field label="Winners to announce">
          <input name="winners_count" type="number" min={1} max={20} defaultValue={event?.winners_count ?? 3} className={inputCls} />
        </Field>
        <Field label="Payment link / API URL" className="md:col-span-4" hint="Participants are sent here with ?ref=<payment id>. Leave empty to use the global payment settings.">
          <input name="payment_link" type="url" defaultValue={event?.payment_link ?? ""} placeholder="https://" className={inputCls} />
        </Field>
      </fieldset>

      <SubmitButton pendingText="Saving…">{event ? "Save event" : "Create event"}</SubmitButton>
    </form>
  );
}
