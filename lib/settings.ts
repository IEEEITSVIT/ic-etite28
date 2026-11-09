import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
import { all, isDbConfigured, now, run } from "@/lib/db";
import { importantDatesData } from "@/data/dates";
import { registrationFeesData } from "@/data/registration";
import { NO_EARLY_BIRD, type EarlyBird, type Prize } from "@/lib/pricing";
import { hotelsData, type Hotel } from "@/data/hotels";
import { defaultSponsorPackages, type SponsorPackage } from "@/data/sponsorship";
import type { FontKey } from "@/lib/fonts";
import type { ImageOverrides, TextOverrides } from "@/lib/cms";

export type { EarlyBird, Prize };

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
  earlyInr?: number | null; // early-bird price (overrides the % discount)
  earlyUsd?: number | null;
  isIeeeDiscount: boolean;
}

export interface StallType {
  key: string;
  label: string;
  size: string;
  description: string;
  price: number; // INR
  earlyPrice?: number | null; // early-bird price (overrides the % discount)
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

export interface InvoiceTemplate {
  prefix: string; // invoice numbers look like PREFIX/2027-28/00001
  orgName: string;
  orgAddress: string;
  gstin: string;
  pan: string;
  email: string;
  phone: string;
  gstPercent: number; // 0 = no GST line; amounts are GST-inclusive
  title: string;
  notes: string;
  signatory: string;
}

export const THEME_COLORS = {
  primary: { label: "Primary (navy)", hint: "Navbar, headings, buttons", value: "#002147" },
  primaryDark: { label: "Primary dark", hint: "Dark bands, gradients, footer", value: "#001733" },
  primaryHover: { label: "Primary hover", hint: "Button hover", value: "#003366" },
  secondary: { label: "Secondary (blue)", hint: "Links, highlights", value: "#004B87" },
  accent: { label: "Accent (gold)", hint: "Highlights, active nav, badges", value: "#FFB81C" },
  accentDark: { label: "Accent dark", hint: "Accent hover, secondary gold", value: "#F5A623" },
  text: { label: "Body text", hint: "Main text colour", value: "#101B2E" },
  muted: { label: "Muted text", hint: "Secondary text", value: "#4A5568" },
  surface: { label: "Light background", hint: "Section backgrounds", value: "#FAFBFD" },
  border: { label: "Borders", hint: "Card and divider lines", value: "#E4E7EC" },
} as const;

export type ThemeColorKey = keyof typeof THEME_COLORS;

export interface Appearance {
  colors: Record<ThemeColorKey, string>;
  bodyFont: FontKey;
  headingFont: FontKey;
  fontScale: number; // 0.85 – 1.25, scales all rem-based text
}

export interface TickerItem {
  text: string;
  url: string;
  isNew: boolean;
}

// Scrolling announcement bar above the navbar.
export interface TickerSettings {
  enabled: boolean;
  label: string;
  speed: "slow" | "normal" | "fast";
  dismissible: boolean;
  items: TickerItem[];
}

export interface HotelsSettings {
  published: boolean;
  intro: string;
  items: Hotel[];
}

export interface Settings {
  dates: DateItem[];
  conferenceStart: string; // ISO date-time for the countdown
  fees: FeeTier[];
  visibility: Visibility;
  technext: {
    stallTypes: StallType[];
    opensAt: string;
    closesAt: string;
    maxRepresentatives: number;
    earlyBird: EarlyBird;
    prizePool: string;
    prizes: Prize[];
  };
  conference: { opensAt: string; closesAt: string; earlyBird: EarlyBird; prizePool: string; prizes: Prize[] };
  payments: PaymentSettings;
  bolt: { eventSlug: string };
  invoice: InvoiceTemplate;
  hotels: HotelsSettings;
  sponsorship: { packages: SponsorPackage[] };
  ticker: TickerSettings;
  appearance: Appearance;
  texts: TextOverrides; // inline page edits
  images: ImageOverrides;
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
    opensAt: "",
    closesAt: "2028-01-31",
    maxRepresentatives: 4,
    earlyBird: NO_EARLY_BIRD,
    prizePool: "",
    prizes: [],
  },
  conference: {
    opensAt: "",
    closesAt: "2027-12-12",
    earlyBird: NO_EARLY_BIRD,
    prizePool: "",
    prizes: [],
  },
  payments: {
    provider: "manual",
    conferenceLink: "",
    technextLink: "",
    instructions: "Payment details will be shared by the organising committee. Your registration is held as pending until payment is confirmed.",
  },
  bolt: { eventSlug: "bolt-3" },
  invoice: {
    prefix: "ICETITE28",
    orgName: "Vellore Institute of Technology",
    orgAddress: "School of Computer Science Engineering and Information Systems (SCORE), VIT, Vellore, Tamil Nadu 632014, India",
    gstin: "",
    pan: "",
    email: "icetiteconference@vit.ac.in",
    phone: "",
    gstPercent: 0,
    title: "Payment Receipt / Invoice",
    notes: "Thank you for registering for ic-ETITE'28. This is a computer-generated invoice and does not require a signature.",
    signatory: "Organising Committee, ic-ETITE'28",
  },
  hotels: {
    published: false,
    intro: "Partner and nearby hotels for ic-ETITE'28 delegates. Book directly with the hotel; mention ic-ETITE'28 where a conference rate is offered.",
    items: hotelsData,
  },
  sponsorship: { packages: defaultSponsorPackages },
  appearance: {
    colors: Object.fromEntries(Object.entries(THEME_COLORS).map(([k, v]) => [k, v.value])) as Record<ThemeColorKey, string>,
    bodyFont: "inter",
    headingFont: "jakarta",
    fontScale: 1,
  },
  texts: {},
  images: {},
  ticker: {
    enabled: true,
    label: "Announcements",
    speed: "normal",
    dismissible: true,
    items: [
      { text: "Call for Papers open — full paper submission closes 05 October 2027", url: "/call-for-papers", isNew: true },
      { text: "ic-ETITE'28 · 10–11 February 2028 · VIT Vellore · Technically co-sponsored by IEEE", url: "/about", isNew: false },
      { text: "BOLT 3.0 national hackathon and TechNext '28 industrial expo — details coming soon", url: "/hackathon", isNew: false },
    ],
  },
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
