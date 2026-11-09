import type { ReactNode } from "react";
import Image from "next/image";
import { Flash } from "@/components/portal/ui";

export default function AuthShell({
  title,
  subtitle,
  ok,
  error,
  children,
  footer,
}: {
  title: string;
  subtitle?: ReactNode;
  ok?: string;
  error?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-[75vh] bg-gradient-to-br from-[#001733] via-[#002147] to-[#0D2E5C] px-4 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="relative h-12 w-52">
            <Image src="/logos/ic-etite28-cropped-transparent.png" alt="ic-ETITE'28" fill sizes="208px" className="object-contain" />
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-2xl">
          <h1 className="text-2xl font-extrabold text-[#002147]">{title}</h1>
          {subtitle && <p className="mt-1.5 text-[15px] text-slate-600">{subtitle}</p>}
          <div className="mt-6">
            <Flash ok={ok} error={error} />
            {children}
          </div>
        </div>
        {footer && <div className="mt-5 text-center text-sm text-white/80">{footer}</div>}
      </div>
    </div>
  );
}
