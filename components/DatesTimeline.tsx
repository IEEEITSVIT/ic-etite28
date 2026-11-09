import { importantDatesData } from "@/data/dates";
import type { DateItem } from "@/lib/settings";
import { Calendar, Clock, Sparkles, CheckCircle2, Award } from "lucide-react";
import E from "@/components/cms/E";

interface MilestoneTheme {
  cardBg: string;
  cardBorder: string;
  cardHoverBg: string;
  numberBg: string;
  titleColor: string;
  dateBadgeBg: string;
  dateBadgeText: string;
  dateBadgeBorder: string;
  badgeBg: string;
  badgeText: string;
  accentColor: string;
}

const milestoneThemes: MilestoneTheme[] = [
  // 01. Full Paper Submission (Pastel Ice Blue)
  {
    cardBg: "bg-[#F0F5FA]",
    cardBorder: "border-[#B8D5ED]",
    cardHoverBg: "hover:bg-[#E6F0FA]",
    numberBg: "bg-brand-primary text-white",
    titleColor: "text-brand-primary",
    dateBadgeBg: "bg-brand-primary",
    dateBadgeText: "text-brand-accent",
    dateBadgeBorder: "border-brand-accent/60",
    badgeBg: "bg-brand-primary/10",
    badgeText: "text-brand-primary",
    accentColor: "#002147",
  },
  // 02. Notification of Acceptance (Pastel Sky Cyan)
  {
    cardBg: "bg-[#F0F9FA]",
    cardBorder: "border-[#A5DFE8]",
    cardHoverBg: "hover:bg-[#E0F3F7]",
    numberBg: "bg-brand-secondary text-white",
    titleColor: "text-brand-secondary",
    dateBadgeBg: "bg-brand-secondary",
    dateBadgeText: "text-brand-accent",
    dateBadgeBorder: "border-brand-accent/60",
    badgeBg: "bg-brand-secondary/10",
    badgeText: "text-brand-secondary",
    accentColor: "#004B87",
  },
  // 03. Camera Ready & Registration (Pastel Royal Periwinkle Blue)
  {
    cardBg: "bg-[#F2F5FC]",
    cardBorder: "border-[#BACCEE]",
    cardHoverBg: "hover:bg-[#E7EEFA]",
    numberBg: "bg-[#1E3A8A] text-white",
    titleColor: "text-[#1E3A8A]",
    dateBadgeBg: "bg-[#1E3A8A]",
    dateBadgeText: "text-brand-accent",
    dateBadgeBorder: "border-brand-accent/60",
    badgeBg: "bg-[#1E3A8A]/10",
    badgeText: "text-[#1E3A8A]",
    accentColor: "#1E3A8A",
  },
  // 04. Conference Days (Pastel Ocean Mist / Steel Blue)
  {
    cardBg: "bg-[#F0F7F9]",
    cardBorder: "border-[#A8D3DC]",
    cardHoverBg: "hover:bg-[#DBEEF3]",
    numberBg: "bg-[#0E6073] text-white",
    titleColor: "text-[#0E6073]",
    dateBadgeBg: "bg-[#0E6073]",
    dateBadgeText: "text-brand-accent",
    dateBadgeBorder: "border-brand-accent/70",
    badgeBg: "bg-[#0E6073]/15",
    badgeText: "text-[#0E6073]",
    accentColor: "#0E6073",
  },
];

export default function DatesTimeline({ items }: { items?: Pick<DateItem, "id" | "title" | "date" | "description" | "isKeyMilestone">[] }) {
  const dates = items?.length ? items : importantDatesData;
  return (
    <section id="dates" className="py-8 sm:py-14 bg-white border-b border-brand-border">
      <div className="container-x">
        {/* Section Header with Highlighted All Deadlines Notice */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-secondary animate-pulse" />
              <span className="text-[11px] tracking-widest uppercase text-brand-secondary font-extrabold font-mono"><E f="c.DatesTimeline">{"Milestones & Schedule"}</E></span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-brand-primary tracking-tight"><E f="c.DatesTimeline">{"Conference Milestone Schedule"}</E></h2>
          </div>

          {/* HIGHLIGHTED ALL DEADLINES PART */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-primary-dark via-[#002B5B] to-brand-primary-dark text-white border-2 border-brand-accent/60 shadow-lg flex items-center gap-4 max-w-xl">
            <div className="w-11 h-11 rounded-xl bg-brand-accent/15 border border-brand-accent/40 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-brand-accent animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-brand-accent font-black px-2.5 py-0.5 rounded-md bg-white/10 border border-brand-accent/30"><E f="c.DatesTimeline">{"Strict Deadline Policy"}</E></span>
              </div>
              <p className="text-xs sm:text-sm text-white/95 mt-1.5 leading-relaxed"><E f="c.DatesTimeline">{"All deadlines are strictly observed at"}</E><E f="c.DatesTimeline">{" "}</E>
                <strong className="text-brand-accent font-black text-sm sm:text-base"><E f="c.DatesTimeline">{"23:59 IST"}</E></strong><E f="c.DatesTimeline">{" "}</E><E f="c.DatesTimeline">{"(Indian Standard Time · UTC +05:30) unless formally extended by the organizing committee."}</E></p>
            </div>
          </div>
        </div>

        {/* Schedule Cards Stack with 4 Different Pastel Blue Shades */}
        <div className="max-w-4xl mx-auto space-y-4">
          {dates.map((item, index) => {
            const isConferenceDay = item.id === "conference-dates" || index === dates.length - 1;
            const theme = milestoneThemes[index] || milestoneThemes[0];

            return (
              <div
                key={item.id}
                className={`p-6 sm:p-7 rounded-2xl border-2 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xs hover:shadow-md ${
                  theme.cardBg
                } ${theme.cardBorder} ${theme.cardHoverBg} ${
                  isConferenceDay ? "ring-2 ring-[#0E6073]/20" : ""
                }`}
              >
                {/* Left Side: Number Pill, Title & Description */}
                <div className="flex items-start gap-4 sm:gap-5">
                  <span
                    className={`text-xs sm:text-sm font-extrabold font-mono pt-1 px-2.5 py-1 rounded-xl shrink-0 ${theme.numberBg}`}
                  ><E f="c.DatesTimeline">{"0"}</E>{index + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3
                        className={`text-lg sm:text-xl font-bold font-serif leading-snug ${theme.titleColor}`}
                      >
                        <E f="c.DatesTimeline">{item.title}</E>
                      </h3>
                      {isConferenceDay ? (
                        <span className="text-xs tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#0E6073] text-brand-accent font-extrabold border border-brand-accent/40"><E f="c.DatesTimeline">{"Conference Days"}</E></span>
                      ) : (
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${theme.badgeBg} ${theme.badgeText}`}
                        ><E f="c.DatesTimeline">{"Official Milestone"}</E></span>
                      )}
                    </div>
                    <p className="text-sm sm:text-base text-slate-700 mt-1.5 max-w-xl leading-relaxed font-normal">
                      <E f="c.DatesTimeline">{item.description}</E>
                    </p>
                  </div>
                </div>

                {/* Right Side: Prominently Highlighted Date Badge */}
                <div className="shrink-0 pl-11 sm:pl-0 flex flex-col sm:items-end">
                  <div
                    className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-extrabold text-base sm:text-lg shadow-sm border ${
                      theme.dateBadgeBg
                    } ${theme.dateBadgeText} ${theme.dateBadgeBorder} ${
                      isConferenceDay ? "ring-2 ring-brand-accent/40 shadow-md" : ""
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-brand-accent shrink-0" />
                    <span className="tabular-nums font-mono"><E f="c.DatesTimeline">{item.date}</E></span>
                  </div>
                  <span className="text-xs font-bold text-slate-500 mt-1.5 block uppercase tracking-wider font-mono">
                    {isConferenceDay ? "Event Dates · VIT" : "Deadline 23:59 IST"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="mt-10 text-center text-xs text-slate-500 max-w-xl mx-auto flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-brand-primary" />
          <span><E f="c.DatesTimeline">{"Dates are synchronized with the Microsoft CMT submission portal and IEEE Xplore schedule."}</E></span>
        </div>
      </div>
    </section>
  );
}
