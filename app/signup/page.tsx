import Link from "next/link";
import { redirect } from "next/navigation";
import AuthShell from "@/components/portal/AuthShell";
import SubmitButton from "@/components/portal/SubmitButton";
import { Field, inputCls } from "@/components/portal/ui";
import { signupAction } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/auth/session";
import { portalMetadata } from "@/lib/seo";
import { isDbConfigured } from "@/lib/db";

export const metadata = portalMetadata("Create account");

type SP = Promise<{ next?: string; error?: string }>;

export default async function SignupPage({ searchParams }: { searchParams: SP }) {
  const { next = "", error } = await searchParams;
  if (await getCurrentUser()) redirect("/dashboard");
  const qs = next ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <AuthShell
      title="Create your account"
      subtitle="One account for conference registration, BOLT, TechNext and certificates."
      error={error}
      footer={
        <>
          Already registered?{" "}
          <Link href={`/login${qs}`} className="font-bold text-[#FFB81C] hover:underline">
            Log in
          </Link>
        </>
      }
    >
      {!isDbConfigured() && (
        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          The portal is not connected to its database yet (D1_GATEWAY_URL / D1_GATEWAY_SECRET are not set on this deployment), so login and sign-up are unavailable.
        </p>
      )}
      <form action={signupAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <Field label="Full name" hint="As it should appear on certificates.">
          <input name="name" required minLength={2} maxLength={100} autoComplete="name" className={inputCls} />
        </Field>
        <Field label="Email">
          <input name="email" type="email" required autoComplete="email" className={inputCls} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone">
            <input name="phone" type="tel" autoComplete="tel" maxLength={20} className={inputCls} />
          </Field>
          <Field label="City">
            <input name="city" maxLength={80} autoComplete="address-level2" className={inputCls} />
          </Field>
        </div>
        <Field label="Institution / organisation">
          <input name="institution" maxLength={150} autoComplete="organization" className={inputCls} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Department / programme">
            <input name="department" maxLength={120} className={inputCls} />
          </Field>
          <Field label="Year of study">
            <input name="year_of_study" maxLength={30} placeholder="e.g. 3rd year / Faculty" className={inputCls} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Password" hint="At least 8 characters.">
            <input name="password" type="password" required minLength={8} autoComplete="new-password" className={inputCls} />
          </Field>
          <Field label="Confirm password">
            <input name="confirm" type="password" required minLength={8} autoComplete="new-password" className={inputCls} />
          </Field>
        </div>
        <SubmitButton pendingText="Creating account…" className="w-full rounded-full bg-[#002147] px-5 py-3 text-sm font-bold text-white hover:bg-[#003366] disabled:opacity-60">
          Create account
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
