"use client";


import { ieeeItsLeadership } from "@/data/team";

export default function TeamPage() {
  const facultyMembers = ieeeItsLeadership.filter((m) => m.badge === "Faculty Advisor");
  const studentMembers = ieeeItsLeadership.filter((m) => m.badge !== "Faculty Advisor");

  return (
    <div className="bg-white min-h-screen text-[#1A1A1A] py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Title matching committee page style (Blue) */}
        <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#004B87] tracking-tight mb-3">
          Web Development Team
        </h1>
        <p className="text-base text-slate-600 mb-10 sm:mb-12">
          IEEE Information Theory Society (ITS) Student Chapter · School of Computer Science Engineering &amp; Information Systems (SCORE), VIT Vellore
        </p>

        {/* Responsive Layout matching committee page */}
        <div className={`grid grid-cols-1 ${facultyMembers.length > 0 ? "md:grid-cols-2" : "max-w-2xl"} gap-x-12 lg:gap-x-20 gap-y-10`}>
          
          {/* Left Column: Faculty Sponsor */}
          {facultyMembers.length > 0 && (
            <div className="space-y-8 sm:space-y-10">
              <section className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-[#004B87] tracking-tight">
                  Faculty Advisors
                </h2>
                <div className="space-y-2 pt-1">
                  {facultyMembers.map((member) => (
                    <div
                      key={member.name}
                      className="text-[15px] sm:text-[15.5px] leading-relaxed text-[#222]"
                    >
                      <span className="font-bold text-black">{member.name}</span>
                      {member.role ? `, ${member.role}` : ""}
                      {member.title ? `, ${member.title}` : ""}
                      {member.affiliation ? `, ${member.affiliation}` : ""}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* Student Development Leads */}
          <div className="space-y-8 sm:space-y-10">
            <section className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#004B87] tracking-tight">
                Web Development Leads
              </h2>
              <div className="space-y-2.5 pt-1">
                {studentMembers.map((member) => (
                  <div
                    key={member.name}
                    className="text-[15px] sm:text-[15.5px] leading-relaxed text-[#222]"
                  >
                    <span className="font-bold text-black">{member.name}</span>
                    {member.role ? `, ${member.role}` : ""}
                    {member.affiliation ? `, ${member.affiliation}` : ""}
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
