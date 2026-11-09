import { conferenceData } from "@/data/conference";
import { Award, CheckCircle2, TrendingUp } from "lucide-react";
import E from "@/components/cms/E";

export default function VitRankings() {
  const { rankings } = conferenceData;

  return (
    <section className="py-16 sm:py-20 bg-[#f7f5f0] border-b border-[#e8e4dc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 pb-6 border-b border-[#e8e4dc]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-px bg-[#137547]" />
              <span className="font-mono text-[11px] tracking-widest uppercase text-[#137547]"><E f="c.VitRankings">{"Institutional Standing"}</E></span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1714] tracking-tight"><E f="c.VitRankings">{"Rankings & Accreditations"}</E></h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6b6560] max-w-md"><E f="c.VitRankings">{"Vellore Institute of Technology is consistently recognized by premier international and national evaluation agencies."}</E></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rankings.map((rank) => (
            <div
              key={rank.agency}
              className="p-6 rounded-xl bg-white border border-[#e8e4dc] shadow-subtle flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[#9c968f] mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider">
                    <E f="c.VitRankings">{rank.agency}</E>
                  </span>
                  <Award className="w-4 h-4 text-[#137547]" />
                </div>
                <h3 className="text-base font-bold text-[#1a1714] mt-1 leading-snug">
                  <E f="c.VitRankings">{rank.highlight}</E>
                </h3>
              </div>

              <p className="text-xs text-[#6b6560] mt-4 pt-3 border-t border-[#f0ede7] leading-relaxed">
                <E f="c.VitRankings">{rank.details}</E>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
