import Image from "next/image";
import { conferenceData } from "@/data/conference";
import { Network, Sparkles, Binary, ExternalLink, Lightbulb } from "lucide-react";

export default function IeeeItsSection() {
  const { ieeeItsInfo } = conferenceData;

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[#e8e4dc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#f7f5f0] rounded-xl border border-[#e8e4dc] p-8 sm:p-12 shadow-subtle">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Emblem & Identity */}
            <div className="lg:col-span-4 flex flex-col items-center text-center p-6 bg-white rounded-xl border border-[#e8e4dc] shadow-xs">
              <div className="relative w-24 h-24 mb-4">
                <Image
                  src="/assets/ieee-its-emblem.png"
                  alt="IEEE Information Theory Society Logo"
                  fill
                  className="object-contain"
                  sizes="96px"
                  loading="lazy"
                />
              </div>

              <span className="text-[10px] font-mono tracking-widest uppercase text-[#004B87] font-semibold">
                IEEE Student Branch Chapter
              </span>
              <h3 className="text-base font-bold text-[#1a1714] mt-1">
                IEEE Information Theory Society, VIT
              </h3>
              <p className="text-xs text-[#6b6560] mt-1">
                Vellore Institute of Technology, Vellore, India
              </p>

              <a
                href="https://ieee-its-vit.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#004B87] hover:underline transition-colors"
              >
                <span>Visit Chapter Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Description & Scientific Mandate */}
            <div className="lg:col-span-8 flex flex-col space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-px bg-[#137547]" />
                <span className="font-mono text-[11px] tracking-widest uppercase text-[#137547]">
                  Organizing Student Chapter
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1714] tracking-tight">
                Pioneering Foundations in Information Theory & Scientific Innovation
              </h2>

              <p className="text-sm sm:text-base text-[#6b6560] leading-relaxed">
                {ieeeItsInfo.description}
              </p>

              <p className="text-sm text-[#6b6560] leading-relaxed">
                {ieeeItsInfo.mission}
              </p>

              {/* Pillars list */}
              <div className="pt-2">
                <p className="font-mono text-[10px] tracking-widest uppercase text-[#9c968f] mb-3">
                  Core Scientific Activities:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#1a1714]">
                  {ieeeItsInfo.pillars.map((pillar) => (
                    <div key={pillar} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-[#e8e4dc]">
                      <Lightbulb className="w-3.5 h-3.5 text-[#137547] shrink-0" />
                      <span className="font-medium">{pillar}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
