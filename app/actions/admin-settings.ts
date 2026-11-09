"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { DEFAULT_SETTINGS, THEME_COLORS, getSettings, saveSetting, type DateItem, type EarlyBird, type FeeTier, type Prize, type StallType, type ThemeColorKey } from "@/lib/settings";
import { FONT_OPTIONS, type FontKey } from "@/lib/fonts";
import { bool, guarded, num, str } from "@/lib/portal/actions";
import { PortalError } from "@/lib/portal/events";
import { slugify } from "@/lib/portal/ids";
import type { Hotel } from "@/data/hotels";
import type { SponsorPackage, SponsorStyle } from "@/data/sponsorship";
import { NOTIFICATION_KEYS, saveNotificationTemplates, type NotificationKey, type NotificationTemplate } from "@/lib/notifications";

const BACK = "/admin/settings";

// Repeating rows are posted as `<prefix>_<field>_<index>` with a `<prefix>_count`.
function rows(fd: FormData, prefix: string) {
  const count = Math.min(num(fd, `${prefix}_count`), 100);
  const out: { get: (f: string, max?: number) => string; on: (f: string) => boolean }[] = [];
  for (let i = 0; i < count; i++) {
    if (bool(fd, `${prefix}_delete_${i}`)) continue;
    out.push({ get: (f, max = 300) => str(fd, `${prefix}_${f}_${i}`, max), on: (f) => bool(fd, `${prefix}_${f}_${i}`) });
  }
  return out;
}

const money = (v: string) => {
  if (!v.trim()) return null;
  const n = Number(v.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(n) || n < 0) throw new PortalError(`"${v}" is not a valid amount.`);
  return Math.round(n);
};

const dateOnly = (fd: FormData, key: string, label: string) => {
  const v = str(fd, key, 10);
  if (v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new PortalError(`${label} must be a date.`);
  return v;
};

function earlyBird(fd: FormData, prefix: string): EarlyBird {
  const percent = num(fd, `${prefix}_eb_percent`, 0);
  if (percent < 0 || percent > 90) throw new PortalError("Early-bird discount must be between 0% and 90%.");
  return { endsAt: dateOnly(fd, `${prefix}_eb_ends`, "Early-bird deadline"), percent: Math.round(percent * 100) / 100 };
}

function prizes(fd: FormData, prefix: string): Prize[] {
  return rows(fd, `${prefix}_prize`)
    .filter((r) => r.get("title"))
    .map((r) => ({ title: r.get("title", 100), amount: money(r.get("amount", 20)), description: r.get("desc", 300) }));
}

// Public pages read settings through a cached getter; refresh the pages that show them.
function refreshPublic() {
  for (const p of ["/", "/important-dates", "/registration", "/call-for-papers", "/hackathon", "/technext"]) revalidatePath(p);
  revalidatePath("/", "layout");
}

export async function saveDatesAction(fd: FormData) {
  const admin = await requireAdmin(BACK);
  await guarded(BACK + "#dates", async () => {
    const dates: DateItem[] = rows(fd, "date")
      .filter((r) => r.get("title") && r.get("iso"))
      .map((r) => {
        const iso = r.get("iso", 10);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) throw new PortalError(`Invalid date for "${r.get("title")}".`);
        return {
          id: r.get("id", 60) || slugify(r.get("title")),
          title: r.get("title", 120),
          shortTitle: r.get("short", 60) || r.get("title", 60),
          date: r.get("label", 60),
          shortDate: r.get("shortlabel", 30) || r.get("label", 30),
          isoDate: iso,
          description: r.get("desc", 400),
          isKeyMilestone: r.on("key"),
        };
      })
      .sort((a, b) => a.isoDate.localeCompare(b.isoDate));
    if (dates.length === 0) throw new PortalError("Add at least one date.");
    for (const d of dates) if (!d.date) throw new PortalError(`Enter a display label for "${d.title}".`);
    await saveSetting("dates", dates, admin.id);
    const start = str(fd, "conference_start", 30);
    if (start) await saveSetting("conferenceStart", `${start.length === 16 ? `${start}:00` : start}+05:30`, admin.id);
    refreshPublic();
    return "Important dates updated on the website.";
  });
}

export async function saveFeesAction(fd: FormData) {
  const admin = await requireAdmin(BACK);
  await guarded(BACK + "#fees", async () => {
    const fees: FeeTier[] = rows(fd, "fee")
      .filter((r) => r.get("category"))
      .map((r) => ({
        key: r.get("key", 60) || slugify(r.get("category")),
        category: r.get("category", 120),
        inr: money(r.get("inr", 20)),
        usd: money(r.get("usd", 20)),
        earlyInr: money(r.get("einr", 20)),
        earlyUsd: money(r.get("eusd", 20)),
        isIeeeDiscount: r.on("ieee"),
      }));
    if (fees.length === 0) throw new PortalError("Add at least one fee category.");
    const keys = new Set<string>();
    for (const f of fees) {
      if (keys.has(f.key)) f.key = `${f.key}-${keys.size}`;
      keys.add(f.key);
    }
    await saveSetting("fees", fees, admin.id);
    refreshPublic();
    return "Registration fees updated. New conference registrations use these amounts.";
  });
}

export async function saveVisibilityAction(fd: FormData) {
  const admin = await requireAdmin(BACK);
  await guarded(BACK + "#visibility", async () => {
    await saveSetting(
      "visibility",
      {
        bolt: bool(fd, "bolt"),
        technext: bool(fd, "technext"),
        conferenceRegistration: bool(fd, "conferenceRegistration"),
        technextRegistration: bool(fd, "technextRegistration"),
      },
      admin.id
    );
    const slug = slugify(str(fd, "bolt_slug", 60));
    if (slug) await saveSetting("bolt", { eventSlug: slug }, admin.id);
    refreshPublic();
    return "Visibility saved.";
  });
}

export async function saveTechnextAction(fd: FormData) {
  const admin = await requireAdmin(BACK);
  await guarded(BACK + "#technext", async () => {
    const stallTypes: StallType[] = rows(fd, "stall")
      .filter((r) => r.get("label"))
      .map((r) => ({
        key: r.get("key", 40) || slugify(r.get("label")),
        label: r.get("label", 80),
        size: r.get("size", 40),
        description: r.get("desc", 200),
        price: money(r.get("price", 20)) ?? 0,
        earlyPrice: money(r.get("eprice", 20)),
      }));
    if (stallTypes.length === 0) throw new PortalError("Add at least one stall type.");
    const current = (await getSettings()).technext;
    await saveSetting(
      "technext",
      {
        stallTypes,
        opensAt: dateOnly(fd, "opens_at", "Opening date"),
        closesAt: dateOnly(fd, "closes_at", "Closing date"),
        maxRepresentatives: Math.max(1, Math.min(20, num(fd, "max_reps", current.maxRepresentatives))),
        earlyBird: earlyBird(fd, "tn"),
        prizePool: str(fd, "tn_prize_pool", 60),
        prizes: prizes(fd, "tn"),
      },
      admin.id
    );
    refreshPublic();
    return "TechNext stall options saved.";
  });
}

export async function savePaymentsAction(fd: FormData) {
  const admin = await requireAdmin(BACK);
  await guarded(BACK + "#payments", async () => {
    const provider = str(fd, "provider", 10) === "vit" ? "vit" : "manual";
    const link = (k: string) => {
      const v = str(fd, k, 500);
      if (v && !/^https?:\/\//i.test(v)) throw new PortalError("Payment links must start with http:// or https://");
      return v;
    };
    await saveSetting(
      "payments",
      { provider, conferenceLink: link("conference_link"), technextLink: link("technext_link"), instructions: str(fd, "instructions", 1000) },
      admin.id
    );
    return "Payment settings saved.";
  });
}

export async function saveConferenceAction(fd: FormData) {
  const admin = await requireAdmin(BACK);
  await guarded(BACK + "#conference", async () => {
    const opensAt = dateOnly(fd, "opens_at", "Opening date");
    const closesAt = dateOnly(fd, "closes_at", "Closing date");
    if (opensAt && closesAt && opensAt > closesAt) throw new PortalError("Registration must open before it closes.");
    await saveSetting(
      "conference",
      { opensAt, closesAt, earlyBird: earlyBird(fd, "conf"), prizePool: str(fd, "conf_prize_pool", 60), prizes: prizes(fd, "conf") },
      admin.id
    );
    refreshPublic();
    return "Conference registration window, early bird and awards saved.";
  });
}

export async function saveInvoiceTemplateAction(fd: FormData) {
  const admin = await requireAdmin(BACK);
  await guarded(BACK + "#invoice", async () => {
    const prefix = str(fd, "prefix", 20).replace(/[^\w-]/g, "");
    if (!prefix) throw new PortalError("Invoice prefix is required (letters, numbers, dashes).");
    const gst = num(fd, "gstPercent", 0);
    if (gst < 0 || gst > 50) throw new PortalError("GST % must be between 0 and 50.");
    await saveSetting(
      "invoice",
      {
        prefix,
        title: str(fd, "title", 60) || "Invoice",
        orgName: str(fd, "orgName", 150),
        orgAddress: str(fd, "orgAddress", 400),
        gstin: str(fd, "gstin", 15).toUpperCase(),
        pan: str(fd, "pan", 10).toUpperCase(),
        email: str(fd, "email", 120),
        phone: str(fd, "phone", 40),
        gstPercent: gst,
        notes: str(fd, "notes", 800),
        signatory: str(fd, "signatory", 100),
      },
      admin.id
    );
    return "Invoice template saved. New invoices and downloads use it.";
  });
}

const STYLES: SponsorStyle[] = ["platinum", "gold", "silver", "bronze"];

export async function saveSponsorshipAction(fd: FormData) {
  const admin = await requireAdmin(BACK);
  await guarded(BACK + "#sponsorship", async () => {
    const packages: SponsorPackage[] = rows(fd, "pkg")
      .filter((r) => r.get("name"))
      .map((r) => ({
        name: r.get("name", 80),
        price: r.get("price", 40),
        badge: r.get("badge", 100),
        tagline: r.get("tagline", 300),
        style: (STYLES.includes(r.get("style", 10) as SponsorStyle) ? r.get("style", 10) : "silver") as SponsorStyle,
        popular: r.on("popular"),
        benefits: r
          .get("benefits", 5000)
          .split("\n")
          .map((b) => b.trim())
          .filter(Boolean),
      }));
    if (packages.length === 0) throw new PortalError("Add at least one sponsorship package.");
    await saveSetting("sponsorship", { packages }, admin.id);
    revalidatePath("/sponsorship");
    return "Sponsorship packages updated.";
  });
}

// ─── Hotels (/admin/hotels) ───────────────────────────────────────────

const HOTELS = "/admin/hotels";
const CATEGORY_LABELS: Record<Hotel["category"], string> = {
  closest: "Closest to VIT",
  luxury: "Luxury & Star Rating",
  city: "City Center & Heritage",
  transit: "Green Circle & Transit Hubs",
};
const BOOKING_TYPES: Hotel["bookingType"][] = ["Official website", "Official booking", "Booking.com", "Find booking options"];

export async function saveHotelsPageAction(fd: FormData) {
  const admin = await requireAdmin(HOTELS);
  await guarded(HOTELS, async () => {
    const current = (await getSettings()).hotels;
    await saveSetting("hotels", { ...current, published: bool(fd, "published"), intro: str(fd, "intro", 800) }, admin.id);
    revalidatePath("/hotels");
    return bool(fd, "published") ? "Hotels page is live." : "Hotels page shows the 'coming soon' notice.";
  });
}

export async function saveHotelAction(fd: FormData) {
  const admin = await requireAdmin(HOTELS);
  const originalId = str(fd, "original_id", 80);
  await guarded(`${HOTELS}${originalId ? `#h-${originalId}` : ""}`, async () => {
    const name = str(fd, "name", 120);
    if (!name) throw new PortalError("Hotel name is required.");
    const category = (Object.keys(CATEGORY_LABELS).includes(str(fd, "category", 20)) ? str(fd, "category", 20) : "city") as Hotel["category"];
    const bookingUrl = str(fd, "bookingUrl", 500);
    if (bookingUrl && !/^https?:\/\//i.test(bookingUrl)) throw new PortalError("Booking link must start with http:// or https://");
    const rating = Math.min(5, Math.max(0, num(fd, "rating", 0)));
    const hotel: Hotel = {
      id: originalId || slugify(name) || `hotel-${Date.now()}`,
      name,
      category,
      categoryLabel: CATEGORY_LABELS[category],
      address: str(fd, "address", 300),
      area: str(fd, "area", 100),
      distanceFromVit: str(fd, "distanceFromVit", 120),
      distanceKm: Math.max(0, num(fd, "distanceKm", 0)),
      rating,
      ratingText: str(fd, "ratingText", 30) || (rating >= 4.5 ? "Excellent" : rating >= 4 ? "Very Good" : rating >= 3.5 ? "Good" : "Rated"),
      reviewCount: Math.max(0, Math.round(num(fd, "reviewCount", 0))),
      phone: str(fd, "phone", 40),
      phoneAlt: str(fd, "phoneAlt", 40) || undefined,
      bookingUrl: bookingUrl || "#",
      bookingType: (BOOKING_TYPES.includes(str(fd, "bookingType", 30) as Hotel["bookingType"]) ? str(fd, "bookingType", 30) : "Official website") as Hotel["bookingType"],
      verifiedByVit: bool(fd, "verifiedByVit"),
      priceRange: (["₹", "₹₹", "₹₹₹"].includes(str(fd, "priceRange", 5)) ? str(fd, "priceRange", 5) : "₹₹") as Hotel["priceRange"],
      estPrice: str(fd, "estPrice", 60),
      amenities: str(fd, "amenities", 500).split(",").map((a) => a.trim()).filter(Boolean),
      badge: str(fd, "badge", 40) || undefined,
    };
    const current = (await getSettings()).hotels;
    const items = [...current.items];
    const idx = items.findIndex((h) => h.id === originalId);
    if (idx >= 0) items[idx] = hotel;
    else {
      if (items.some((h) => h.id === hotel.id)) hotel.id = `${hotel.id}-${items.length + 1}`;
      items.push(hotel);
    }
    await saveSetting("hotels", { ...current, items }, admin.id);
    revalidatePath("/hotels");
    return idx >= 0 ? `${name} updated.` : `${name} added.`;
  });
}

export async function deleteHotelAction(fd: FormData) {
  const admin = await requireAdmin(HOTELS);
  await guarded(HOTELS, async () => {
    const id = str(fd, "id", 80);
    const current = (await getSettings()).hotels;
    await saveSetting("hotels", { ...current, items: current.items.filter((h) => h.id !== id) }, admin.id);
    revalidatePath("/hotels");
    return "Hotel removed.";
  });
}

// ─── Automatic notices (/admin/email) ─────────────────────────────────

export async function saveNotificationsAction(fd: FormData) {
  const admin = await requireAdmin("/admin/email");
  await guarded("/admin/email#notices", async () => {
    const value = {} as Record<NotificationKey, NotificationTemplate>;
    for (const k of NOTIFICATION_KEYS) {
      const subject = str(fd, `${k}_subject`, 200);
      const body = str(fd, `${k}_body`, 5000);
      if (!subject || !body) throw new PortalError("Every notice needs a subject and a message.");
      value[k] = { enabled: bool(fd, `${k}_enabled`), subject, body };
    }
    await saveNotificationTemplates(value, admin.id);
    return "Automatic notices saved.";
  });
}

export async function saveTickerAction(fd: FormData) {
  const admin = await requireAdmin(BACK);
  await guarded(BACK + "#ticker", async () => {
    const items = rows(fd, "tick")
      .filter((r) => r.get("text"))
      .map((r) => {
        const url = r.get("url", 300);
        if (url && !/^(https?:\/\/|\/)/i.test(url)) throw new PortalError(`Link "${url}" must start with / (a page on this site) or https://`);
        return { text: r.get("text", 200), url, isNew: r.on("new") };
      });
    const speed = str(fd, "speed", 10);
    await saveSetting(
      "ticker",
      {
        enabled: bool(fd, "enabled"),
        label: str(fd, "label", 40),
        speed: speed === "slow" || speed === "fast" ? speed : "normal",
        dismissible: bool(fd, "dismissible"),
        items,
      },
      admin.id
    );
    refreshPublic();
    return bool(fd, "enabled") && items.length ? "Scrolling announcement bar updated." : "Announcement bar hidden.";
  });
}

export async function saveAppearanceAction(fd: FormData) {
  const admin = await requireAdmin(BACK);
  await guarded(BACK + "#appearance", async () => {
    if (str(fd, "reset", 2) === "1") {
      await saveSetting("appearance", DEFAULT_SETTINGS.appearance, admin.id);
      revalidatePath("/", "layout");
      return "Appearance reset to the original theme.";
    }
    const colors = {} as Record<ThemeColorKey, string>;
    for (const key of Object.keys(THEME_COLORS) as ThemeColorKey[]) {
      const v = str(fd, `color_${key}`, 7);
      if (!/^#[0-9a-f]{6}$/i.test(v)) throw new PortalError(`${THEME_COLORS[key].label} must be a colour like #002147.`);
      colors[key] = v.toUpperCase();
    }
    const font = (k: string, fallback: FontKey) => (k in FONT_OPTIONS ? (k as FontKey) : fallback);
    const scale = num(fd, "fontScale", 1);
    if (scale < 0.85 || scale > 1.25) throw new PortalError("Text size must be between 85% and 125%.");
    await saveSetting(
      "appearance",
      { colors, bodyFont: font(str(fd, "bodyFont", 20), "inter"), headingFont: font(str(fd, "headingFont", 20), "jakarta"), fontScale: Math.round(scale * 100) / 100 },
      admin.id
    );
    revalidatePath("/", "layout");
    return "Appearance updated across the website.";
  });
}

// Resets one inline page edit (text or image) from Admin → Page content.
export async function resetContentAction(fd: FormData) {
  const admin = await requireAdmin("/admin/content");
  await guarded("/admin/content", async () => {
    const type = str(fd, "type", 10) === "image" ? "images" : "texts";
    const key = str(fd, "key", 300);
    const current = (await getSettings())[type] as Record<string, unknown>;
    const next = { ...current };
    delete next[key];
    await saveSetting(type, next as never, admin.id);
    revalidatePath("/", "layout");
    return type === "images" ? "Original image restored." : "Text restored to the original.";
  });
}
