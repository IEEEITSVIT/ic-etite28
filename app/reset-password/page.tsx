import { redirect } from "next/navigation";
import AuthShell from "@/components/portal/AuthShell";
import SubmitButton from "@/components/portal/SubmitButton";
import { Field, inputCls } from "@/components/portal/ui";
import { resetPasswordAction } from "@/app/actions/auth";
import { portalMetadata } from "@/lib/seo";

export const metadata = portalMetadata("Set a new password");

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string; error?: string }> }) {
  const { token, error } = await searchParams;
  if (!token) redirect("/forgot-password");
  return (
    <AuthShell title="Set a new password" error={error}>
      <form action={resetPasswordAction} className="space-y-4">
        <input type="hidden" name="token" value={token} />
        <Field label="New password" hint="At least 8 characters.">
          <input name="password" type="password" required minLength={8} autoComplete="new-password" className={inputCls} />
        </Field>
        <Field label="Confirm new password">
          <input name="confirm" type="password" required minLength={8} autoComplete="new-password" className={inputCls} />
        </Field>
        <SubmitButton pendingText="Saving…" className="w-full rounded-full bg-[#002147] px-5 py-3 text-sm font-bold text-white hover:bg-[#003366] disabled:opacity-60">
          Update password
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
