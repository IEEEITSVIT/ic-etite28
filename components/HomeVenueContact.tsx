import Link from "next/link";
import { MapPin, Navigation, Mail, Phone, Plane, Train, Hotel } from "lucide-react";
import E from "@/components/cms/E";

export default function HomeVenueContact() {
  return (
    <>
      {/* Venue */}
      <section id="venue" className="border-b border-brand-border bg-white scroll-mt-20">
        <div className="container-x py-20 md:py-24">
          <div className="grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-5 space-y-4">
              <p className="text-[12.5px] tracking-wider uppercase text-brand-muted font-semibold"><E f="c.HomeVenueContact">{"Location & Travel"}</E></p>
              <h2 className="font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] text-brand-text"><E f="c.HomeVenueContact">{"Conference Venue"}</E></h2>
              <p className="text-[15px] leading-relaxed text-brand-text/80"><E f="c.HomeVenueContact">{"School of Computer Science Engineering & Information Systems (SCORE)"}</E><br /><E f="c.HomeVenueContact">{"Vellore Institute of Technology"}</E><br /><E f="c.HomeVenueContact">{"Vellore, Tamil Nadu, India — 632014"}</E></p>
              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=Vellore+Institute+of+Technology+Vellore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-xs inline-flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span><E f="c.HomeVenueContact">{"Open in Google Maps"}</E></span>
                </a>
              </div>
            </div>

            <div className="md:col-span-7 grid sm:grid-cols-2 gap-5">
              <div className="bg-brand-surface border border-brand-border rounded-2xl p-6">
                <div className="w-9 h-9 rounded-lg bg-white border border-brand-border grid place-items-center text-[#1D5C82] mb-3">
                  <Plane className="w-4 h-4" />
                </div>
                <h4 className="text-[14px] font-bold text-brand-text"><E f="c.HomeVenueContact">{"Airport Connectivity"}</E></h4>
                <p className="text-[12.5px] text-brand-muted mt-1.5 leading-relaxed"><E f="c.HomeVenueContact">{"Chennai International Airport (MAA) is 130 km away (~2.5 hrs by highway). Bengaluru Airport (BLR) is 200 km away (~3.5 hrs)."}</E></p>
              </div>

              <div className="bg-brand-surface border border-brand-border rounded-2xl p-6">
                <div className="w-9 h-9 rounded-lg bg-white border border-brand-border grid place-items-center text-[#0B6B4A] mb-3">
                  <Train className="w-4 h-4" />
                </div>
                <h4 className="text-[14px] font-bold text-brand-text"><E f="c.HomeVenueContact">{"Rail & Transit"}</E></h4>
                <p className="text-[12.5px] text-brand-muted mt-1.5 leading-relaxed"><E f="c.HomeVenueContact">{"Katpadi Junction Railway Station (KPD) is situated just 3 km from the university campus, with frequent superfast express trains."}</E></p>
              </div>

              <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 sm:col-span-2">
                <div className="flex items-center gap-2 text-[14px] font-bold text-brand-text mb-2">
                  <Hotel className="w-4 h-4 text-brand-text" />
                  <span><E f="c.HomeVenueContact">{"Accommodation & Guest Care"}</E></span>
                </div>
                <p className="text-[12.5px] text-brand-muted leading-relaxed"><E f="c.HomeVenueContact">{"Subsidized on-campus university guest rooms are available on request for registered outstation and foreign delegates. Premium hotels in Vellore city (Fortune Park, Benzz Park, Khanna Fiesta) are located within 5–10 minutes of the campus."}</E></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-b border-brand-border bg-brand-surface scroll-mt-20">
        <div className="container-x py-20 md:py-24">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="text-[12.5px] tracking-wider uppercase text-brand-muted font-semibold mb-2"><E f="c.HomeVenueContact">{"Get in Touch"}</E></p>
            <h2 className="font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] text-brand-text"><E f="c.HomeVenueContact">{"Conference Secretariat"}</E></h2>
            <p className="mt-3 text-[14.5px] text-brand-muted"><E f="c.HomeVenueContact">{"For paper submission, registration invoices, sponsorship packages, and logistics inquiries:"}</E></p>
            <a
              href="mailto:icetiteconference@vit.ac.in"
              className="inline-block mt-4 text-[16px] font-bold text-[#0B6B4A] hover:underline"
            ><E f="c.HomeVenueContact">{"icetiteconference@vit.ac.in"}</E></a>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            <div className="bg-white border border-brand-border rounded-2xl p-6 text-center shadow-sm">
              <p className="text-[14px] font-bold text-brand-text"><E f="c.HomeVenueContact">{"Organizing School"}</E></p>
              <p className="text-[12.5px] text-brand-muted mt-1"><E f="c.HomeVenueContact">{"SCORE"}</E></p>
              <p className="text-[11.5px] text-brand-muted/80 mt-2"><E f="c.HomeVenueContact">{"Vellore Institute of Technology"}</E></p>
            </div>
            <div className="bg-white border border-brand-border rounded-2xl p-6 text-center shadow-sm">
              <p className="text-[14px] font-bold text-brand-text"><E f="c.HomeVenueContact">{"Technical Sponsor"}</E></p>
              <p className="text-[12.5px] text-brand-muted mt-1"><E f="c.HomeVenueContact">{"IEEE"}</E></p>
              <p className="text-[11.5px] text-brand-muted/80 mt-2"><E f="c.HomeVenueContact">{"Institute of Electrical and Electronics Engineers"}</E></p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
