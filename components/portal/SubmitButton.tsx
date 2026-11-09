"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";
import { btnPrimary } from "@/components/portal/ui";

// Disables itself while the surrounding form's server action runs; optional confirm prompt
// for destructive actions.
export default function SubmitButton({
  children,
  className = btnPrimary,
  pendingText = "Working…",
  confirm,
  name,
  value,
  formAction,
}: {
  children: ReactNode;
  className?: string;
  pendingText?: string;
  confirm?: string;
  name?: string;
  value?: string;
  formAction?: (formData: FormData) => void | Promise<void>;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      name={name}
      value={value}
      formAction={formAction}
      disabled={pending}
      className={className}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      {pending ? pendingText : children}
    </button>
  );
}
