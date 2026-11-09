import Link from "next/link";
import { Calendar, ArrowRight, Clock } from "lucide-react";

export default function HomeImportantDates() {
  const dates = [
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

  return (
    <section id="important-dates" className="border-b border-[#E4E7EC] bg-[#F7F8FA] scroll-mt-20">
      <div className="container-x py-16 md:py-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E4E7EC] bg-white text-[12px] font-semibold text-[#002147] mb-3 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-[#004B87]" />
            <span>Key Milestone Timeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#002147] tracking-tight">
            Important Dates
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Key deadlines for authors, reviewers, and delegates planning attendance for ic-ETITE&apos;28.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mb-12">
          {/* Horizontal Track Line on Desktop */}
          <div className="hidden md:block absolute left-0 right-0 top-[14px] h-[2px] bg-gradient-to-r from-[#002147] via-[#004B87] to-[#F5A623]" />

          <div className="grid md:grid-cols-4 gap-8">
            {dates.map((d) => (
              <div
                key={d.title}
                className="text-center md:text-left bg-white md:bg-transparent p-5 md:p-0 rounded-2xl border md:border-0 border-[#E4E7EC] shadow-sm md:shadow-none"
              >
                {/* Milestone Node */}
                {d.highlight ? (
                  <div className="mx-auto md:mx-0 w-[16px] h-[16px] rounded-full bg-[#F5A623] mb-4 relative z-10 ring-4 ring-[#F5A623]/30 shadow-xs" />
                ) : (
                  <div className="mx-auto md:mx-0 w-[14px] h-[14px] rounded-full bg-[#002147] mb-4 relative z-10 ring-4 ring-white shadow-2xs" />
                )}

                {/* Highlighted Date */}
                <div className="mb-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-base sm:text-lg tabular-nums border shadow-2xs ${
                      d.highlight
                        ? "bg-[#002147] text-[#FFB81C] border-[#FFB81C]/50 ring-2 ring-[#FFB81C]/30"
                        : "bg-amber-100/90 text-amber-950 border-amber-300/80"
                    }`}
                  >
                    <Calendar
                      className={`w-4 h-4 shrink-0 ${
                        d.highlight ? "text-[#FFB81C]" : "text-amber-700"
                      }`}
                    />
                    <span>{d.date}</span>
                  </span>
                </div>

                <p className="text-base sm:text-lg font-bold text-[#002147] mt-2">{d.title}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{d.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/important-dates"
            className="btn-outline text-sm font-semibold inline-flex items-center gap-2 py-2.5 px-5 hover:border-[#002147] hover:text-[#002147] transition-colors"
          >
            <span>View Full Timeline &amp; Calendar</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
