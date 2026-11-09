import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";

// Lets static pages discover the signed-in user's role (e.g. to show the admin editor).
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null }, { status: 401, headers: { "cache-control": "no-store" } });
  return NextResponse.json({ name: user.name, role: user.role }, { headers: { "cache-control": "no-store" } });
}
