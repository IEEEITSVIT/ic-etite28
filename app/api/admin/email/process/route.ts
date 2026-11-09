import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { processOutbox } from "@/lib/email/mailer";

export const maxDuration = 60;

// Called repeatedly by the admin's "Send queued emails" button; each call sends a small
// batch so it finishes well inside the serverless time limit.
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (user?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(req.url).host) return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  return NextResponse.json(await processOutbox(15));
}
