import Link from "next/link";
import { redirect } from "next/navigation";
import AuthShell from "@/components/portal/AuthShell";
import SubmitButton from "@/components/portal/SubmitButton";
import { Field, inputCls } from "@/components/portal/ui";
import { loginAction } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/auth/session";
import { portalMetadata } from "@/lib/seo";
import { isDbConfigured } from "@/lib/db";

export const metadata = portalMetadata("Login");

type SP = Promise<{ next?: string; ok?: string; error?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: SP }) {
  const { next = "", ok, error } = await searchParams;
  const user = await getCurrentUser();
  if (user && !error) redirect(next.startsWith("/") ? next : "/dashboard");
  const qs = next ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <AuthShell
      title="Log in"
      subtitle="Access conference registration, BOLT, TechNext and your certificates."
      ok={ok}
      error={error}
      footer={
        <>
          New here?{" "}
          <Link href={`/signup${qs}`} className="font-bold text-brand-accent hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      {!isDbConfigured() && (
        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          The portal is not connected to its database yet (D1_GATEWAY_URL / D1_GATEWAY_SECRET are not set on this deployment), so login and sign-up are unavailable.
        </p>
      )}
      <form action={loginAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <Field label="Email">
          <input name="email" type="email" required autoComplete="email" className={inputCls} />
        </Field>
        <Field label="Password">
          <input name="password" type="password" required autoComplete="current-password" className={inputCls} />
        </Field>
        <div className="flex items-center justify-between gap-3 pt-1">
          <Link href="/forgot-password" className="text-sm font-semibold text-brand-secondary hover:underline">
            Forgot password?
          </Link>
          <SubmitButton pendingText="Logging in…">Log in</SubmitButton>
        </div>
      </form>
    </AuthShell>
  );
}
