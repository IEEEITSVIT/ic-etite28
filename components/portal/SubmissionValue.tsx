import type { SubmissionField } from "@/lib/portal/events";

// Shows one submitted answer: links open in a new tab, text keeps its line breaks.
export default function SubmissionValue({ field, value }: { field: SubmissionField; value?: string }) {
  if (!value) return <span className="text-slate-400">—</span>;
  if ((field.type ?? "url") === "url") {
    return (
      <a href={value} target="_blank" rel="noopener noreferrer" className="break-all text-[#004B87] underline">
        {value}
      </a>
    );
  }
  return <span className="whitespace-pre-line break-words text-slate-700">{value}</span>;
}
