"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Award, Globe, Building2, Cpu, Users } from "lucide-react";
import {
  chiefPatron,
  patrons,
  organizingChairs,
  technicalProgrammeChairs,
  executiveAdvisoryCommittee,
  publicationCommittee,
  sponsorshipCommittee,
  publicityAndMediaCommittee,
  registrationCommittee,
  boltHackathonCommittee,
  technextExpoCommittee,
  eventManagementCommittee,
  guestCareCommittee,
  conferenceCoordinatingCommittee,
} from "@/data/committees";
import {
  internationalAdvisoryData,
  nationalAdvisoryData,
  technicalCommitteeData,
} from "@/data/advisory";

interface TextMember {
  name: string;
  affiliation?: string;
}

interface CommitteeSection {
  title: string;
  members: TextMember[];
}

type TabType = "organizing" | "international" | "national" | "technical" | "student";

export default function CommitteesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("organizing");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 120);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Organizing Committee: Executive Leadership Sections
  const executiveLeadershipLeft: CommitteeSection[] = [
    {
      title: "Chief Patron",
      members: [
        {
          name: chiefPatron.name,
          affiliation: chiefPatron.affiliation,
        },
      ],
    },
    {
      title: "Patrons",
      members: patrons.map((p) => ({
        name: p.name,
        affiliation: p.affiliation,
      })),
    },
    {
      title: "Organizing Chair",
      members: [
        {
          name: organizingChairs.organizingChair.name,
          affiliation: organizingChairs.organizingChair.affiliation,
        },
      ],
    },
    {
      title: "Organizing Co-chair",
      members: [
        {
          name: organizingChairs.organizingCoChair.name,
          affiliation: organizingChairs.organizingCoChair.affiliation,
        },
      ],
    },
    {
      title: "Conference Chair",
      members: [
        {
          name: organizingChairs.conferenceChair.name,
          affiliation: organizingChairs.conferenceChair.affiliation,
        },
      ],
    },
  ];

  const executiveLeadershipRight: CommitteeSection[] = [
    {
      title: "Publication Chair",
      members: [
        {
          name: organizingChairs.publicationChair.name,
          affiliation: organizingChairs.publicationChair.affiliation,
        },
      ],
    },
    {
      title: "Publication Co-chairs",
      members: organizingChairs.publicationCoChairs.map((p) => ({
        name: p.name,
        affiliation: p.affiliation,
      })),
    },
    {
      title: "Finance Chair",
      members: [
        {
          name: organizingChairs.financeChair.name,
          affiliation: organizingChairs.financeChair.affiliation,
        },
      ],
    },
    {
      title: "Finance Co-chair",
      members: [
        {
          name: organizingChairs.financeCoChair.name,
          affiliation: organizingChairs.financeCoChair.affiliation,
        },
      ],
    },
    {
      title: "Technical Programme Chairs",
      members: technicalProgrammeChairs.map((m) => ({
        name: m.name,
        affiliation: m.affiliation,
      })),
    },
  ];

  // Specific Functional Committees from Official Directory
  const functionalCommittees: CommitteeSection[] = [
    {
      title: "Executive Advisory Committee",
      members: executiveAdvisoryCommittee.map((m) => ({
        name: m.name,
        affiliation: `${m.role}, ${m.affiliation}`,
      })),
    },
    {
      title: "Publication Committee",
      members: publicationCommittee.map((m) => ({
        name: m.name,
        affiliation: `${m.role}, ${m.affiliation}`,
      })),
    },
    {
      title: "Sponsorship Committee",
      members: sponsorshipCommittee.map((m) => ({
        name: m.name,
        affiliation: `${m.role}, ${m.affiliation}`,
      })),
    },
    {
      title: "Publicity and Media Committee",
      members: publicityAndMediaCommittee.map((m) => ({
        name: m.name,
        affiliation: `${m.role}, ${m.affiliation}`,
      })),
    },
    {
      title: "Registration Committee",
      members: registrationCommittee.map((m) => ({
        name: m.name,
        affiliation: `${m.role}, ${m.affiliation}`,
      })),
    },
    {
      title: "BOLT 3.0 Hackathon Committee",
      members: boltHackathonCommittee.map((m) => ({
        name: m.name,
        affiliation: `${m.role}, ${m.affiliation}`,
      })),
    },
    {
      title: "Technext’28 Expo Committee",
      members: technextExpoCommittee.map((m) => ({
        name: m.name,
        affiliation: `${m.role}, ${m.affiliation}`,
      })),
    },
    {
      title: "Event Management Committee",
      members: eventManagementCommittee.map((m) => ({
        name: m.name,
        affiliation: `${m.role}, ${m.affiliation}`,
      })),
    },
    {
      title: "Guest Care Committee",
      members: guestCareCommittee.map((m) => ({
        name: m.name,
        affiliation: `${m.role}, ${m.affiliation}`,
      })),
    },
    {
      title: "Conference Coordinating Committee",
      members: conferenceCoordinatingCommittee.map((m) => ({
        name: m.name,
        affiliation: `${m.role}, ${m.affiliation}`,
      })),
    },
  ];

  // Student Committee Members
  const studentLeads: TextMember[] = [
    { name: "Likhith Medarametla", affiliation: "SCORE, VIT Vellore" },
    { name: "Judson Daniel", affiliation: "SCORE, VIT Vellore" },
    { name: "M.J.V.Maheswara Reddy", affiliation: "SCORE, VIT Vellore" },
  ];

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

  // Split international advisory array into two balanced columns
  const intlHalf = Math.ceil(cleanIntl.length / 2);
  const intlCol1 = cleanIntl.slice(0, intlHalf);
  const intlCol2 = cleanIntl.slice(intlHalf);

  // Split national advisory array into two balanced columns
  const natHalf = Math.ceil(cleanNat.length / 2);
  const natCol1 = cleanNat.slice(0, natHalf);
  const natCol2 = cleanNat.slice(natHalf);

  // Split technical committee array into two balanced columns
  const techHalf = Math.ceil(cleanTech.length / 2);
  const techCol1 = cleanTech.slice(0, techHalf);
  const techCol2 = cleanTech.slice(techHalf);

  // Tab configurations
  const tabs = [
    { id: "organizing" as TabType, label: "Organizing Committee", icon: Award },
    { id: "international" as TabType, label: "International Advisory", icon: Globe },
    { id: "national" as TabType, label: "National Advisory", icon: Building2 },
    { id: "technical" as TabType, label: "Technical Committee", icon: Cpu },
    { id: "student" as TabType, label: "Student Committee", icon: Users },
  ];

  return (
    <div className="bg-white min-h-screen text-[#1A1A1A] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* FLOATING LIQUID GLASS COMMITTEE NAVIGATION */}
        <div className="sticky top-[76px] z-40 -mx-4 px-4 py-3 mb-10 sm:mb-12 flex justify-center pointer-events-none">
          <div className="relative pointer-events-auto max-w-full">
            {/* Soft glass blur extending below the bar */}
            {isScrolled && (
              <div
                className="absolute -inset-x-2 -bottom-4 h-10 rounded-full
                bg-white/30 backdrop-blur-xl
                [mask-image:linear-gradient(to_bottom,black,transparent)]
                pointer-events-none"
              />
            )}

            {/* Main glass navigation */}
            <div
              className={`
                relative flex items-center gap-1 sm:gap-1.5
                p-1.5 max-w-full overflow-x-auto
                whitespace-nowrap no-scrollbar rounded-full
                border transition-all duration-500 ease-out
                ${
                  isScrolled
                    ? "bg-white/85 backdrop-blur-[32px] backdrop-saturate-[180%] border-white/90 shadow-[0_10px_35px_rgba(0,33,71,0.16)]"
                    : "bg-[#F8FAFC] border-[#E2E8F0] shadow-sm"
                }
              `}
              style={{
                WebkitBackdropFilter: isScrolled
                  ? "blur(32px) saturate(180%)"
                  : "none",
              }}
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);

                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                    className={`
                      flex items-center gap-2
                      px-3.5 sm:px-5 py-2 sm:py-2.5
                      rounded-full text-xs sm:text-sm
                      font-semibold transition-all duration-300
                      whitespace-nowrap shrink-0
                      ${
                        isActive
                          ? "bg-[#002147] text-white shadow-md"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                      }
                    `}
                    aria-pressed={isActive}
                  >
                    <Icon
                      className={`
                        w-4 h-4 shrink-0 transition-colors duration-300
                        ${isActive ? "text-[#FFB81C]" : "text-slate-400"}
                      `}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 1. TAB: ORGANIZING COMMITTEE */}
        {activeTab === "organizing" && (
          <div className="animate-in fade-in duration-200 space-y-16">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#004B87] tracking-tight mb-8 sm:mb-10">
                Organizing Committee
              </h1>

              {/* 2-Column Responsive Layout for Executive Leadership */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-8 sm:gap-y-10">
                {/* Left Column */}
                <div className="space-y-8 sm:space-y-10">
                  {executiveLeadershipLeft.map((section) => (
                    <section key={section.title} className="space-y-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-[#004B87] tracking-tight">
                        {section.title}
                      </h2>
                      <div className="space-y-1.5 pt-1">
                        {section.members.map((member) => (
                          <div
                            key={member.name}
                            className="text-[15px] sm:text-[15.5px] leading-relaxed text-[#222]"
                          >
                            <span className="font-bold text-black">{member.name}</span>
                            {member.affiliation ? `, ${member.affiliation}` : ""}
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>

                {/* Right Column */}
                <div className="space-y-8 sm:space-y-10">
                  {executiveLeadershipRight.map((section) => (
                    <section key={section.title} className="space-y-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-[#004B87] tracking-tight">
                        {section.title}
                      </h2>
                      <div className="space-y-1.5 pt-1">
                        {section.members.map((member) => (
                          <div
                            key={member.name}
                            className="text-[15px] sm:text-[15.5px] leading-relaxed text-[#222]"
                          >
                            <span className="font-bold text-black">{member.name}</span>
                            {member.affiliation ? `, ${member.affiliation}` : ""}
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </div>

            {/* Functional & Departmental Committees */}
            <div className="pt-12 border-t border-slate-200">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#004B87] tracking-tight mb-8">
                Committees &amp; Coordinators
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-10">
                {functionalCommittees.map((group) => (
                  <section key={group.title} className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl sm:text-2xl font-bold text-[#004B87] tracking-tight">
                        {group.title}
                      </h3>
                      {group.title.includes("BOLT") && (
                        <div className="relative h-6 w-20 shrink-0">
                          <Image src="/logos/bolt-logo.png" alt="BOLT 3.0" fill sizes="80px" className="object-contain object-left" />
                        </div>
                      )}
                      {group.title.toLowerCase().includes("technext") && (
                        <div className="relative h-6 w-24 shrink-0">
                          <Image src="/logos/technext-logo.png" alt="TechNext '28" fill sizes="100px" className="object-contain object-left" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5 pt-1">
                      {group.members.map((member) => (
                        <div
                          key={member.name}
                          className="text-[15px] sm:text-[15.5px] leading-relaxed text-[#222]"
                        >
                          <span className="font-bold text-black">{member.name}</span>
                          {member.affiliation ? `, ${member.affiliation}` : ""}
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. TAB: INTERNATIONAL ADVISORY */}
        {activeTab === "international" && (
          <div className="animate-in fade-in duration-200">
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#004B87] tracking-tight mb-8 sm:mb-10">
              International Advisory Board
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-4">
              <div className="space-y-3">
                {intlCol1.map((m) => (
                  <div key={m.name} className="text-[14.5px] sm:text-[15px] leading-relaxed text-[#222]">
                    <span className="font-bold text-black">{m.name}</span>
                    {m.institution ? `, ${m.institution}` : ""}
                    {m.country ? `, ${m.country}` : ""}
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {intlCol2.map((m) => (
                  <div key={m.name} className="text-[14.5px] sm:text-[15px] leading-relaxed text-[#222]">
                    <span className="font-bold text-black">{m.name}</span>
                    {m.institution ? `, ${m.institution}` : ""}
                    {m.country ? `, ${m.country}` : ""}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. TAB: NATIONAL ADVISORY */}
        {activeTab === "national" && (
          <div className="animate-in fade-in duration-200">
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#004B87] tracking-tight mb-8 sm:mb-10">
              National Advisory Board
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-4">
              <div className="space-y-3">
                {natCol1.map((m) => (
                  <div key={`${m.name}-${m.institution}`} className="text-[14.5px] sm:text-[15px] leading-relaxed text-[#222]">
                    <span className="font-bold text-black">{m.name}</span>
                    {m.institution ? `, ${m.institution}` : ""}
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {natCol2.map((m) => (
                  <div key={`${m.name}-${m.institution}`} className="text-[14.5px] sm:text-[15px] leading-relaxed text-[#222]">
                    <span className="font-bold text-black">{m.name}</span>
                    {m.institution ? `, ${m.institution}` : ""}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. TAB: TECHNICAL COMMITTEE */}
        {activeTab === "technical" && (
          <div className="animate-in fade-in duration-200">
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#004B87] tracking-tight mb-8 sm:mb-10">
              Technical Committee
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-4">
              <div className="space-y-3">
                {techCol1.map((m) => (
                  <div key={m.name} className="text-[14.5px] sm:text-[15px] leading-relaxed text-[#222]">
                    <span className="font-bold text-black">{m.name}</span>
                    {m.institution ? `, ${m.institution}` : ""}
                    {m.location ? `, ${m.location}` : ""}
                    {m.country ? `, ${m.country}` : ""}
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {techCol2.map((m) => (
                  <div key={m.name} className="text-[14.5px] sm:text-[15px] leading-relaxed text-[#222]">
                    <span className="font-bold text-black">{m.name}</span>
                    {m.institution ? `, ${m.institution}` : ""}
                    {m.location ? `, ${m.location}` : ""}
                    {m.country ? `, ${m.country}` : ""}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. TAB: STUDENT COMMITTEE */}
        {activeTab === "student" && (
          <div className="animate-in fade-in duration-200">
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#004B87] tracking-tight mb-3">
              Student Committee &amp; IEEE ITS Chapter
            </h1>
            <p className="text-base text-slate-600 mb-8 sm:mb-10">
              Student leadership, engineering development team, and volunteer coordinators powering ic-ETITE&apos;28.
            </p>
            <div className="flex flex-col items-center gap-4">
              {studentLeads.map((m) => (
                <div key={m.name} className="text-[15px] leading-relaxed text-[#222] text-center">
                  <span className="font-bold text-black">{m.name}</span>
                  {`, ${m.affiliation}`}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
