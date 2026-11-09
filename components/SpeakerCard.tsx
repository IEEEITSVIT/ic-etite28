import { Speaker } from "@/data/speakers";
import { Building2, Globe, Sparkles } from "lucide-react";
import E from "@/components/cms/E";

export default function SpeakerCard({ speaker }: { speaker: Speaker; index?: number }) {
  return (
    <div className="group bg-white rounded-2xl p-6 border border-brand-border hover:border-brand-secondary hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Badges: Edition & Country */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold text-brand-primary bg-[#FFF4DB] px-3 py-0.5 rounded-full border border-brand-accent-dark/60">
            <E f="c.SpeakerCard">{speaker.edition}</E>
          </span>
          <span className="font-mono text-[11px] tracking-wider uppercase bg-slate-100 text-brand-primary px-2.5 py-0.5 rounded-md border border-slate-200 font-semibold">
            <E f="c.SpeakerCard">{speaker.country}</E>
          </span>
        </div>

        {/* Speaker Name */}
        <h3 className="text-lg sm:text-xl font-bold text-brand-primary leading-snug group-hover:text-brand-secondary transition-colors">
          <E f="c.SpeakerCard">{speaker.name}</E>
        </h3>

        {/* Designation */}
        <p className="text-sm text-slate-600 leading-relaxed mt-2 font-normal">
          <E f="c.SpeakerCard">{speaker.designation}</E>
        </p>

        {/* Institution */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-start gap-2 text-sm text-slate-700">
          <Building2 className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
          <span className="font-semibold text-brand-primary">
            <E f="c.SpeakerCard">{speaker.institution}</E>
          </span>
        </div>
      </div>

      {/* Keynote Topic / Domain */}
      {speaker.domain && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-[13px] text-slate-800 font-medium italic leading-snug">
            <span className="not-italic text-[10px] uppercase font-bold text-brand-secondary block mb-1"><E f="c.SpeakerCard">{"Keynote Address / Domain"}</E></span><E f="c.SpeakerCard">{"“"}</E><E f="c.SpeakerCard">{speaker.domain}</E><E f="c.SpeakerCard">{"”"}</E></div>
        </div>
      )}
    </div>
  );
}
