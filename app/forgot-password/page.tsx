import Link from "next/link";
import AuthShell from "@/components/portal/AuthShell";
import SubmitButton from "@/components/portal/SubmitButton";
import { Field, inputCls } from "@/components/portal/ui";
import { forgotPasswordAction } from "@/app/actions/auth";
import { portalMetadata } from "@/lib/seo";

export const metadata = portalMetadata("Forgot password");

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { ok, error } = await searchParams;
  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll email you a link to set a new password."
      ok={ok}
      error={error}
      footer={
        <Link href="/login" className="font-bold text-[#FFB81C] hover:underline">
          Back to login
        </Link>
      }
    >
      <form action={forgotPasswordAction} className="space-y-4">
        <Field label="Email">
          <input name="email" type="email" required autoComplete="email" className={inputCls} />
        </Field>
        <SubmitButton pendingText="Sending…" className="w-full rounded-full bg-[#002147] px-5 py-3 text-sm font-bold text-white hover:bg-[#003366] disabled:opacity-60">
          Send reset link
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
