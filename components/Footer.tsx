import Link from "next/link";
import Image from "next/image";
import { ExternalLink, MapPin, Mail, Award, Sparkles, ChevronRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#001733] text-white border-t border-white/10 select-none">
      {/* Top Branding Bar with Dual Official Logos */}
      <div className="border-b border-white/10 bg-[#001024] py-8">
        <div className="container-x flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Dual Logos */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 sm:gap-8">
            {/* VIT White Logo */}
            <a
              href="https://vit.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="relative h-12 w-44 sm:h-14 sm:w-52 transition-transform duration-300 hover:scale-105"
              title="Vellore Institute of Technology Official Portal"
            >
              <Image
                src="/logos/vit-official-white.png"
                alt="VIT Vellore Official Logo"
                fill
                sizes="(max-width: 640px) 176px, 208px"
                loading="lazy"
                className="object-contain object-left"
              />
            </a>

            <div className="hidden sm:block h-9 w-px bg-white/20" />


          </div>

          {/* Institutional Accreditation Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/15 text-xs sm:text-sm text-white/90 shadow-sm">
            <Award className="w-4 h-4 text-[#FFB81C] shrink-0" />
            <span className="font-medium">NAAC A++ (CGPA 3.66 / 4.0) · NIRF 2025 #14 University · #16 Engineering</span>
          </div>
        </div>
      </div>

      {/* Main Footer Grid - Spread evenly across 4 balanced columns */}
      <div className="container-x py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 xl:gap-16">
          {/* Col 1: University Host & Academic Identity */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
              ic-ETITE<span className="text-[#FF0050]">&apos;28</span>
            </h3>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
              The Third International Conference on Emerging Trends in Information Technology and Engineering (ic-ETITE’28).
              Organized by the{" "}
              <a
                href="https://vit.ac.in/schools/school-of-computer-science-engineering-and-information-systems"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFB81C] hover:underline underline-offset-2 font-medium"
              >
                School of Computer Science Engineering &amp; Information Systems (SCORE)
              </a>
              ,{" "}
              <a
                href="https://vit.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFB81C] hover:underline underline-offset-2 font-medium"
              >
                VIT Vellore
              </a>
              .
            </p>

            <div className="pt-2 space-y-2.5 text-xs sm:text-sm text-white/85 font-normal">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FFB81C] shrink-0 mt-0.5" />
                <span>Vellore Institute of Technology, Katpadi, Vellore, Tamil Nadu – 632014, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FFB81C] shrink-0" />
                <a
                  href="mailto:icetiteconference@vit.ac.in"
                  className="text-white hover:text-[#FFB81C] transition-colors underline underline-offset-2 font-medium"
                >
                  icetiteconference@vit.ac.in
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Conference Directory */}
          <div className="space-y-6">
            <h4 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#FFB81C]">
              CONFERENCE DIRECTORY
            </h4>
            <ul className="space-y-3.5 text-sm font-normal text-slate-300">
              <li>
                <Link className="hover:text-white transition-colors block" href="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition-colors block" href="/about">
                  About VIT &amp; SCORE
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition-colors block" href="/important-dates">
                  Important Dates
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition-colors block" href="/committees">
                  Organizing Committees
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition-colors block" href="/advisory">
                  Advisory Board
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition-colors block" href="/keynote-speakers">
                  Keynote Speakers
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition-colors block" href="/venue">
                  Conference Venue
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition-colors block" href="/hotels">
                  Hotels &amp; Accommodation
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition-colors block" href="/sponsorship">
                  Sponsorship Packages
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition-colors block" href="/contact">
                  Contact &amp; Help Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Authors & Papers */}
          <div className="space-y-6">
            <h4 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#FFB81C]">
              AUTHORS &amp; PAPERS
            </h4>
            <ul className="space-y-3.5 text-sm font-normal text-slate-300">
              <li>
                <Link className="hover:text-white transition-colors block" href="/call-for-papers">
                  Call for Papers
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition-colors block" href="/tracks">
                  Research Tracks &amp; Scope
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition-colors block" href="/registration">
                  Registration Fees
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition-colors block" href="/visa">
                  Visa &amp; Clearances
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition-colors block" href="/hackathon">
                  BOLT 3.0 Hackathon
                </Link>
              </li>
              <li>
                <Link
                  href="/call-for-papers#submit"
                  className="hover:text-white transition-colors block"
                >
                  Paper Submission Portal (Microsoft CMT)
                </Link>
              </li>
              <li>
                <a
                  href="https://ieeexplore.ieee.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors block"
                >
                  IEEE Xplore Indexing
                </a>
              </li>
              <li>
                <Link className="hover:text-white transition-colors block" href="/team">
                  IEEE ITS Dev Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Institutional Sponsors & Chapters */}
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[#FFB81C]">
              Academic Host &amp; Chapters
            </p>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[11px] text-[#FFB81C] font-bold uppercase tracking-wider mb-0.5">Academic Host</p>
                <a
                  href="https://vit.ac.in/schools/school-of-computer-science-engineering-and-information-systems"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-medium hover:text-[#FFB81C] transition-colors block"
                >
                  SCORE · VIT Vellore ↗
                </a>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[11px] text-[#72EFDD] font-bold uppercase tracking-wider mb-0.5">Chapter</p>
                <a
                  href="https://ieee-its-vit.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-medium hover:text-[#72EFDD] transition-colors block"
                >
                  IEEE ITS VIT Chapter ↗
                </a>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[11px] text-[#FFB81C] font-bold uppercase tracking-wider mb-0.5">Venue &amp; Dates</p>
                <p className="text-white font-medium">10–11 February 2028 · VIT Vellore</p>
              </div>

              {/* Co-Located Flagship Events */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <p className="text-[11px] text-[#FFB81C] font-bold uppercase tracking-wider">Co-Located Flagship Events</p>
                <div className="flex items-center gap-3 pt-0.5">
                  <Link href="/technext" title="TechNext '28 Industrial Expo" className="hover:opacity-85 transition-opacity">
                    <div className="relative h-6 w-24">
                      <Image src="/logos/technext-logo.png" alt="TechNext '28" fill sizes="100px" className="object-contain object-left" />
                    </div>
                  </Link>
                  <Link href="/hackathon" title="BOLT 3.0 National Hackathon" className="hover:opacity-85 transition-opacity">
                    <div className="relative h-6 w-20">
                      <Image src="/logos/bolt-logo-white.png" alt="BOLT 3.0" fill sizes="80px" className="object-contain object-left" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Signature Bar: Built by IEEE ITS Team & Copyright */}
      <div className="border-t border-white/10 bg-[#000D1C] py-6">
        <div className="container-x flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-white/70">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
            <span>© 2028 ic-ETITE · Vellore Institute of Technology. All rights reserved.</span>
          </div>

          {/* Built by IEEE ITS Team: Normal text with underline */}
          <div className="shrink-0 flex items-center justify-center">
            <Link
              href="/team"
              className="text-xs sm:text-sm text-white/80 hover:text-white underline underline-offset-4 decoration-[#00B4D8]/60 hover:decoration-[#00B4D8] transition-colors"
              id="footer-built-by-team-btn"
              title="View IEEE Information Theory Society Chapter Development Team"
            >
              Built by IEEE ITS Team
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
