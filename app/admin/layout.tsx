import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth/session";
import { portalMetadata } from "@/lib/seo";

export const metadata = portalMetadata("Admin");

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/settings", label: "Site content (CMS)" },
  { href: "/admin/content", label: "Page content" },
  { href: "/admin/events", label: "Events & BOLT" },
  { href: "/admin/technext", label: "TechNext stalls" },
  { href: "/admin/conference", label: "Conference registrations" },
  { href: "/admin/invoices", label: "Invoices" },
  { href: "/admin/certificates", label: "Certificates (Excel)" },
  { href: "/admin/hotels", label: "Hotels" },
  { href: "/admin/users", label: "Users & evaluators" },
  { href: "/admin/email", label: "Email & SMTP" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin("/admin");
  return (
    <div className="bg-[#F4F6FA]">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 overflow-x-auto px-4 py-2.5 sm:px-6">
          <span className="mr-2 shrink-0 rounded-full bg-brand-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-accent">Admin</span>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-brand-primary">
              {n.label}
            </Link>
          ))}
          <span className="ml-auto hidden shrink-0 text-xs text-slate-500 md:block">{user.email}</span>
        </div>
      </div>
      {children}
    </div>
  );
}
