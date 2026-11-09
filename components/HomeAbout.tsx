import E from "@/components/cms/E";
import Link from "next/link";
import Image from "@/components/cms/EImage";

export default function HomeAbout() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">

          {/* Text */}
          <div className="flex flex-col justify-center">
            <p className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-3"><E f="c.HomeAbout">{"About The Conference"}</E></p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-5 leading-tight"><E f="c.HomeAbout">{"ic-ETITE'28 — Emerging Trends in IT & Engineering"}</E></h2>
            <p className="text-gray-600 text-base leading-relaxed mb-4"><E f="c.HomeAbout">{"The Third International Conference on Emerging Trends in Information Technology and Engineering (ic-ETITE'28) is organized by the "}</E><strong><E f="c.HomeAbout">{"School of Computer Science Engineering and Information Systems (SCORE)"}</E></strong><E f="c.HomeAbout">{", Vellore Institute of Technology, Vellore."}</E></p>
            <p className="text-gray-600 text-base leading-relaxed mb-6"><E f="c.HomeAbout">{"The conference provides an international platform for researchers, academicians, engineers, industrialists, and students to share findings in Science and Technology. All accepted papers will be published in "}</E><strong><E f="c.HomeAbout">{"IEEE Xplore"}</E></strong><E f="c.HomeAbout">{"."}</E></p>

            {/* SCORE highlight */}
            <div className="bg-blue-50 border-l-4 border-blue-600 rounded-r-lg p-4 mb-6">
              <p className="text-blue-800 font-bold text-sm mb-1"><E f="c.HomeAbout">{"🏛 Organized by SCORE, VIT Vellore"}</E></p>
              <p className="text-blue-700 text-sm"><E f="c.HomeAbout">{"School of Computer Science Engineering & Information Systems — 5,900+ students, 188+ faculty, NAAC A++ rated."}</E></p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/about" className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2.5 px-5 rounded text-sm transition-all"><E f="c.HomeAbout">{"Learn More About Conference"}</E></Link>
              <Link href="/call-for-papers" className="border-2 border-blue-700 text-blue-700 hover:bg-blue-50 font-bold py-2.5 px-5 rounded text-sm transition-all"><E f="c.HomeAbout">{"Call for Papers"}</E></Link>
            </div>
          </div>

          {/* 2024 conference photo: Fills full height */}
          <div className="flex flex-col">
            <div className="rounded-xl overflow-hidden shadow-lg bg-gray-100 flex-1 relative min-h-[360px] sm:min-h-[420px]">
              <Image
                src="/images/ic-etite24.webp"
                alt="ic-ETITE'24 conference session"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-5 pb-4 pt-16 z-10">
                <p className="text-white font-semibold text-sm"><E f="c.HomeAbout">{"ic-ETITE'24"}</E></p>
                <p className="text-white/75 text-xs mt-1"><E f="c.HomeAbout">{"Conference session, VIT Vellore"}</E></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
