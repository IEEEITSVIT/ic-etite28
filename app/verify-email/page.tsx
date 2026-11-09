import { redirect } from "next/navigation";
import AuthShell from "@/components/portal/AuthShell";
import SubmitButton from "@/components/portal/SubmitButton";
import { Field, btnSecondary, inputCls } from "@/components/portal/ui";
import { logoutAction, resendCodeAction, verifyEmailAction } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/auth/session";
import { portalMetadata } from "@/lib/seo";

export const metadata = portalMetadata("Verify email");

type SP = Promise<{ next?: string; ok?: string; error?: string }>;

export default async function VerifyEmailPage({ searchParams }: { searchParams: SP }) {
  const { next = "", ok, error } = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.email_verified) redirect(next.startsWith("/") ? next : "/dashboard");

  return (
    <AuthShell
      title="Verify your email"
      subtitle={
        <>
          Enter the 6-digit code sent to <strong>{user.email}</strong>. Check your spam folder if it has not arrived.
        </>
      }
      ok={ok}
      error={error}
    >
      <form action={verifyEmailAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <Field label="Verification code">
          <input
            name="code"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            autoComplete="one-time-code"
            className={`${inputCls} text-center text-2xl font-bold tracking-[0.5em]`}
          />
        </Field>
        <SubmitButton pendingText="Verifying…" className="w-full rounded-full bg-brand-primary px-5 py-3 text-sm font-bold text-white hover:bg-brand-primary-hover disabled:opacity-60">
          Verify email
        </SubmitButton>
      </form>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <form action={resendCodeAction}>
          <input type="hidden" name="next" value={next} />
          <SubmitButton className={btnSecondary} pendingText="Sending…">
            Resend code
          </SubmitButton>
        </form>
        <form action={logoutAction}>
          <button className="text-sm font-semibold text-slate-500 hover:text-slate-800">Use a different account</button>
        </form>
      </div>
    </AuthShell>
  );
}
