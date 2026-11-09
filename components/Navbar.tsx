"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ExternalLink, Zap } from "lucide-react";

interface DropdownItem {
  label: string;
  href: string;
  external?: boolean;
}

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
  alignRight?: boolean;
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedDropdown, setMobileExpandedDropdown] = useState<string | null>(null);
  const [showSecondNav, setShowSecondNav] = useState(true);
  const pathname = usePathname();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close mobile menu and reset nav on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileExpandedDropdown(null);
    setShowSecondNav(true);
  }, [pathname]);

  // Handle scroll: hide 2nd nav bar on scroll down, show on scroll up or at landing/top
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let accumulatedDelta = 0;
    let isTicking = false;

    const handleScroll = () => {
      if (isTicking) return;
      isTicking = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = Math.max(0, window.scrollY);
        const delta = currentScrollY - lastScrollY;

        // Near top of page: always show
        if (currentScrollY < 80) {
          setShowSecondNav(true);
          accumulatedDelta = 0;
          lastScrollY = currentScrollY;
          isTicking = false;
          return;
        }

        // Direction reversal resets accumulated scroll
        if ((delta > 0 && accumulatedDelta < 0) || (delta < 0 && accumulatedDelta > 0)) {
          accumulatedDelta = 0;
        }

        accumulatedDelta += delta;

        // Downward scroll beyond top threshold: hide after deliberate 35px downward scroll
        if (currentScrollY > 180 && accumulatedDelta > 35) {
          setShowSecondNav(false);
          setActiveDropdown(null);
        }
        // Upward scroll: reveal after deliberate 25px upward scroll
        else if (accumulatedDelta < -25) {
          setShowSecondNav(true);
        }

        lastScrollY = currentScrollY;
        isTicking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isActive = (item: NavItem) => {
    if (pathname === "/") {
      return item.href === "/";
    }
    if (item.href !== "/" && !item.href.startsWith("#") && (pathname === item.href || pathname.startsWith(item.href + "/"))) return true;
    if (item.dropdownItems?.some((sub) => !sub.external && sub.href !== "/" && (pathname === sub.href || pathname.startsWith(sub.href + "/")))) return true;
    return false;
  };

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const toggleMobileDropdown = (label: string) => {
    setMobileExpandedDropdown((prev) => (prev === label ? null : label));
  };

  const navItems: NavItem[] = [
    {
      label: "Home",
      href: "/",
      hasDropdown: false,
    },
    {
      label: "About",
      href: "/about",
      hasDropdown: false,
    },
    {
      label: "Conference",
      href: "/call-for-papers",
      hasDropdown: true,
      alignRight: false,
      dropdownItems: [
        { label: "Call for Papers", href: "/call-for-papers" },
        { label: "Research Tracks", href: "/tracks" },
        { label: "Keynote Speakers", href: "/keynote-speakers" },
        { label: "Submit Paper on CMT", href: "/call-for-papers#submit" },
        { label: "Important Dates", href: "/important-dates" },
        { label: "Registration Fees", href: "/registration" },
        { label: "Sponsorship Packages", href: "/sponsorship" },
      ],
    },
    {
      label: "Committees",
      href: "/committees",
      hasDropdown: false,
    },
    {
      label: "Visa",
      href: "/visa",
      hasDropdown: false,
    },
    {
      label: "Previous ic-ETITE",
      href: "/ic-ETITE24",
      hasDropdown: true,
      alignRight: true,
      dropdownItems: [
        { label: "ic-ETITE'24 (Second Edition)", href: "/ic-ETITE24" },
        { label: "ic-ETITE'20 (Inaugural Edition)", href: "/ic-ETITE20" },
      ],
    },
    {
      label: "Venue & Travel",
      href: "/venue",
      hasDropdown: false,
    },
    {
      label: "Hotels",
      href: "/hotels",
      hasDropdown: false,
    },
    {
      label: "Contact",
      href: "/contact",
      hasDropdown: false,
    },
  ];

  return (
    <>
      <header
        id="site-nav"
        className="sticky top-0 z-50 w-full shadow-2xl select-none"
        style={{ overflowAnchor: "none" }}
      >
        {/* =========================================================================
            TIER 1: TOP NAV BAR (PRESERVING ALL LOGOS & EVENT TAGS AS THEY ARE)
        ========================================================================= */}
        <div className="relative z-30 w-full bg-[#002147] border-b border-white/15 py-2.5 sm:py-3 shadow-sm">
          <div
            className="relative w-full max-w-[1800px] mx-auto px-3 sm:px-5 lg:px-8 flex items-center justify-between gap-3"
            aria-label="Conference Identity & University Host"
          >
            {/* LEFT: ic-ETITE '28 Logo & IEEE ITS Emblem */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <Link
                href="/"
                title="ic-ETITE'28 International Conference"
                className="flex items-center shrink-0 hover:opacity-90 transition-opacity"
              >
                <div className="relative h-8 sm:h-9 md:h-10 w-28 sm:w-36 md:w-44">
                  <Image
                    src="/logos/ic-etite28-cropped-transparent.png"
                    alt="ic-ETITE'28 Conference Logo"
                    fill
                    sizes="(max-width: 640px) 128px, 176px"
                    className="object-contain object-left drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]"
                    priority
                  />
                </div>
              </Link>

              {/* IEEE Information Theory Society Round Emblem */}
              <a
                href="https://ieee-its-vit.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                title="IEEE Information Theory Society"
                className="hidden min-[360px]:flex items-center shrink-0 hover:opacity-90 transition-opacity"
              >
                <div className="relative h-8 sm:h-9 md:h-10 w-8 sm:w-9 md:w-10 rounded-full overflow-hidden border border-white/20 shadow-xs bg-[#00142E]">
                  <Image
                    src="/logos/ieee-its-circle-logo.png"
                    alt="IEEE Information Theory Society Emblem"
                    fill
                    sizes="(max-width: 640px) 32px, 40px"
                    className="object-contain rounded-full"
                  />
                </div>
              </a>
            </div>

            {/* CENTER: Conference Dates (xl+ only; below that it collides with the event tags) */}
            <div className="hidden xl:flex absolute left-1/2 -translate-x-1/2 flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-xl 2xl:text-2xl font-black tracking-wide text-[#FFB81C] uppercase whitespace-nowrap drop-shadow-sm font-serif">
                10–11 February 2028
              </span>
              <span className="text-[11px] sm:text-xs lg:text-sm text-white/90 font-semibold tracking-wider uppercase whitespace-nowrap">
                VIT Vellore, Tamil Nadu, India
              </span>
            </div>

            {/* RIGHT: TechNext '28, BOLT 3.0 Tags, VIT Official Logo, Mobile Menu Button
                (tags hidden below lg, where they would push the menu button off-screen; the drawer lists both) */}
            <div className="flex items-center gap-2 sm:gap-3 xl:gap-4 shrink-0">
              {/* TechNext '28 Tag */}
              <Link
                href="/technext"
                className="hidden lg:flex items-center justify-center h-8 sm:h-9 px-2.5 sm:px-3 rounded-full bg-white/10 hover:bg-white/20 border border-[#F37021]/80 shadow-[0_0_12px_rgba(243,112,33,0.28)] transition-all hover:scale-105 shrink-0"
                title="TechNext '28 National Industrial Expo"
              >
                <div className="relative h-4 sm:h-5 w-16 sm:w-24">
                  <Image
                    src="/logos/technext-logo.png"
                    alt="TechNext '28"
                    fill
                    sizes="100px"
                    className="object-contain"
                  />
                </div>
              </Link>

              {/* BOLT 3.0 Hackathon Tag */}
              <Link
                href="/hackathon"
                className="hidden lg:flex items-center justify-center h-8 sm:h-9 px-2.5 sm:px-3 rounded-full bg-[#00142E] hover:bg-[#00244D] border border-[#CCFF00] shadow-[0_0_12px_rgba(204,255,0,0.28)] transition-all hover:scale-105 shrink-0"
                title="Register for BOLT 3.0 National Flagship Hackathon"
              >
                <div className="relative h-4 sm:h-5 w-14 sm:w-20">
                  <Image
                    src="/logos/bolt-logo-white.png"
                    alt="BOLT 3.0"
                    fill
                    sizes="80px"
                    className="object-contain"
                  />
                </div>
              </Link>

              {/* VIT Logo */}
              <Link
                href="/"
                title="Vellore Institute of Technology"
                className="flex items-center shrink-0 hover:opacity-95 transition-opacity"
              >
                <div className="relative h-8 sm:h-9 md:h-10 w-20 sm:w-28 md:w-32">
                  <Image
                    src="/logos/vit-header-logo.webp"
                    alt="VIT Vellore Institute of Technology"
                    fill
                    sizes="(max-width: 640px) 96px, 128px"
                    className="object-contain object-right"
                  />
                </div>
              </Link>

              {/* Mobile / Tablet Menu Trigger Button (< lg) */}
              <button
                id="menu-btn"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 active:scale-95 flex items-center justify-center ml-1"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-6 h-6 text-[#FFB81C]" /> : <Menu className="w-6 h-6 text-white" />}
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            TIER 2: SECONDARY NAV BAR (DESKTOP ONLY — HIDDEN ON MOBILE; ADAPTS ON ZOOM)
        ========================================================================= */}
        {/* Positioned out of flow and hidden with a transform so toggling it never changes
            page layout (a height collapse shifts content, which re-fires scroll and flickers). */}
        <div
          className={`hidden lg:block absolute top-full left-0 z-20 w-full transition-[transform,opacity,visibility] duration-300 ease-in-out will-change-transform ${
            showSecondNav
              ? "translate-y-0 opacity-100 visible"
              : "-translate-y-full opacity-0 invisible pointer-events-none"
          }`}
        >
          <nav
            className="w-full h-12 bg-[#001733] border-b-2 border-[#FFB81C]/30 shadow-lg"
            aria-label="Conference Secondary Navigation"
          >
            <div className="w-full h-full max-w-[1800px] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8 flex items-center justify-center">
              {/* Desktop Navigation Items - Responsive gap & padding optimized for zoom in & out */}
              <ul className="flex items-center justify-center gap-0.5 lg:gap-1 xl:gap-2 h-full flex-nowrap whitespace-nowrap">
                {navItems.map((item) => {
                  const active = isActive(item);
                  const isOpen = activeDropdown === item.label;

                  return (
                    <li
                      key={item.label}
                      className="relative group shrink-0"
                      onMouseEnter={() => {
                        if (item.hasDropdown) handleMouseEnter(item.label);
                      }}
                      onMouseLeave={() => {
                        handleMouseLeave();
                      }}
                    >
                      <Link
                        href={item.href}
                        className={`relative inline-flex items-center gap-1 py-1.5 px-3 lg:px-3.5 xl:px-4 rounded-full text-[12.5px] lg:text-[13px] xl:text-[14px] font-bold tracking-wide transition-all whitespace-nowrap shrink-0 ${
                          active
                            ? "bg-[#002D5C] text-[#FFB81C] border border-[#FFB81C]/60 shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
                            : "text-white/95 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <span>{item.label}</span>
                        {item.hasDropdown && (
                          <ChevronDown
                            className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 opacity-80 ${
                              isOpen ? "rotate-180 text-[#FFB81C]" : ""
                            }`}
                          />
                        )}
                      </Link>

                      {/* Dropdown Menu */}
                      {item.hasDropdown && item.dropdownItems && (
                        <div
                          className={`absolute top-full ${
                            item.alignRight ? "right-0" : "left-0"
                          } w-max max-w-[calc(100vw-32px)] min-w-[240px] sm:min-w-[260px] p-2 bg-[#00142E] border-2 border-white/20 rounded-2xl shadow-2xl transition-all duration-200 z-50 mt-1.5 ${
                            isOpen
                              ? "opacity-100 visible translate-y-0"
                              : "opacity-0 invisible -translate-y-2 pointer-events-none"
                          }`}
                        >
                          {item.dropdownItems.map((subItem) => (
                            <div key={subItem.label}>
                              {subItem.external ? (
                                <a
                                  href={subItem.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm xl:text-[14.5px] font-semibold text-white/90 hover:text-white hover:bg-white/15 transition-colors"
                                >
                                  <span>{subItem.label}</span>
                                  <ExternalLink className="w-3.5 h-3.5 text-[#FFB81C]" />
                                </a>
                              ) : (
                                <Link
                                  href={subItem.href}
                                  className="block px-3.5 py-2.5 rounded-lg text-sm xl:text-[14.5px] font-semibold text-white/90 hover:text-[#FFB81C] hover:bg-white/15 transition-colors"
                                >
                                  {subItem.label}
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </div>

        {/* =========================================================================
            MOBILE & TABLET DRAWER NAVIGATION (< lg, ACCESSIBLE VIA THREE-LINE MENU)
        ========================================================================= */}
        {mobileOpen && (
          <div
            className="lg:hidden fixed inset-x-0 bottom-0 top-[56px] sm:top-[64px] bg-[#00142E] border-t border-white/15 text-white shadow-2xl z-40 overflow-y-auto animate-in slide-in-from-top-2 duration-200"
          >
            <div className="container-x py-6 space-y-6 pb-24">
              {/* Co-located Events Highlights in Mobile Drawer */}
              <div className="space-y-3">
                {/* BOLT 3.0 Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#00142E] to-[#002244] border border-[#CCFF00]/50 shadow-md flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-7 w-20 shrink-0">
                      <Image
                        src="/logos/bolt-logo-white.png"
                        alt="BOLT 3.0 Hackathon"
                        fill
                        sizes="80px"
                        className="object-contain object-left"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#CCFF00] tracking-wide">BOLT 3.0 Hackathon</p>
                      <p className="text-xs text-white/70">National Flagship 24h Sprint</p>
                    </div>
                  </div>
                  <Link
                    href="/hackathon"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-1.5 rounded-lg bg-[#CCFF00] text-[#001C3D] font-bold text-xs tracking-wider uppercase hover:bg-white transition-colors shrink-0"
                  >
                    Explore
                  </Link>
                </div>

                {/* TechNext '28 Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#001733] to-[#002244] border border-[#F37021]/50 shadow-md flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-6 w-24 shrink-0">
                      <Image
                        src="/logos/technext-logo.png"
                        alt="TechNext '28"
                        fill
                        sizes="96px"
                        className="object-contain object-left"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#F37021] tracking-wide">TechNext &apos;28 Expo</p>
                      <p className="text-xs text-white/70">Industrial Expo &amp; Stalls</p>
                    </div>
                  </div>
                  <Link
                    href="/technext"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-1.5 rounded-lg bg-[#84E320] text-[#0B0324] font-bold text-xs tracking-wider uppercase hover:bg-white transition-colors shrink-0"
                  >
                    Explore
                  </Link>
                </div>
              </div>

              {/* Navigation List with Accordions */}
              <ul className="flex flex-col gap-1.5 text-base sm:text-lg font-semibold">
                {navItems.map((item) => {
                  const active = isActive(item);
                  const isExpanded = mobileExpandedDropdown === item.label;

                  return (
                    <li key={item.label} className="border-b border-white/5 pb-1.5">
                      <div className="flex items-center justify-between">
                        <Link
                          href={item.href}
                          onClick={() => {
                            if (!item.hasDropdown) setMobileOpen(false);
                          }}
                          className={`flex-1 py-3.5 px-4 rounded-xl transition-colors font-bold ${
                            active
                              ? "bg-white/15 text-[#FFB81C]"
                              : "text-white/90 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {item.label}
                        </Link>

                        {/* Dropdown Expand Toggle for Mobile */}
                        {item.hasDropdown && (
                          <button
                            type="button"
                            onClick={() => toggleMobileDropdown(item.label)}
                            className="p-3 text-white/60 hover:text-[#FFB81C] transition-colors"
                            aria-label={`Toggle ${item.label} sub-menu`}
                          >
                            <ChevronDown
                              className={`w-5 h-5 transition-transform duration-200 ${
                                isExpanded ? "rotate-180 text-[#FFB81C]" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Expandable Sub-items */}
                      {item.hasDropdown && item.dropdownItems && isExpanded && (
                        <div className="ml-4 pl-3 border-l-2 border-[#FFB81C]/40 py-2 space-y-2 animate-in fade-in-50 duration-150">
                          {item.dropdownItems.map((sub) => (
                            <div key={sub.label}>
                              {sub.external ? (
                                <a
                                  href={sub.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-center justify-between py-2.5 px-3.5 rounded-lg text-sm sm:text-base font-medium text-white/80 hover:text-white hover:bg-white/10"
                                >
                                  <span>{sub.label}</span>
                                  <ExternalLink className="w-4 h-4 text-[#FFB81C]" />
                                </a>
                              ) : (
                                <Link
                                  href={sub.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="block py-2.5 px-3.5 rounded-lg text-sm sm:text-base font-medium text-white/80 hover:text-[#FFB81C] hover:bg-white/10"
                                >
                                  {sub.label}
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* Quick Actions */}
              <div className="pt-4 border-t border-white/10 space-y-3 text-sm">
                <a
                  href="https://ieee-its-vit.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white"
                >
                  <span className="font-bold">IEEE ITS Student Chapter Portal</span>
                  <ExternalLink className="w-4 h-4 text-[#72EFDD]" />
                </a>

                <Link
                  href="/call-for-papers#submit"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between p-4 rounded-xl bg-[#F5A623] text-[#002147] font-black hover:bg-[#FFB81C] transition-colors"
                >
                  <span>Submit Manuscript on CMT</span>
                  <span className="font-black text-lg">→</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
      {/* Reserves the secondary nav's height at the top of the page (it is out of flow above) */}
      <div aria-hidden="true" className="hidden lg:block h-12" />
    </>
  );
}
