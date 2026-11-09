"use client";

import { useState, useMemo } from "react";
import { hotelsData, Hotel } from "@/data/hotels";
import {
  Search,
  MapPin,
  Phone,
  ExternalLink,
  Star,
  CheckCircle2,
  ShieldCheck,
  SlidersHorizontal,
  Wifi,
  Sparkles,
  ArrowRight,
  Car,
  Clock,
  Compass,
  Building,
  Heart,
  ChevronDown,
} from "lucide-react";
import E from "@/components/cms/E";

export default function HotelBookingDirectory({ hotels = hotelsData }: { hotels?: Hotel[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("distance");
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [savedHotels, setSavedHotels] = useState<string[]>([]);

  const toggleSave = (id: string) => {
    setSavedHotels((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredHotels = useMemo(() => {
    return hotels
      .filter((hotel) => {
        // Category filter
        if (activeCategory !== "all" && hotel.category !== activeCategory) {
          return false;
        }

        // Verified filter
        if (onlyVerified && !hotel.verifiedByVit) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const matchName = hotel.name.toLowerCase().includes(q);
          const matchArea = hotel.area.toLowerCase().includes(q);
          const matchAddress = hotel.address.toLowerCase().includes(q);
          const matchAmenity = hotel.amenities.some((a) => a.toLowerCase().includes(q));
          if (!matchName && !matchArea && !matchAddress && !matchAmenity) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "distance") {
          return a.distanceKm - b.distanceKm;
        }
        if (sortBy === "rating") {
          return b.rating - a.rating;
        }
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [hotels, activeCategory, searchQuery, sortBy, onlyVerified]);

  const categories = [
    { id: "all", label: "All Stays", count: hotels.length, icon: Building },
    {
      id: "closest",
      label: "Closest to VIT (< 2 km)",
      count: hotels.filter((h) => h.category === "closest").length,
      icon: Compass,
    },
    {
      id: "luxury",
      label: "Luxury & Star Rating",
      count: hotels.filter((h) => h.category === "luxury").length,
      icon: Sparkles,
    },
    {
      id: "transit",
      label: "Green Circle & Transit",
      count: hotels.filter((h) => h.category === "transit").length,
      icon: Car,
    },
    {
      id: "city",
      label: "City Center & Heritage",
      count: hotels.filter((h) => h.category === "city").length,
      icon: MapPin,
    },
  ];

  return (
    <section id="directory" className="space-y-8 scroll-mt-24">
      {/* ── TOP STATS BAR (OYO / BOOKING METRICS) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-red-50 text-[#EE2A24] flex items-center justify-center shrink-0 font-black text-lg">
            <E f="c.HotelBookingDirectory">{hotels.length}</E>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500"><E f="c.HotelBookingDirectory">{"Verified Stays"}</E></p>
            <p className="text-sm sm:text-base font-extrabold text-brand-primary"><E f="c.HotelBookingDirectory">{"Hotels & Residencies"}</E></p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500"><E f="c.HotelBookingDirectory">{"Proximity"}</E></p>
            <p className="text-sm sm:text-base font-extrabold text-brand-primary"><E f="c.HotelBookingDirectory">{"200m to 5.5 km"}</E></p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-brand-secondary flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500"><E f="c.HotelBookingDirectory">{"Directory Source"}</E></p>
            <p className="text-sm sm:text-base font-extrabold text-brand-primary"><E f="c.HotelBookingDirectory">{"Official VIT Directory"}</E></p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500"><E f="c.HotelBookingDirectory">{"Direct Contact"}</E></p>
            <p className="text-sm sm:text-base font-extrabold text-brand-primary"><E f="c.HotelBookingDirectory">{"Verified Phone Numbers"}</E></p>
          </div>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLLER ── */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 sm:p-7 shadow-sm space-y-5">
        {/* Main Search Input & Sort Strip */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by hotel name, area (e.g. Katpadi, Green Circle, Gandhi Nagar)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-medium focus:bg-white focus:border-brand-secondary focus:outline-none focus:ring-4 focus:ring-brand-secondary/10 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-200/60 hover:bg-slate-200 rounded-full px-2 py-0.5"
              ><E f="c.HotelBookingDirectory">{"Clear"}</E></button>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider hidden sm:inline"><E f="c.HotelBookingDirectory">{"Sort by:"}</E></span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-bold text-brand-primary focus:outline-none cursor-pointer"
              >
                <option value="distance">Distance from VIT (Closest)</option>
                <option value="rating">Rating (Highest First)</option>
                <option value="name">Hotel Name (A–Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills (Like OYO/Agoda filter badges) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? "bg-brand-primary text-white shadow-md scale-[1.02]"
                    : "bg-slate-100/80 hover:bg-slate-200/80 text-slate-700"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-brand-accent" : "text-slate-500"}`} />
                <span><E f="c.HotelBookingDirectory">{cat.label}</E></span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActive ? "bg-white/20 text-white" : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  <E f="c.HotelBookingDirectory">{cat.count}</E>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── HOTEL LISTING COUNT & ACTIVE SUMMARY ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
        <p className="text-sm font-bold text-slate-700"><E f="c.HotelBookingDirectory">{"Showing "}</E><span className="text-brand-primary font-black"><E f="c.HotelBookingDirectory">{filteredHotels.length}</E></span><E f="c.HotelBookingDirectory">{" accommodation options in Vellore"}</E>{searchQuery && <span><E f="c.HotelBookingDirectory">{" matching “"}</E><E f="c.HotelBookingDirectory">{searchQuery}</E><E f="c.HotelBookingDirectory">{"”"}</E></span>}
        </p>
        <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" /><E f="c.HotelBookingDirectory">{"Prioritizes direct hotel booking pages and verified contact desks"}</E></span>
      </div>

      {/* ── HOTEL CARDS LIST (OYO & BOOKING.COM INSPRED COMPACT LAYOUT) ── */}
      <div className="space-y-5">
        {filteredHotels.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-300 space-y-4">
            <Building className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-xl font-bold text-brand-primary"><E f="c.HotelBookingDirectory">{"No hotels matched your search"}</E></h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto"><E f="c.HotelBookingDirectory">{"Try adjusting your search query or selecting “All Stays” to browse all 26 verified accommodations in Vellore."}</E></p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="btn-primary text-xs py-2.5 px-6 rounded-xl font-bold"
            ><E f="c.HotelBookingDirectory">{"Reset Filters"}</E></button>
          </div>
        ) : (
          filteredHotels.map((hotel) => {
            const isSaved = savedHotels.includes(hotel.id);
            const isWalking = hotel.distanceKm < 1.0;
            const isVeryClose = hotel.distanceKm <= 2.0;

            return (
              <div
                key={hotel.id}
                className="bg-white rounded-3xl border-2 border-slate-200 hover:border-brand-secondary hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Left Column: Visual Brand Card with Badge & Image Fallback */}
                  <div className="lg:col-span-4 bg-gradient-to-br from-brand-primary-dark via-brand-primary to-brand-primary-hover text-white p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden">
                    {/* Background Pattern */}
                    <div
                      className="absolute inset-0 opacity-10 pointer-events-none"
                      style={{
                        backgroundImage:
                          "radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    />

                    {/* Top Row: Badge & Save Heart */}
                    <div className="relative z-10 flex items-start justify-between gap-2 mb-4">
                      {hotel.badge ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-brand-accent text-brand-primary shadow-sm">
                          <Sparkles className="w-3 h-3 fill-brand-primary" />
                          <span><E f="c.HotelBookingDirectory">{hotel.badge}</E></span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/15 text-white border border-white/20">
                          <E f="c.HotelBookingDirectory">{hotel.categoryLabel}</E>
                        </span>
                      )}

                      <button
                        onClick={() => toggleSave(hotel.id)}
                        className={`p-2 rounded-full border transition-all ${
                          isSaved
                            ? "bg-red-500/20 border-red-500 text-red-400"
                            : "bg-white/10 hover:bg-white/20 border-white/20 text-white/80"
                        }`}
                        title={isSaved ? "Saved to shortlist" : "Save to shortlist"}
                        aria-label="Save hotel"
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? "fill-red-400 text-red-400" : ""}`} />
                      </button>
                    </div>

                    {/* Middle: Key Distance Indicator (OYO / Booking highlight) */}
                    <div className="relative z-10 space-y-2 py-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-slate-200">
                        {isWalking ? (
                          <span className="font-bold text-[#84E320] flex items-center gap-1">
                            <span><E f="c.HotelBookingDirectory">{"🚶 Walking Distance"}</E></span>
                          </span>
                        ) : (
                          <span className="font-bold text-brand-accent flex items-center gap-1">
                            <Car className="w-3.5 h-3.5" />
                            <span><E f="c.HotelBookingDirectory">{hotel.distanceKm}</E><E f="c.HotelBookingDirectory">{" km from VIT"}</E></span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-snug">
                        <E f="c.HotelBookingDirectory">{hotel.distanceFromVit}</E>
                      </p>
                    </div>

                    {/* Bottom: Review & Star Pill */}
                    <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-xs shadow-sm">
                          <span>{hotel.rating.toFixed(1)}</span>
                          <Star className="w-3 h-3 fill-white" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white"><E f="c.HotelBookingDirectory">{hotel.ratingText}</E></p>
                          <p className="text-[10px] text-slate-300 font-medium"><E f="c.HotelBookingDirectory">{"("}</E><E f="c.HotelBookingDirectory">{hotel.reviewCount}</E><E f="c.HotelBookingDirectory">{" verified reviews)"}</E></p>
                        </div>
                      </div>

                      <span className="text-[11px] font-bold text-slate-300 bg-white/10 px-2.5 py-1 rounded-lg">
                        <E f="c.HotelBookingDirectory">{hotel.priceRange}</E><E f="c.HotelBookingDirectory">{" Comfort"}</E></span>
                    </div>
                  </div>

                  {/* Middle Column: Detailed Information & Amenities */}
                  <div className="lg:col-span-5 p-6 sm:p-7 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Area pill & verified checkmark */}
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold text-brand-secondary uppercase tracking-wide">
                          <E f="c.HotelBookingDirectory">{hotel.area}</E>
                        </span>
                        {hotel.verifiedByVit && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /><E f="c.HotelBookingDirectory">{"VIT Directory Verified"}</E></span>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-brand-primary group-hover:text-brand-secondary transition-colors leading-snug">
                        <E f="c.HotelBookingDirectory">{hotel.name}</E>
                      </h3>

                      {/* Full Address */}
                      <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed flex items-start gap-1.5 font-normal">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <span><E f="c.HotelBookingDirectory">{hotel.address}</E></span>
                      </p>
                    </div>

                    {/* Amenities Chip List (OYO Style) */}
                    <div className="space-y-2 pt-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400"><E f="c.HotelBookingDirectory">{"Popular Amenities:"}</E></p>
                      <div className="flex flex-wrap gap-1.5">
                        {hotel.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200"
                          >
                            <E f="c.HotelBookingDirectory">{amenity}</E>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Pricing, Phone & Direct Booking Action CTA */}
                  <div className="lg:col-span-3 bg-brand-surface p-6 sm:p-7 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between space-y-5">
                    <div>
                      <div className="flex items-baseline justify-between lg:block">
                        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold"><E f="c.HotelBookingDirectory">{"Estimated Conference Tariff:"}</E></p>
                        <p className="text-xl sm:text-2xl font-black text-brand-primary mt-0.5">
                          <E f="c.HotelBookingDirectory">{hotel.estPrice}</E>
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5"><E f="c.HotelBookingDirectory">{"Per room / night approx. (subject to availability)"}</E></p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-200">
                      {/* Direct Phone Call Button */}
                      <a
                        href={`tel:${hotel.phone.replace(/[^0-9+]/g, "")}`}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-brand-primary text-xs sm:text-sm font-bold text-brand-primary transition-all shadow-2xs"
                      >
                        <Phone className="w-3.5 h-3.5 text-brand-secondary" />
                        <span className="truncate"><E f="c.HotelBookingDirectory">{hotel.phone}</E></span>
                      </a>

                      {/* Primary Online Booking CTA */}
                      <a
                        href={hotel.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-xs sm:text-sm text-white transition-all shadow-md hover:scale-[1.02] ${
                          hotel.bookingType === "Official booking" || hotel.bookingType === "Official website"
                            ? "bg-gradient-to-r from-[#EE2A24] to-[#C91A15] hover:from-[#C91A15] hover:to-[#B01410]"
                            : hotel.bookingType === "Booking.com"
                            ? "bg-[#003580] hover:bg-[#00224f]"
                            : "bg-brand-primary hover:bg-brand-primary-hover"
                        }`}
                      >
                        <span>
                          {hotel.bookingType === "Official booking"
                            ? "Official Booking ↗"
                            : hotel.bookingType === "Official website"
                            ? "Hotel Website ↗"
                            : hotel.bookingType === "Booking.com"
                            ? "Book on Booking.com ↗"
                            : "Find Booking Deals ↗"}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <p className="text-[10px] text-center text-slate-400 font-medium"><E f="c.HotelBookingDirectory">{"Instant confirmation · Direct reservation"}</E></p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
