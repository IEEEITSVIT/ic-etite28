import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { conferenceData } from "@/data/conference";
import { Mail, MapPin, Building2, Phone, ArrowRight, ExternalLink } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import E from "@/components/cms/E";

export const metadata: Metadata = pageMetadata("/contact", {
  title: "Contact Conference Secretariat | ic-ETITE'28",
  description:
    "Official contact directory for ic-ETITE'28 at Vellore Institute of Technology, School of Computer Science Engineering & Information Systems (SCORE).",
});

const leadershipContacts = [
  {
    role: "Conference Chair",
    name: "Dr. John Singh. K",
    designation: "Professor",
    email: "johnsingh.k@vit.ac.in",
    phone: "+919442451035",
  },
  {
    role: "Publication Chair",
    name: "Dr. Vijayan. R",
    designation: "Associate Professor",
    email: "rvijayan@vit.ac.in",
    phone: "+919842350596",
  },
  {
    role: "Finance Chair",
    name: "Dr. Priya M",
    designation: "Associate Professor",
    email: "priya.m@vit.ac.in",
    phone: "+919994628305",
  },
];

export default function ContactPage() {
  const { contact, venue } = conferenceData;

  return (
    <div className="bg-white min-h-screen text-brand-primary">
      <PageHeader
        badge="Secretariat & Communications Desk"
        title="Contact Conference Secretariat"
        subtitle="For inquiries regarding paper submissions, track scopes, delegate registrations, and official visa facilitation letters, please reach out to our team."
        breadcrumb="Contact"
        bgImage="/images/frame_.webp"
      />

      <div className="container-x py-8 sm:py-12 space-y-6 sm:space-y-8">
        {/* Top: 3-Column Secretariat Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {/* Card 1: Primary Electronic Mail */}
          <div className="bg-brand-surface p-7 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-sm flex flex-col justify-between hover:border-brand-primary transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center mb-5 shadow-sm">
                <Mail className="w-6 h-6 text-brand-accent" />
              </div>
              <span className="text-xs font-mono font-bold tracking-wider text-brand-secondary uppercase block mb-1"><E f="contact">{"Central Inquiry Desk"}</E></span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-primary mb-3"><E f="contact">{"Official Email"}</E></h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal"><E f="contact">{"All paper submission queries, registration confirmations, and technical program concerns are addressed via this central inbox."}</E></p>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <a
                href={`mailto:${contact.email}`}
                className="w-full btn-primary text-sm py-3 px-4 flex items-center justify-center gap-2 rounded-xl text-center font-bold"
              >
                <Mail className="w-4 h-4 text-brand-accent" />
                <span className="truncate"><E f="contact">{contact.email}</E></span>
              </a>
            </div>
          </div>

          {/* Card 2: Academic Department & Organization */}
          <div className="bg-brand-surface p-7 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-sm flex flex-col justify-between hover:border-brand-primary transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center mb-5 shadow-sm">
                <Building2 className="w-6 h-6 text-brand-accent" />
              </div>
              <span className="text-xs font-mono font-bold tracking-wider text-brand-secondary uppercase block mb-1"><E f="contact">{"Academic Secretariat"}</E></span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-primary mb-3"><E f="contact">{"Organizing School"}</E></h2>
              <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="text-[11px] font-bold text-slate-500 uppercase"><E f="contact">{"School / Dept"}</E></p>
                  <p className="font-semibold text-brand-primary mt-0.5"><E f="contact">{contact.organizer}</E></p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="text-[11px] font-bold text-slate-500 uppercase"><E f="contact">{"Institution"}</E></p>
                  <p className="font-semibold text-brand-primary mt-0.5"><E f="contact">{contact.institution}</E></p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="text-[11px] font-bold text-slate-500 uppercase"><E f="contact">{"Student Chapter"}</E></p>
                  <p className="font-semibold text-brand-primary mt-0.5"><E f="contact">{"IEEE Information Theory Society, VIT"}</E></p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 mt-6">
              <a
                href="https://vit.ac.in/schools/school-of-computer-science-engineering-and-information-systems"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-semibold text-brand-secondary hover:underline inline-flex items-center gap-1.5"
              >
                <span><E f="contact">{"Visit School Portal"}</E></span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 3: Host Campus Address */}
          <div className="bg-brand-surface p-7 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-sm flex flex-col justify-between hover:border-brand-primary transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center mb-5 shadow-sm">
                <MapPin className="w-6 h-6 text-brand-accent" />
              </div>
              <span className="text-xs font-mono font-bold tracking-wider text-brand-secondary uppercase block mb-1"><E f="contact">{"Conference Venue"}</E></span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-primary mb-3"><E f="contact">{"Campus Location"}</E></h2>
              <p className="text-sm text-slate-700 leading-relaxed font-normal mb-4">
                <E f="contact">{venue.fullAddress}</E>
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
                <span className="font-bold text-brand-primary"><E f="contact">{"City:"}</E></span><E f="contact">{" Vellore, Tamil Nadu, India · "}</E><span className="font-bold text-brand-primary"><E f="contact">{"PIN:"}</E></span><E f="contact">{" 632014"}</E></div>
            </div>

            <div className="pt-4 border-t border-slate-200 mt-6">
              <Link
                href="/venue"
                className="btn-outline w-full text-xs sm:text-sm py-2.5 px-4 flex items-center justify-center gap-2 rounded-xl text-center font-bold"
              >
                <span><E f="contact">{"Campus Venue & Travel Guide"}</E></span>
                <ArrowRight className="w-4 h-4 text-brand-primary" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom: Key Leadership Committee Contacts Table */}
        <section className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 md:p-10">
          <div className="max-w-2xl mb-8">
            <span className="text-xs sm:text-sm font-bold text-brand-primary uppercase tracking-wider bg-[#FFF4DB] px-3.5 py-1.5 rounded-full border border-brand-accent-dark/50 inline-block mb-3"><E f="contact">{"Direct Secretariat Contact Desk"}</E></span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-brand-primary"><E f="contact">{"Contact Us — Key Committee Contacts"}</E></h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2"><E f="contact">{"Reach out directly to the respective conference leadership chairs for academic, publication, and financial queries."}</E></p>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border-2 border-slate-200 shadow-xs">
            <table className="w-full text-left text-sm sm:text-base border-collapse">
              <thead>
                <tr className="bg-brand-primary text-white">
                  <th scope="col" className="py-4 px-6 font-bold"><E f="contact">{"Role"}</E></th>
                  <th scope="col" className="py-4 px-6 font-bold"><E f="contact">{"Name"}</E></th>
                  <th scope="col" className="py-4 px-6 font-bold"><E f="contact">{"Designation"}</E></th>
                  <th scope="col" className="py-4 px-6 font-bold"><E f="contact">{"Email"}</E></th>
                  <th scope="col" className="py-4 px-6 font-bold"><E f="contact">{"Phone Number"}</E></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-900">
                {leadershipContacts.map((c, idx) => (
                  <tr
                    key={c.role}
                    className={`hover:bg-[#FFFDF7] transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/70"
                    }`}
                  >
                    <td className="py-4 px-6 font-bold text-brand-primary whitespace-nowrap">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-brand-primary/5 border border-brand-primary/15 text-xs font-bold text-brand-primary">
                        <E f="contact">{c.role}</E>
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-brand-primary whitespace-nowrap">
                      <E f="contact">{c.name}</E>
                    </td>
                    <td className="py-4 px-6 text-slate-700 font-medium whitespace-nowrap">
                      <E f="contact">{c.designation}</E>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <a
                        href={`mailto:${c.email}`}
                        className="font-medium text-sm sm:text-base text-brand-secondary hover:underline inline-flex items-center gap-1.5"
                      >
                        <Mail className="w-4 h-4 text-brand-secondary" />
                        <span><E f="contact">{c.email}</E></span>
                      </a>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap font-mono text-sm sm:text-base">
                      <a
                        href={`tel:${c.phone}`}
                        className="text-slate-800 hover:text-brand-secondary hover:underline inline-flex items-center gap-1.5 font-medium"
                      >
                        <Phone className="w-4 h-4 text-brand-accent-dark" />
                        <span><E f="contact">{c.phone}</E></span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-4">
            {leadershipContacts.map((c) => (
              <div
                key={c.role}
                className="p-5 rounded-2xl bg-white border-2 border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-brand-primary/5 border border-brand-primary/15 text-xs font-bold text-brand-primary">
                    <E f="contact">{c.role}</E>
                  </span>
                  <span className="text-xs font-medium text-slate-500"><E f="contact">{c.designation}</E></span>
                </div>
                <h3 className="text-lg font-serif font-bold text-brand-primary"><E f="contact">{c.name}</E></h3>
                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                  <a
                    href={`mailto:${c.email}`}
                    className="flex items-center gap-2 text-sm text-brand-secondary font-medium"
                  >
                    <Mail className="w-4 h-4 text-brand-secondary" />
                    <span className="truncate"><E f="contact">{c.email}</E></span>
                  </a>
                  <a
                    href={`tel:${c.phone}`}
                    className="flex items-center gap-2 text-sm text-slate-800 font-mono font-medium"
                  >
                    <Phone className="w-4 h-4 text-brand-accent-dark" />
                    <span><E f="contact">{c.phone}</E></span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
