"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { getSettings, saveSetting, type DateItem, type FeeTier, type StallType } from "@/lib/settings";
import { bool, guarded, num, str } from "@/lib/portal/actions";
import { PortalError } from "@/lib/portal/events";
import { slugify } from "@/lib/portal/ids";

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
      }));
    if (stallTypes.length === 0) throw new PortalError("Add at least one stall type.");
    const current = (await getSettings()).technext;
    await saveSetting(
      "technext",
      {
        stallTypes,
        closesAt: str(fd, "closes_at", 10) || current.closesAt,
        maxRepresentatives: Math.max(1, Math.min(20, num(fd, "max_reps", current.maxRepresentatives))),
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
