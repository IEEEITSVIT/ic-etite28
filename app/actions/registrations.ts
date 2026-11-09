"use server";

import { requireUser } from "@/lib/auth/session";
import { batch, first, now, run } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { priceNow, windowState } from "@/lib/pricing";
import { bool, guarded, isEmail, str } from "@/lib/portal/actions";
import { ORG_TYPES } from "@/lib/portal/technext";
import { PortalError } from "@/lib/portal/events";
import { newId } from "@/lib/portal/ids";
import { emailLayout, outboxInsert, textToHtml } from "@/lib/email/mailer";
import { SITE_URL } from "@/lib/seo";


// ─── TechNext stall booking ───────────────────────────────────────────

export async function saveTechnextBookingAction(fd: FormData) {
  const back = "/technext/register";
  const user = await requireUser(back);
  await guarded(back, async () => {
    const settings = await getSettings();
    if (!settings.visibility.technext || !settings.visibility.technextRegistration) throw new PortalError("Stall bookings are not open.");
    const existing = await first<{ id: string; status: string; payment_status: string; created_at: string }>(
      "SELECT id, status, payment_status, created_at FROM technext_bookings WHERE user_id = ? AND status != 'cancelled' ORDER BY created_at DESC LIMIT 1",
      [user.id]
    );
    const tw = windowState(settings.technext.opensAt, settings.technext.closesAt);
    if (!existing && tw !== "open") throw new PortalError(tw === "not_open" ? "Stall bookings have not opened yet." : "Stall bookings have closed.");
    if (existing && existing.status !== "pending") throw new PortalError("Your booking has been reviewed; contact the organisers to change it.");

    const stall = settings.technext.stallTypes.find((s) => s.key === str(fd, "stall_type", 40));
    if (!stall) throw new PortalError("Choose a stall type.");
    // Price is fixed by when the booking was first made, so editing later keeps an early-bird price.
    const pricedAt = existing ? new Date(existing.created_at).getTime() : Date.now();
    const stallPrice = priceNow(stall.price, stall.earlyPrice, settings.technext.earlyBird, pricedAt).amount ?? stall.price;
    const orgType = str(fd, "organization_type", 40);
    if (!ORG_TYPES.includes(orgType)) throw new PortalError("Choose an organisation type.");
    const email = str(fd, "email", 200).toLowerCase();
    if (!isEmail(email)) throw new PortalError("Enter a valid contact email.");
    const phone = str(fd, "phone", 20);
    if (!/^[+\d][\d\s-]{7,}$/.test(phone)) throw new PortalError("Enter a valid phone number.");
    const website = str(fd, "website", 300);
    if (website && !/^https?:\/\//i.test(website)) throw new PortalError("Website must start with http:// or https://");
    const reps = String(fd.get("representatives") ?? "")
      .split(/\n|,/)
      .map((r) => r.trim().slice(0, 80))
      .filter(Boolean);
    if (reps.length === 0) throw new PortalError("List at least one representative who will staff the stall.");
    if (reps.length > settings.technext.maxRepresentatives) throw new PortalError(`At most ${settings.technext.maxRepresentatives} representatives per stall.`);
    const required = { organization_name: str(fd, "organization_name", 150), sector: str(fd, "sector", 100), contact_name: str(fd, "contact_name", 100), city: str(fd, "city", 80), exhibit_description: str(fd, "exhibit_description", 2000) };
    for (const [k, v] of Object.entries(required)) if (!v) throw new PortalError(`${k.replace(/_/g, " ")} is required.`);

    const values = [
      required.organization_name,
      orgType,
      required.sector,
      required.contact_name,
      str(fd, "designation", 100) || null,
      email,
      phone,
      required.city,
      str(fd, "state", 80) || null,
      website || null,
      stall.key,
      JSON.stringify(reps),
      required.exhibit_description,
      bool(fd, "power_required") ? 1 : 0,
      str(fd, "special_requirements", 1000) || null,
      str(fd, "gst_number", 20).toUpperCase() || null,
      stallPrice,
      stallPrice > 0 ? "unpaid" : "not_required",
      now(),
    ];
    if (existing) {
      await run(
        `UPDATE technext_bookings SET organization_name=?, organization_type=?, sector=?, contact_name=?, designation=?, email=?, phone=?, city=?, state=?, website=?,
           stall_type=?, representatives=?, exhibit_description=?, power_required=?, special_requirements=?, gst_number=?, payment_amount=?,
           payment_status = CASE WHEN payment_status IN ('paid','waived') THEN payment_status ELSE ? END, updated_at=? WHERE id=?`,
        [...values, existing.id]
      );
      return "Booking updated.";
    }
    const id = newId();
    const t = now();
    await batch([
      {
        sql: `INSERT INTO technext_bookings (organization_name, organization_type, sector, contact_name, designation, email, phone, city, state, website,
                stall_type, representatives, exhibit_description, power_required, special_requirements, gst_number, payment_amount, payment_status, updated_at,
                id, user_id, payment_currency, status, created_at)
              VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'INR','pending',?)`,
        params: [...values, id, user.id, t],
      },
      outboxInsert({
        to: email,
        toName: required.contact_name,
        subject: "TechNext '28 stall booking received",
        html: emailLayout(
          "Stall booking received",
          textToHtml(
            `Dear ${required.contact_name},\n\nThank you for booking a ${stall.label} for ${required.organization_name} at TechNext '28. The organising committee will review your booking and confirm it shortly; payment details follow on approval.\n\nTrack your booking: ${SITE_URL}/dashboard`
          )
        ),
        scope: "technext",
        priority: 3,
      }),
    ]);
    return "Booking submitted. We'll review it and email you once it's approved.";
  }, "/dashboard");
}

export async function cancelTechnextBookingAction() {
  const user = await requireUser("/technext/register");
  await guarded("/technext/register", async () => {
    const res = await run("UPDATE technext_bookings SET status = 'cancelled', updated_at = ? WHERE user_id = ? AND status = 'pending' AND payment_status NOT IN ('paid')", [
      now(),
      user.id,
    ]);
    if (res.changes === 0) throw new PortalError("Only unpaid pending bookings can be cancelled here. Contact the organisers.");
    return "Booking cancelled.";
  }, "/dashboard");
}

// ─── Conference registration ──────────────────────────────────────────

export async function saveConferenceRegistrationAction(fd: FormData) {
  const back = "/registration/apply";
  const user = await requireUser(back);
  await guarded(back, async () => {
    const settings = await getSettings();
    if (!settings.visibility.conferenceRegistration) throw new PortalError("Conference registration is not open yet.");
    const existing = await first<{ id: string; payment_status: string; status: string; created_at: string }>(
      "SELECT id, payment_status, status, created_at FROM conference_registrations WHERE user_id = ?",
      [user.id]
    );
    const cw = windowState(settings.conference.opensAt, settings.conference.closesAt);
    if (cw !== "open" && !existing) throw new PortalError(cw === "not_open" ? "Conference registration has not opened yet." : "Conference registration has closed.");
    if (existing && (existing.payment_status === "paid" || existing.payment_status === "waived" || existing.status === "confirmed")) {
      throw new PortalError("Your registration is confirmed. Contact the organisers to make changes.");
    }
    const tier = settings.fees.find((f) => f.key === str(fd, "category", 60));
    if (!tier) throw new PortalError("Choose a registration category.");
    const residency = str(fd, "residency", 10) === "foreign" ? "foreign" : "indian";
    // Price is fixed by when the delegate first registered, so edits keep an early-bird price.
    const pricedAt = existing ? new Date(existing.created_at).getTime() : Date.now();
    const amount =
      residency === "foreign"
        ? priceNow(tier.usd, tier.earlyUsd, settings.conference.earlyBird, pricedAt).amount
        : priceNow(tier.inr, tier.earlyInr, settings.conference.earlyBird, pricedAt).amount;
    if (amount == null) throw new PortalError(`"${tier.category}" is not available for ${residency === "foreign" ? "foreign" : "Indian"} delegates.`);
    const ieee = bool(fd, "ieee_member");
    const ieeeNumber = str(fd, "ieee_number", 20);
    if (tier.isIeeeDiscount && (!ieee || !/^\d{6,12}$/.test(ieeeNumber))) throw new PortalError("IEEE member categories need a valid IEEE membership number.");
    const affiliation = str(fd, "affiliation", 200);
    const country = str(fd, "country", 80) || (residency === "indian" ? "India" : "");
    if (!affiliation) throw new PortalError("Affiliation is required.");
    if (!country) throw new PortalError("Country is required.");
    const paperIds = str(fd, "paper_ids", 200);
    const presenting = bool(fd, "presenting_author");
    if (presenting && !paperIds) throw new PortalError("Presenting authors must enter their CMT paper ID(s).");

    const currency = residency === "foreign" ? "USD" : "INR";
    const values = [
      tier.key,
      tier.category,
      residency,
      ieee ? 1 : 0,
      ieee ? ieeeNumber || null : null,
      affiliation,
      str(fd, "designation", 100) || null,
      country,
      paperIds || null,
      str(fd, "paper_titles", 1000) || null,
      presenting ? 1 : 0,
      amount,
      currency,
      amount > 0 ? "unpaid" : "not_required",
      now(),
    ];
    if (existing) {
      await run(
        `UPDATE conference_registrations SET category_key=?, category_label=?, residency=?, ieee_member=?, ieee_number=?, affiliation=?, designation=?, country=?,
           paper_ids=?, paper_titles=?, presenting_author=?, payment_amount=?, payment_currency=?, payment_status=?, updated_at=? WHERE id=?`,
        [...values, existing.id]
      );
      return "Registration updated.";
    }
    await run(
      `INSERT INTO conference_registrations (category_key, category_label, residency, ieee_member, ieee_number, affiliation, designation, country,
         paper_ids, paper_titles, presenting_author, payment_amount, payment_currency, payment_status, updated_at, id, user_id, status, created_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'pending',?)`,
      [...values, newId(), user.id, now()]
    );
    return "Registration saved. Complete the payment to confirm it.";
  }, "/dashboard");
}
