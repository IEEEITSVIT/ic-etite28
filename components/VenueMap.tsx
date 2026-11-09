import Image from "@/components/cms/EImage";
import Link from "next/link";
import { conferenceData } from "@/data/conference";
import { Plane, Train, Hotel, ExternalLink, ArrowRight } from "lucide-react";
import E from "@/components/cms/E";

export default function VenueMap() {
  const { venue } = conferenceData;

  return (
    <section id="venue" className="py-8 sm:py-12 bg-white border-b border-brand-border">
      <div className="container-x">
        {/* Campus Overview with Text Wrapped Around Floated Campus Image */}
        <div className="bg-brand-surface rounded-2xl border-2 border-slate-200/90 p-6 sm:p-8 md:p-10 shadow-sm flow-root mb-8">
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
              <p className="p-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 font-medium rounded-b-xl mt-2 text-center"><E f="c.VenueMap">{"Vellore Institute of Technology (VIT), Vellore Main Campus Entrance"}</E></p>
            </div>
          </div>

          {/* Text flowing all around the picture */}
          <div className="space-y-3.5">
            <span className="text-xs font-mono tracking-widest uppercase text-brand-secondary font-bold block"><E f="c.VenueMap">{"Host University Campus & Arrival Guide"}</E></span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-brand-primary">
              <E f="c.VenueMap">{venue.name}</E>
            </h3>
            <p className="text-sm sm:text-base font-semibold text-slate-700">
              <E f="c.VenueMap">{venue.department}</E>
            </p>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify"><E f="c.VenueMap">{"The "}</E><strong><E f="c.VenueMap">{"Third International Conference on Emerging Trends in Information Technology and Engineering (ic-ETITE’28)"}</E></strong><E f="c.VenueMap">{" will be hosted at the main campus of Vellore Institute of Technology (VIT) in Vellore, Tamil Nadu, India. Spanning 372 lush acres, the campus is globally renowned for its state-of-the-art academic infrastructure, smart classrooms, and world-class conference halls."}</E></p>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify"><E f="c.VenueMap">{"All plenary keynote sessions and inaugural ceremonies will take place in the distinguished "}</E><strong><E f="c.VenueMap">{"Anna Auditorium"}</E></strong><E f="c.VenueMap">{", with technical paper presentations held in the adjacent state-of-the-art lecture complexes of the "}</E><strong><E f="c.VenueMap">{"Silver Jubilee Tower (SJT)"}</E></strong><E f="c.VenueMap">{". The venue provides high-speed campus Wi-Fi, audio-visual conference equipment, bilingual support desks, and dining pavilions for registered delegates."}</E></p>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify"><E f="c.VenueMap">{"VIT Vellore is situated immediately adjacent to "}</E><strong><E f="c.VenueMap">{"Katpadi Junction Railway Station (just 3 km away)"}</E></strong><E f="c.VenueMap">{", with rapid expressway connectivity to both Chennai International Airport (MAA, ~130 km) and Bengaluru Kempegowda International Airport (BLR, ~215 km)."}</E></p>

            <div className="p-4 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 space-y-1 shadow-2xs">
              <p className="font-bold text-brand-primary"><E f="c.VenueMap">{"Official Postal Address:"}</E></p>
              <p className="text-slate-700 leading-relaxed"><E f="c.VenueMap">{venue.fullAddress}</E></p>
              <p className="text-slate-500 font-mono text-xs pt-0.5"><E f="c.VenueMap">{"GPS Coordinates: 12.9698° N, 79.1559° E · Katpadi Junction: ~3 km (10 mins)"}</E></p>
            </div>
          </div>

          <div className="clear-both pt-4 flex flex-wrap gap-3">
            <a
              href={venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm py-2.5 px-5 inline-flex items-center gap-2 font-bold"
            >
              <span><E f="c.VenueMap">{"Open in Google Maps"}</E></span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <Link
              href="/hotels"
              className="btn-outline text-sm py-2.5 px-5 inline-flex items-center gap-2 font-semibold"
            >
              <span><E f="c.VenueMap">{"Hotels & Accommodation"}</E></span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Travel Guidance Cards */}
        <div className="grid sm:grid-cols-3 gap-5">
          {/* Airport Connectivity */}
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 flex flex-col justify-between shadow-xs hover:border-brand-primary transition-all">
            <div>
              <div className="w-11 h-11 rounded-xl bg-slate-100 text-brand-secondary grid place-items-center border border-slate-200 mb-3.5">
                <Plane className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-brand-primary text-lg"><E f="c.VenueMap">{"Nearest Airports"}</E></h4>
              <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed font-normal"><E f="c.VenueMap">{"Chennai International Airport (MAA) ~130 km (2.5 hours drive) and Kempegowda International Airport Bengaluru (BLR) ~215 km (3.5 hours drive). Taxis and express buses are readily accessible."}</E></p>
            </div>
          </div>

          {/* Railway Station */}
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 flex flex-col justify-between shadow-xs hover:border-brand-primary transition-all">
            <div>
              <div className="w-11 h-11 rounded-xl bg-slate-100 text-brand-primary grid place-items-center border border-slate-200 mb-3.5">
                <Train className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-brand-primary text-lg"><E f="c.VenueMap">{"Katpadi Railway Junction"}</E></h4>
              <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed font-normal"><E f="c.VenueMap">{"Katpadi Junction (KPD) is located just 3 km from the VIT Vellore campus. High-speed intercity express trains connect Katpadi directly to Chennai, Bengaluru, Hyderabad, and Delhi."}</E></p>
            </div>
          </div>

          {/* Accommodation Advisory */}
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 flex flex-col justify-between shadow-xs hover:border-brand-primary transition-all">
            <div>
              <div className="w-11 h-11 rounded-xl bg-slate-100 text-brand-accent-dark grid place-items-center border border-slate-200 mb-3.5">
                <Hotel className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-brand-primary text-lg"><E f="c.VenueMap">{"Accommodation Guidance"}</E></h4>
              <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed font-normal"><E f="c.VenueMap">{"Partnered hotels in Vellore city (Fortune Park, Benzz Park, Regency Sameera) are within 5–10 minutes of campus. University guest house rooms are reserved for keynote dignitaries."}</E></p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100">
              <Link
                href="/hotels"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-secondary hover:text-brand-primary hover:underline"
              >
                <span><E f="c.VenueMap">{"View Recommended Hotels & Tariffs"}</E></span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
