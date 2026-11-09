import { Trophy } from "lucide-react";
import { prizeTotal, type Prize } from "@/lib/pricing";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// Prize pool headline plus individual prizes; renders nothing when no prizes are set.
export default function PrizePool({ prizes, pool, title = "Prize pool", compact = false }: { prizes: Prize[]; pool?: string | null; title?: string; compact?: boolean }) {
  const total = prizeTotal(prizes);
  const headline = pool?.trim() || (total > 0 ? inr(total) : "");
  if (!headline && prizes.length === 0) return null;
  return (
    <div className={`rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-white ${compact ? "p-4" : "p-5 sm:p-6"}`}>
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
        <Trophy className="h-4 w-4" /> {title}
      </div>
      {headline && <div className={`mt-1 font-black text-[#002147] ${compact ? "text-2xl" : "text-3xl sm:text-4xl"}`}>{headline}</div>}
      {prizes.length > 0 && (
        <ul className={`mt-3 grid gap-2 ${compact ? "" : "sm:grid-cols-2"}`}>
          {prizes.map((p, i) => (
            <li key={i} className="flex items-start justify-between gap-3 rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-amber-100">
              <div>
                <div className="font-semibold text-slate-800">{p.title}</div>
                {p.description && <div className="text-xs text-slate-500">{p.description}</div>}
              </div>
              {p.amount != null && p.amount > 0 && <div className="shrink-0 font-bold text-[#B45309]">{inr(p.amount)}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
