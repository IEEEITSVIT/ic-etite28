import type { EarlyBird, Prize } from "@/lib/pricing";
import { isEarlyBird } from "@/lib/pricing";
import { Badge, Field, inputCls } from "@/components/portal/ui";

const small = `${inputCls} !py-2 !text-sm`;

// Early-bird deadline + fallback percentage, posted as <prefix>_eb_ends / <prefix>_eb_percent.
export function EarlyBirdFields({ prefix, value, note }: { prefix: string; value: EarlyBird; note?: string }) {
  return (
    <fieldset className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4">
      <legend className="flex items-center gap-2 px-2 text-sm font-bold text-emerald-900">
        Early bird {isEarlyBird(value) ? <Badge tone="green">active now</Badge> : value.endsAt ? <Badge>ended</Badge> : <Badge>off</Badge>}
      </legend>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Early-bird ends on (inclusive, IST)" hint="Leave empty to switch early bird off.">
          <input name={`${prefix}_eb_ends`} type="date" defaultValue={value.endsAt.slice(0, 10)} className={small} />
        </Field>
        <Field label="Default discount %" hint="Used for any item without its own early price.">
          <input name={`${prefix}_eb_percent`} type="number" min={0} max={90} step="0.5" defaultValue={value.percent || ""} placeholder="e.g. 20" className={small} />
        </Field>
      </div>
      {note && <p className="mt-2 text-xs text-emerald-900/80">{note}</p>}
    </fieldset>
  );
}

// Repeating prize rows posted as <prefix>_prize_<field>_<i> with <prefix>_prize_count.
export function PrizeFields({ prefix, prizes, pool, poolName, label = "Prizes" }: { prefix: string; prizes: Prize[]; pool: string; poolName: string; label?: string }) {
  const rows = [...prizes, ...Array.from({ length: 3 }, () => null)];
  return (
    <fieldset className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
      <legend className="px-2 text-sm font-bold text-amber-900">{label}</legend>
      <input type="hidden" name={`${prefix}_prize_count`} value={rows.length} />
      <Field label="Prize pool headline" hint="Shown prominently, e.g. ₹4,00,000+. Leave empty to show the total of the amounts below.">
        <input name={poolName} defaultValue={pool} placeholder="₹4,00,000+" className={`${small} max-w-xs`} />
      </Field>
      <div className="space-y-2">
        {rows.map((p, i) => (
          <div key={i} className="grid gap-2 md:grid-cols-12 md:items-center">
            <input name={`${prefix}_prize_title_${i}`} defaultValue={p?.title ?? ""} placeholder="Prize (e.g. Winner)" className={`${small} md:col-span-3`} />
            <input name={`${prefix}_prize_amount_${i}`} inputMode="numeric" defaultValue={p?.amount ?? ""} placeholder="Amount ₹" className={`${small} md:col-span-2`} />
            <input name={`${prefix}_prize_desc_${i}`} defaultValue={p?.description ?? ""} placeholder="Details (trophy, internship…)" className={`${small} md:col-span-6`} />
            {p && (
              <label className="flex items-center gap-1.5 text-sm text-red-600 md:col-span-1">
                <input type="checkbox" name={`${prefix}_prize_delete_${i}`} className="accent-red-600" /> Delete
              </label>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
}
