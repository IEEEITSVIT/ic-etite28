"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, ArrowRight } from "lucide-react";
import E from "@/components/cms/E";

interface TrackGroup {
  id: string;
  name: string;
  defaultOpen?: boolean;
  topics: string[];
}

const trackData: TrackGroup[] = [
  {
    id: "it",
    name: "Information Technology",
    defaultOpen: true,
    topics: [
      "Information Systems",
      "Cloud Computing",
      "Cloud Security",
      "Data Management & Visualization",
      "Cyber-Physical Systems",
      "Cyber Security",
      "Network Security",
      "Digital Forensics",
      "Quantum Cryptography",
      "Malware Analysis",
      "Secure IoT",
      "Deep Learning",
      "Web Intelligence",
    ],
  },
  {
    id: "comm",
    name: "Communication Engineering",
    defaultOpen: false,
    topics: [
      "Wireless & Sensor Systems",
      "Wireless Communications",
      "Communication Signal Processing",
      "Ad-Hoc Networks",
      "Data Communication",
      "Optical Communications",
      "Telecommunication Networks",
      "Satellite Communications",
      "Quantum Communication",
      "Software Defined Networks",
      "4G & 5G Next-Gen",
      "Intelligent Control Systems",
    ],
  },
  {
    id: "comp",
    name: "Computer Engineering",
    defaultOpen: false,
    topics: [
      "Computer Architecture",
      "Modern Operating Systems",
      "Virtualization",
      "Quantum Computing",
      "Human Computer Interaction",
      "Machine Learning",
      "Natural Language Processing (NLP)",
      "Artificial Intelligence",
      "Computer Graphics",
      "Computer Vision",
      "Software Engineering",
    ],
  },
  {
    id: "elec",
    name: "Electronics Engineering",
    defaultOpen: false,
    topics: [
      "Robotics & Automation",
      "Embedded Systems",
      "Digital Signal Processing",
      "VLSI Design",
      "Control Systems",
      "MEMS",
      "Power & Energy",
      "Quantum Science",
      "Microelectronics",
      "Power Electronics",
      "Photonics",
      "Instrumentation & Sensing",
    ],
  },
];

export default function HomeTracks() {
  const [query, setQuery] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    it: true,
    comm: false,
    comp: false,
    elec: false,
  });

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredTracks = trackData
    .map((track) => {
      const filteredTopics = track.topics.filter((t) =>
        t.toLowerCase().includes(query.toLowerCase())
      );
      const matchesGroup = track.name.toLowerCase().includes(query.toLowerCase());
      return {
        ...track,
        filteredTopics: query ? (matchesGroup ? track.topics : filteredTopics) : track.topics,
        isVisible: query ? matchesGroup || filteredTopics.length > 0 : true,
      };
    })
    .filter((track) => track.isVisible);

  return (
    <section id="tracks" className="border-b border-brand-border bg-brand-surface scroll-mt-20">
      <div className="container-x py-20 md:py-24">
        {/* Header with Live Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[12.5px] tracking-wider uppercase text-brand-muted font-semibold mb-2"><E f="c.HomeTracks">{"Research Domains"}</E></p>
            <h2 className="font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] text-brand-text"><E f="c.HomeTracks">{"Conference Tracks"}</E></h2>
            <p className="mt-2 text-[14.5px] text-brand-muted"><E f="c.HomeTracks">{"Spanning 4 comprehensive engineering divisions with peer-reviewed presentation sessions."}</E></p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics (e.g., AI, Quantum)..."
              className="w-full border border-brand-border rounded-lg pl-10 pr-4 py-2.5 text-[14px] bg-white text-brand-text placeholder-brand-muted/60 focus:outline-none focus:border-[#1D5C82] shadow-sm"
            />
          </div>
        </div>

        {/* Tracks List */}
        {filteredTracks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-brand-border">
            <p className="text-[14.5px] text-brand-muted"><E f="c.HomeTracks">{"No topics found matching “"}</E><E f="c.HomeTracks">{query}</E><E f="c.HomeTracks">{"”."}</E></p>
            <button
              onClick={() => setQuery("")}
              className="mt-3 text-xs font-semibold text-[#0B6B4A] hover:underline"
            ><E f="c.HomeTracks">{"Clear Search"}</E></button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTracks.map((track) => {
              const isOpen = query ? true : !!openGroups[track.id];
              return (
                <div
                  key={track.id}
                  className="border border-brand-border rounded-xl bg-white overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => toggleGroup(track.id)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-brand-surface/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0B6B4A]" />
                      <span className="text-[16px] font-semibold text-brand-text"><E f="c.HomeTracks">{track.name}</E></span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-surface border border-brand-border text-brand-muted">
                        <E f="c.HomeTracks">{track.filteredTopics.length}</E><E f="c.HomeTracks">{" Topics"}</E></span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-brand-muted transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 flex flex-wrap gap-2 border-t border-brand-border/60">
                      {track.filteredTopics.map((topic) => (
                        <span
                          key={topic}
                          className="text-[13px] px-3.5 py-1.5 rounded-full border border-brand-border bg-brand-surface text-brand-text hover:border-brand-text transition-colors"
                        >
                          <E f="c.HomeTracks">{topic}</E>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/tracks" className="btn-outline text-xs inline-flex items-center gap-2">
            <span><E f="c.HomeTracks">{"Explore Track Details & Chairs"}</E></span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
