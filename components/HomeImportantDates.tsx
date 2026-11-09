import Link from "next/link";
import { Calendar, ArrowRight, Clock } from "lucide-react";
import type { DateItem } from "@/lib/settings";
import E from "@/components/cms/E";

export default function HomeImportantDates({ items }: { items?: DateItem[] }) {
  const fallback = [
    {
      date: "05 October 2027",
      title: "Full Paper Submission",
      note: "Microsoft (CMT) submission system closes at 23:59 IST",
      highlight: false,
    },
    {
      date: "04 November 2027",
      title: "Notification of Acceptance",
      note: "Authors notified of peer-review decision letters",
      highlight: false,
    },
    {
      date: "12 December 2027",
      title: "Camera-Ready Submission & Registration",
      note: "Final IEEE Xplore formatted manuscript & mandatory author registration",
      highlight: false,
    },
    {
      date: "10–11 February 2028",
      title: "Conference Presentation Days",
      note: "Plenary keynotes, research tracks & exhibits at VIT Vellore",
      highlight: true,
    },
  ];
  // CMS dates when available; the last key milestone (conference days) is highlighted.
  const dates = items?.length
    ? items.map((d, i) => ({ date: d.date, title: d.title, note: d.description, highlight: i === items.length - 1 && d.isKeyMilestone }))
    : fallback;

  return (
    <section id="important-dates" className="border-b border-brand-border bg-brand-surface scroll-mt-20">
      <div className="container-x py-16 md:py-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-border bg-white text-[12px] font-semibold text-brand-primary mb-3 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-brand-secondary" />
            <span><E f="c.HomeImportantDates">{"Key Milestone Timeline"}</E></span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-brand-primary tracking-tight"><E f="c.HomeImportantDates">{"Important Dates"}</E></h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600"><E f="c.HomeImportantDates">{"Key deadlines for authors, reviewers, and delegates planning attendance for ic-ETITE'28."}</E></p>
        </div>

        {/* Timeline */}
        <div className="relative mb-12">
          {/* Horizontal Track Line on Desktop */}
          <div className="hidden md:block absolute left-0 right-0 top-[14px] h-[2px] bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent-dark" />

          <div className="grid md:grid-cols-4 gap-8">
            {dates.map((d) => (
              <div
                key={d.title}
                className="text-center md:text-left bg-white md:bg-transparent p-5 md:p-0 rounded-2xl border md:border-0 border-brand-border shadow-sm md:shadow-none"
              >
                {/* Milestone Node */}
                {d.highlight ? (
                  <div className="mx-auto md:mx-0 w-[16px] h-[16px] rounded-full bg-brand-accent-dark mb-4 relative z-10 ring-4 ring-brand-accent-dark/30 shadow-xs" />
                ) : (
                  <div className="mx-auto md:mx-0 w-[14px] h-[14px] rounded-full bg-brand-primary mb-4 relative z-10 ring-4 ring-white shadow-2xs" />
                )}

                {/* Highlighted Date */}
                <div className="mb-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-base sm:text-lg tabular-nums border shadow-2xs ${
                      d.highlight
                        ? "bg-brand-primary text-brand-accent border-brand-accent/50 ring-2 ring-brand-accent/30"
                        : "bg-amber-100/90 text-amber-950 border-amber-300/80"
                    }`}
                  >
                    <Calendar
                      className={`w-4 h-4 shrink-0 ${
                        d.highlight ? "text-brand-accent" : "text-amber-700"
                      }`}
                    />
                    <span><E f="c.HomeImportantDates">{d.date}</E></span>
                  </span>
                </div>

                <p className="text-base sm:text-lg font-bold text-brand-primary mt-2"><E f="c.HomeImportantDates">{d.title}</E></p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed"><E f="c.HomeImportantDates">{d.note}</E></p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/important-dates"
            className="btn-outline text-sm font-semibold inline-flex items-center gap-2 py-2.5 px-5 hover:border-brand-primary hover:text-brand-primary transition-colors"
          >
            <span><E f="c.HomeImportantDates">{"View Full Timeline & Calendar"}</E></span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
