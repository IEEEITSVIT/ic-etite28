"use client";


import {
  internationalAdvisoryData,
  nationalAdvisoryData,
  technicalCommitteeData,
} from "@/data/advisory";

export default function AdvisoryPage() {
  // Helper to deduplicate committee members by normalized name
  const dedupe = <T extends { name: string }>(list: T[], excludeSet?: Set<string>): T[] => {
    const seen = new Set<string>();
    return list.filter((m) => {
      const norm = m.name.toLowerCase().replace(/^(dr\.|prof\.|mr\.|ms\.|mrs\.)\s*/, "").replace(/[^a-z]/g, "").trim();
      if (seen.has(norm) || (excludeSet && excludeSet.has(norm))) return false;
      seen.add(norm);
      return true;
    });
  };

  const cleanIntl = dedupe(internationalAdvisoryData);
  const intlNameSet = new Set(cleanIntl.map((m) => m.name.toLowerCase().replace(/^(dr\.|prof\.|mr\.|ms\.|mrs\.)\s*/, "").replace(/[^a-z]/g, "").trim()));
  const cleanNat = dedupe(nationalAdvisoryData, intlNameSet);
  const natNameSet = new Set(cleanNat.map((m) => m.name.toLowerCase().replace(/^(dr\.|prof\.|mr\.|ms\.|mrs\.)\s*/, "").replace(/[^a-z]/g, "").trim()));
  const combinedSet = new Set<string>();
  intlNameSet.forEach((n) => combinedSet.add(n));
  natNameSet.forEach((n) => combinedSet.add(n));
  const cleanTech = dedupe(technicalCommitteeData, combinedSet);

  return (
    <div className="bg-white min-h-screen text-[#1A1A1A] py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#004B87] tracking-tight mb-10 sm:mb-12">
          Advisory Board &amp; Technical Committee
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-10">
          
          {/* International Advisory */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#004B87] tracking-tight">
              International Advisory Board
            </h2>
            <div className="space-y-2 pt-1">
              {cleanIntl.map((m) => (
                <div key={`${m.name}-${m.institution}`} className="text-[15px] sm:text-[15.5px] leading-relaxed text-[#222]">
                  <span className="font-bold text-black">{m.name}</span>
                  {m.institution ? `, ${m.institution}` : ""}
                  {m.country ? `, ${m.country}` : ""}
                </div>
              ))}
            </div>
          </section>

          {/* National Advisory & Technical */}
          <div className="space-y-10">
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#004B87] tracking-tight">
                National Advisory Board
              </h2>
              <div className="space-y-2 pt-1">
                {cleanNat.map((m) => (
                  <div key={`${m.name}-${m.institution}`} className="text-[15px] sm:text-[15.5px] leading-relaxed text-[#222]">
                    <span className="font-bold text-black">{m.name}</span>
                    {m.institution ? `, ${m.institution}` : ""}
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#004B87] tracking-tight">
                Technical Programme Committee
              </h2>
              <div className="space-y-2 pt-1">
                {cleanTech.map((m) => (
                  <div key={`${m.name}-${m.institution}`} className="text-[15px] sm:text-[15.5px] leading-relaxed text-[#222]">
                    <span className="font-bold text-black">{m.name}</span>
                    {m.institution ? `, ${m.institution}` : ""}
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>

      </div>
    </div>
  );
}
