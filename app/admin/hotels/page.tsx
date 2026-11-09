import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getSettings } from "@/lib/settings";
import type { Hotel } from "@/data/hotels";
import { deleteHotelAction, saveHotelAction, saveHotelsPageAction } from "@/app/actions/admin-settings";
import SubmitButton from "@/components/portal/SubmitButton";
import { Badge, Card, Field, Flash, PortalPage, btnDanger, inputCls } from "@/components/portal/ui";

const small = `${inputCls} !py-2 !text-sm`;

function HotelForm({ h }: { h?: Hotel }) {
  return (
    <form action={saveHotelAction} className="grid gap-3 md:grid-cols-4">
      <input type="hidden" name="original_id" value={h?.id ?? ""} />
      <Field label="Name" className="md:col-span-2">
        <input name="name" required defaultValue={h?.name ?? ""} className={small} />
      </Field>
      <Field label="Category">
        <select name="category" defaultValue={h?.category ?? "city"} className={small}>
          <option value="closest">Closest to VIT</option>
          <option value="luxury">Luxury & star rating</option>
          <option value="city">City centre & heritage</option>
          <option value="transit">Green Circle & transit hubs</option>
        </select>
      </Field>
      <Field label="Badge (optional)">
        <input name="badge" defaultValue={h?.badge ?? ""} placeholder="e.g. Conference rate" className={small} />
      </Field>
      <Field label="Address" className="md:col-span-2">
        <input name="address" defaultValue={h?.address ?? ""} className={small} />
      </Field>
      <Field label="Area">
        <input name="area" defaultValue={h?.area ?? ""} className={small} />
      </Field>
      <Field label="Distance (km)">
        <input name="distanceKm" type="number" step="0.1" min={0} defaultValue={h?.distanceKm ?? ""} className={small} />
      </Field>
      <Field label="Distance description" className="md:col-span-2">
        <input name="distanceFromVit" defaultValue={h?.distanceFromVit ?? ""} placeholder="e.g. 2 km from VIT Main Gate" className={small} />
      </Field>
      <Field label="Rating (0–5)">
        <input name="rating" type="number" step="0.1" min={0} max={5} defaultValue={h?.rating ?? ""} className={small} />
      </Field>
      <Field label="Reviews">
        <input name="reviewCount" type="number" min={0} defaultValue={h?.reviewCount ?? ""} className={small} />
      </Field>
      <Field label="Phone">
        <input name="phone" defaultValue={h?.phone ?? ""} className={small} />
      </Field>
      <Field label="Alt. phone">
        <input name="phoneAlt" defaultValue={h?.phoneAlt ?? ""} className={small} />
      </Field>
      <Field label="Price band">
        <select name="priceRange" defaultValue={h?.priceRange ?? "₹₹"} className={small}>
          <option>₹</option>
          <option>₹₹</option>
          <option>₹₹₹</option>
        </select>
      </Field>
      <Field label="Approx. tariff">
        <input name="estPrice" defaultValue={h?.estPrice ?? ""} placeholder="₹2,500 – ₹4,000 / night" className={small} />
      </Field>
      <Field label="Booking link" className="md:col-span-2">
        <input name="bookingUrl" type="url" defaultValue={h?.bookingUrl && h.bookingUrl !== "#" ? h.bookingUrl : ""} placeholder="https://" className={small} />
      </Field>
      <Field label="Link type">
        <select name="bookingType" defaultValue={h?.bookingType ?? "Official website"} className={small}>
          <option>Official website</option>
          <option>Official booking</option>
          <option>Booking.com</option>
          <option>Find booking options</option>
        </select>
      </Field>
      <label className="flex items-center gap-2 pt-7 text-sm font-semibold text-slate-700">
        <input type="checkbox" name="verifiedByVit" defaultChecked={h?.verifiedByVit ?? false} className="accent-brand-primary" /> Verified by VIT
      </label>
      <Field label="Amenities (comma-separated)" className="md:col-span-4">
        <input name="amenities" defaultValue={h?.amenities.join(", ") ?? ""} placeholder="Free Wi-Fi, Breakfast, Parking, AC" className={small} />
      </Field>
      <div className="md:col-span-4">
        <SubmitButton pendingText="Saving…">{h ? "Save hotel" : "Add hotel"}</SubmitButton>
      </div>
    </form>
  );
}

export default async function AdminHotelsPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { ok, error } = await searchParams;
  const { hotels } = await getSettings();
  return (
    <PortalPage
      title="Hotels & accommodation"
      subtitle={`${hotels.items.length} hotels · shown on the public Hotels page when published`}
      width="max-w-6xl"
      actions={
        <Link href="/hotels" target="_blank" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-secondary hover:underline">
          View Hotels page <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      }
    >
      <Flash ok={ok} error={error} />
      <div className="space-y-6">
        <Card title="Page">
          <form action={saveHotelsPageAction} className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input type="checkbox" name="published" defaultChecked={hotels.published} className="h-4 w-4 accent-brand-primary" /> Publish the hotel directory (otherwise the page shows &quot;will be updated soon&quot;)
            </label>
            <Field label="Introduction">
              <textarea name="intro" rows={2} defaultValue={hotels.intro} className={inputCls} />
            </Field>
            <SubmitButton pendingText="Saving…">Save</SubmitButton>
          </form>
        </Card>
        <Card title="Add a hotel">
          <HotelForm />
        </Card>
        <Card title="Hotels">
          <div className="space-y-2">
            {hotels.items.map((h) => (
              <details key={h.id} id={`h-${h.id}`} className="scroll-mt-28 rounded-xl border border-slate-200">
                <summary className="flex cursor-pointer flex-wrap items-center gap-2 px-4 py-3">
                  <span className="font-bold text-brand-primary">{h.name}</span>
                  <Badge>{h.categoryLabel}</Badge>
                  {h.verifiedByVit && <Badge tone="green">VIT verified</Badge>}
                  <span className="text-xs text-slate-500">{h.distanceFromVit}</span>
                </summary>
                <div className="space-y-3 border-t border-slate-100 p-4">
                  <HotelForm h={h} />
                  <form action={deleteHotelAction}>
                    <input type="hidden" name="id" value={h.id} />
                    <SubmitButton className={btnDanger} confirm={`Remove ${h.name}?`}>
                      Remove hotel
                    </SubmitButton>
                  </form>
                </div>
              </details>
            ))}
          </div>
        </Card>
      </div>
    </PortalPage>
  );
}
