import { Calendar, MapPin, Award, Globe2, BookOpen } from "lucide-react";
import E from "@/components/cms/E";

export default function ConferenceSnapshot() {
  const items = [
    {
      label: "Conference Dates",
      value: "10–11 February 2028",
      subtext: "Hybrid / In-Person Sessions",
      icon: Calendar,
      accent: "text-vit",
    },
    {
      label: "Host Institution",
      value: "VIT Vellore, India",
      subtext: "SCORE, Vellore Campus",
      icon: MapPin,
      accent: "text-navy",
    },
    {
      label: "Technical Sponsor",
      value: "IEEE",
      subtext: "IEEE Conference Record",
      icon: Award,
      accent: "text-ieee-blue",
    },
    {
      label: "Organizing Chapter",
      value: "IEEE ITS VIT",
      subtext: "Student Chapter Vellore",
      icon: BookOpen,
      accent: "text-brand-secondary",
    },
    {
      label: "Global Reach",
      value: "International Conference",
      subtext: "20+ Nations Expected",
      icon: Globe2,
      accent: "text-academic-700",
    },
  ];

  return (
    <section id="snapshot" aria-label="Conference Snapshot" className="bg-[#f7f5f0] border-b border-[#e8e4dc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="bg-white p-4 rounded-xl border border-[#e8e4dc] shadow-subtle flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] tracking-wider uppercase text-[#9c968f]">
                    <E f="c.ConferenceSnapshot">{item.label}</E>
                  </span>
                  <Icon className="w-3.5 h-3.5 text-brand-secondary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1a1714] leading-snug">
                    <E f="c.ConferenceSnapshot">{item.value}</E>
                  </p>
                  <p className="font-mono text-[10px] text-[#6b6560] mt-0.5">
                    <E f="c.ConferenceSnapshot">{item.subtext}</E>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
