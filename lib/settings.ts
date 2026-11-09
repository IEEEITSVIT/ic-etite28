import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
import { all, isDbConfigured, now, run } from "@/lib/db";
import { importantDatesData } from "@/data/dates";
import { registrationFeesData } from "@/data/registration";

// ─── CMS-managed content ───────────────────────────────────────────────
// Only these parts of the public site are editable from /admin/settings; everything
// else stays in code. Each top-level key is stored as one JSON row in `settings`.

export interface DateItem {
  id: string;
  title: string;
  shortTitle: string;
  date: string; // display label, e.g. "05 October 2027"
  shortDate: string; // compact label, e.g. "05 Oct 2027"
  isoDate: string; // used for ordering and "passed" status
  description: string;
  isKeyMilestone: boolean;
}

export interface FeeTier {
  key: string;
  category: string;
  inr: number | null; // Indian delegates, rupees
  usd: number | null; // Foreign delegates, dollars
  isIeeeDiscount: boolean;
}

export interface StallType {
  key: string;
  label: string;
  size: string;
  description: string;
  price: number; // INR
}

export interface Visibility {
  bolt: boolean;
  technext: boolean;
  conferenceRegistration: boolean;
  technextRegistration: boolean;
}

export interface PaymentSettings {
  provider: "manual" | "vit";
  conferenceLink: string;
  technextLink: string;
  instructions: string;
}

export interface Settings {
  dates: DateItem[];
  conferenceStart: string; // ISO date-time for the countdown
  fees: FeeTier[];
  visibility: Visibility;
  technext: { stallTypes: StallType[]; closesAt: string; maxRepresentatives: number };
  payments: PaymentSettings;
  bolt: { eventSlug: string };
}

const shortTitles: Record<string, string> = {
  "paper-submission": "Paper Submission Last Date",
  "acceptance-notification": "Acceptance Notice",
  "camera-ready": "Camera Ready & Reg.",
  "conference-dates": "Conference Days",
};

const parseMoney = (v: string) => {
  const n = Number(v.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
};

export const DEFAULT_SETTINGS: Settings = {
  dates: importantDatesData.map((d) => ({
    id: d.id,
    title: d.title,
    shortTitle: shortTitles[d.id] ?? d.title,
    date: d.date,
    shortDate: d.date.replace(/(\d+[–-]?\d*) (\w{3})\w* (\d{4})/, "$1 $2 $3"),
    isoDate: d.isoDate,
    description: d.description,
    isKeyMilestone: Boolean(d.isKeyMilestone),
  })),
  conferenceStart: "2028-02-10T09:00:00+05:30",
  fees: registrationFeesData.map((f, i) => ({
    key: `tier-${i + 1}`,
    category: f.category,
    inr: parseMoney(f.indianFee),
    usd: parseMoney(f.foreignFee),
    isIeeeDiscount: Boolean(f.isIeeeDiscount),
  })),
  visibility: { bolt: true, technext: true, conferenceRegistration: false, technextRegistration: false },
  technext: {
    stallTypes: [
      { key: "standard", label: "Standard Stall", size: "3m × 3m", description: "Table, two chairs, power socket, Wi-Fi", price: 15000 },
      { key: "premium", label: "Premium Stall", size: "3m × 6m", description: "Corner position, display panel, extra power points", price: 30000 },
      { key: "startup", label: "Startup / Student Pod", size: "2m × 2m", description: "Shared zone for startups and student projects", price: 5000 },
    ],
    closesAt: "2028-01-31",
    maxRepresentatives: 4,
  },
  payments: {
    provider: "manual",
    conferenceLink: "",
    technextLink: "",
    instructions: "Payment details will be shared by the organising committee. Your registration is held as pending until payment is confirmed.",
  },
  bolt: { eventSlug: "bolt-3" },
};

export type SettingsKey = keyof Settings;

async function loadSettings(): Promise<Settings> {
  if (!isDbConfigured()) return DEFAULT_SETTINGS;
  try {
    const rows = await all<{ key: string; value: string }>("SELECT key, value FROM settings");
    const merged: Settings = structuredClone(DEFAULT_SETTINGS);
    for (const row of rows) {
      if (!(row.key in merged)) continue;
      const value = JSON.parse(row.value);
      const k = row.key as SettingsKey;
      const base = merged[k];
      // Objects merge over defaults so newly added fields keep a value; arrays/scalars replace.
      (merged as unknown as Record<string, unknown>)[k] =
        base && typeof base === "object" && !Array.isArray(base) ? { ...base, ...value } : value;
    }
    return merged;
  } catch (err) {
    console.error("Failed to load settings, using defaults", err);
    return DEFAULT_SETTINGS;
  }
}

export const getSettings = unstable_cache(loadSettings, ["site-settings"], { tags: ["settings"], revalidate: 600 });

export async function saveSetting<K extends SettingsKey>(key: K, value: Settings[K], userId: string) {
  await run(
    `INSERT INTO settings (key, value, updated_at, updated_by) VALUES (?, ?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at, updated_by = excluded.updated_by`,
    [key, JSON.stringify(value), now(), userId]
  );
  revalidateTag("settings");
}

export const formatInr = (n: number | null) => (n == null ? "—" : `INR ${n.toLocaleString("en-IN")}`);
export const formatUsd = (n: number | null) => (n == null ? "—" : `USD ${n.toLocaleString("en-US")}`);
export const formatMoney = (amount: number, currency: string) =>
  currency === "USD" ? formatUsd(amount) : formatInr(amount);

export const isDatePassed = (iso: string) => new Date(`${iso}T23:59:59+05:30`).getTime() < Date.now();
