import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Award } from "lucide-react";

interface PageHeaderProps {
  badge: string;
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  bgImage?: string;
}

export default function PageHeader({
  badge,
  title,
  subtitle,
  breadcrumb,
  bgImage = "/images/frame_15.webp",
}: PageHeaderProps) {
  return (
    <div className="relative bg-[#002147] text-white py-10 md:py-16 overflow-hidden border-b border-white/15 select-none">
      {/* Background Image with Dark Navy Gradient Overlay matching vit.ac.in */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt="VIT Vellore Background"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-20 filter saturate-150"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0, 33, 71, 0.96) 0%, rgba(0, 33, 71, 0.90) 45%, rgba(0, 33, 71, 0.75) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
      </div>

      <div className="container-x relative z-10">
        {/* Breadcrumb matching vit.ac.in format */}
        <nav className="flex items-center gap-2 text-xs font-medium text-white/70 mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="text-[#FFB81C] font-semibold">{breadcrumb || title}</span>
        </nav>

        {/* Institutional Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4DB] border border-[#F5A623]/50 text-[#002147] text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Award className="w-3.5 h-3.5 text-[#F5A623]" />
          <span>{badge}</span>
        </div>

        {/* Main H1 Heading with vit.ac.in font format and generous spacing */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white max-w-3xl leading-[1.15] mb-4 drop-shadow">
          {title}
        </h1>

        {subtitle && (
          <p className="text-sm sm:text-base md:text-lg text-white/85 max-w-2xl leading-relaxed font-normal">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
