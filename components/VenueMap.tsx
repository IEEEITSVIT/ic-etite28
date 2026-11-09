import Image from "next/image";
import Link from "next/link";
import { conferenceData } from "@/data/conference";
import { Plane, Train, Hotel, ExternalLink, ArrowRight } from "lucide-react";

export default function VenueMap() {
  const { venue } = conferenceData;

  return (
    <section id="venue" className="py-8 sm:py-12 bg-white border-b border-[#E4E7EC]">
      <div className="container-x">
        {/* Campus Overview with Text Wrapped Around Floated Campus Image */}
        <div className="bg-[#FAFBFD] rounded-2xl border-2 border-slate-200/90 p-6 sm:p-8 md:p-10 shadow-sm flow-root mb-8">
          {/* Floated Image on Desktop */}
          <div className="w-full sm:w-[380px] md:w-[460px] lg:w-[500px] md:float-right md:ml-8 md:mb-5 mb-6">
            <div className="p-2.5 bg-white border-2 border-slate-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <Image
                  src="/images/vit-campus.webp"
                  alt="VIT Vellore Main Campus Entrance"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover object-center hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <p className="p-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 font-medium rounded-b-xl mt-2 text-center">
                Vellore Institute of Technology (VIT), Vellore Main Campus Entrance
              </p>
            </div>
          </div>

          {/* Text flowing all around the picture */}
          <div className="space-y-3.5">
            <span className="text-xs font-mono tracking-widest uppercase text-[#004B87] font-bold block">
              Host University Campus &amp; Arrival Guide
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#002147]">
              {venue.name}
            </h3>
            <p className="text-sm sm:text-base font-semibold text-slate-700">
              {venue.department}
            </p>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
              The <strong>Third International Conference on Emerging Trends in Information Technology and Engineering (ic-ETITE’28)</strong> will be hosted at the main campus of Vellore Institute of Technology (VIT) in Vellore, Tamil Nadu, India. Spanning 372 lush acres, the campus is globally renowned for its state-of-the-art academic infrastructure, smart classrooms, and world-class conference halls.
            </p>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
              All plenary keynote sessions and inaugural ceremonies will take place in the distinguished <strong>Anna Auditorium</strong>, with technical paper presentations held in the adjacent state-of-the-art lecture complexes of the <strong>Silver Jubilee Tower (SJT)</strong>. The venue provides high-speed campus Wi-Fi, audio-visual conference equipment, bilingual support desks, and dining pavilions for registered delegates.
            </p>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
              VIT Vellore is situated immediately adjacent to <strong>Katpadi Junction Railway Station (just 3 km away)</strong>, with rapid expressway connectivity to both Chennai International Airport (MAA, ~130 km) and Bengaluru Kempegowda International Airport (BLR, ~215 km).
            </p>

            <div className="p-4 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 space-y-1 shadow-2xs">
              <p className="font-bold text-[#002147]">Official Postal Address:</p>
              <p className="text-slate-700 leading-relaxed">{venue.fullAddress}</p>
              <p className="text-slate-500 font-mono text-xs pt-0.5">
                GPS Coordinates: 12.9698° N, 79.1559° E · Katpadi Junction: ~3 km (10 mins)
              </p>
            </div>
          </div>

          <div className="clear-both pt-4 flex flex-wrap gap-3">
            <a
              href={venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm py-2.5 px-5 inline-flex items-center gap-2 font-bold"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <Link
              href="/hotels"
              className="btn-outline text-sm py-2.5 px-5 inline-flex items-center gap-2 font-semibold"
            >
              <span>Hotels &amp; Accommodation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Travel Guidance Cards */}
        <div className="grid sm:grid-cols-3 gap-5">
          {/* Airport Connectivity */}
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 flex flex-col justify-between shadow-xs hover:border-[#002147] transition-all">
            <div>
              <div className="w-11 h-11 rounded-xl bg-slate-100 text-[#004B87] grid place-items-center border border-slate-200 mb-3.5">
                <Plane className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-[#002147] text-lg">Nearest Airports</h4>
              <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed font-normal">
                Chennai International Airport (MAA) ~130 km (2.5 hours drive) and Kempegowda International Airport
                Bengaluru (BLR) ~215 km (3.5 hours drive). Taxis and express buses are readily accessible.
              </p>
            </div>
          </div>

          {/* Railway Station */}
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 flex flex-col justify-between shadow-xs hover:border-[#002147] transition-all">
            <div>
              <div className="w-11 h-11 rounded-xl bg-slate-100 text-[#002147] grid place-items-center border border-slate-200 mb-3.5">
                <Train className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-[#002147] text-lg">Katpadi Railway Junction</h4>
              <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed font-normal">
                Katpadi Junction (KPD) is located just 3 km from the VIT Vellore campus. High-speed intercity express
                trains connect Katpadi directly to Chennai, Bengaluru, Hyderabad, and Delhi.
              </p>
            </div>
          </div>

          {/* Accommodation Advisory */}
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 flex flex-col justify-between shadow-xs hover:border-[#002147] transition-all">
            <div>
              <div className="w-11 h-11 rounded-xl bg-slate-100 text-[#F5A623] grid place-items-center border border-slate-200 mb-3.5">
                <Hotel className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-[#002147] text-lg">Accommodation Guidance</h4>
              <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed font-normal">
                Partnered hotels in Vellore city (Fortune Park, Benzz Park, Regency Sameera) are within 5–10 minutes of campus.
                University guest house rooms are reserved for keynote dignitaries.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100">
              <Link
                href="/hotels"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#004B87] hover:text-[#002147] hover:underline"
              >
                <span>View Recommended Hotels &amp; Tariffs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
