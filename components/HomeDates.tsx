import Link from "next/link";
import E from "@/components/cms/E";

const dates = [
  { label: "Paper Submission Deadline", date: "15 August 2027", status: "upcoming" },
  { label: "Notification of Acceptance", date: "30 September 2027", status: "upcoming" },
  { label: "Camera-Ready Submission", date: "31 October 2027", status: "upcoming" },
  { label: "Registration Deadline", date: "30 November 2027", status: "upcoming" },
  { label: "Conference Dates", date: "10–11 February 2028", status: "conference" },
];

export default function HomeDates() {
  return (
    <section className="bg-gray-50 py-16 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-2"><E f="c.HomeDates">{"Don't Miss The Deadline"}</E></p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900"><E f="c.HomeDates">{"Key Important Dates"}</E></h2>
        </div>

        <div className="space-y-3">
          {dates.map((d) => (
            <div
              key={d.label}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-6 py-4 rounded-lg border ${
                d.status === "conference"
                  ? "bg-blue-700 border-blue-700 text-white"
                  : "bg-white border-gray-200 text-gray-800"
              }`}
            >
              <span className={`font-semibold text-sm ${d.status === "conference" ? "text-white" : "text-gray-800"}`}>
                <E f="c.HomeDates">{d.label}</E>
              </span>
              <span className={`font-bold text-base ${d.status === "conference" ? "text-yellow-300" : "text-blue-700"}`}>
                <E f="c.HomeDates">{d.date}</E>
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/important-dates" className="inline-block bg-blue-700 hover:bg-blue-900 text-white font-bold py-3 px-8 rounded text-sm transition-all"><E f="c.HomeDates">{"View All Dates & Deadlines →"}</E></Link>
        </div>
      </div>
    </section>
  );
}
