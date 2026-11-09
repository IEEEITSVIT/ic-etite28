import { NextResponse } from "next/server";
import { processOutbox } from "@/lib/email/mailer";

export const maxDuration = 60;

// Vercel Cron (vercel.json) drains whatever the admin left queued, e.g. when the daily
// Gmail quota was reached. Vercel sends `Authorization: Bearer $CRON_SECRET`.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const started = Date.now();
  let total = 0;
  let last = await processOutbox(20);
  total += last.sent;
  while (last.sent > 0 && last.remainingQueued > 0 && last.dailyRemaining > 0 && Date.now() - started < 45_000) {
    last = await processOutbox(20);
    total += last.sent;
  }
  return NextResponse.json({ sent: total, remainingQueued: last.remainingQueued, dailyRemaining: last.dailyRemaining });
}
