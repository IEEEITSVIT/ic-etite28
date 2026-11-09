"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { conferenceTracksData, ResearchTrack } from "@/data/tracks";
import {
  Search,
  Database,
  Radio,
  Cpu,
  Zap,
  CheckCircle2,
  ArrowRight,
  Layers,
  BookOpen,
  X,
} from "lucide-react";

interface TrackTheme {
  icon: typeof Database;
  cardBg: string;
  cardBorder: string;
  cardHoverBg: string;
  activeRing: string;
  activeBorder: string;
  bannerBg: string;
  bannerText: string;
  bannerSubtitle: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  tagColor: string;
  topicCardBg: string;
  topicBorder: string;
  topicHoverBorder: string;
  topicIconColor: string;
  accentColor: string;
  lightBg: string;
}

const trackThemeConfig: Record<string, TrackTheme> = {
  it: {
    icon: Database,
    cardBg: "bg-[#F0F5FA]",
    cardBorder: "border-[#B8D5ED]",
    cardHoverBg: "hover:bg-[#E6F0FA]",
    activeRing: "ring-4 ring-[#002147]/15",
    activeBorder: "border-[#002147]",
    bannerBg: "bg-gradient-to-br from-[#E6F0FA] via-[#EDF4FC] to-[#F2F7FC]",
    bannerText: "text-[#002147]",
    bannerSubtitle: "text-[#1E3A5F]",
    badgeBg: "bg-[#002147]/10",
    badgeText: "text-[#002147]",
    badgeBorder: "border-[#002147]/20",
    tagColor: "bg-[#002147] text-white",
    topicCardBg: "bg-white",
    topicBorder: "border-[#D0E2F2]",
    topicHoverBorder: "hover:border-[#002147]",
    topicIconColor: "text-[#002147]",
    accentColor: "#002147",
    lightBg: "bg-[#F4F8FC]",
  },
  comm: {
    icon: Radio,
    cardBg: "bg-[#F0F9FA]",
    cardBorder: "border-[#A5DFE8]",
    cardHoverBg: "hover:bg-[#E0F3F7]",
    activeRing: "ring-4 ring-[#004B87]/15",
    activeBorder: "border-[#004B87]",
    bannerBg: "bg-gradient-to-br from-[#E0F3F7] via-[#ECF9FB] to-[#F0FAFB]",
    bannerText: "text-[#004B87]",
    bannerSubtitle: "text-[#13557A]",
    badgeBg: "bg-[#004B87]/10",
    badgeText: "text-[#004B87]",
    badgeBorder: "border-[#004B87]/20",
    tagColor: "bg-[#004B87] text-white",
    topicCardBg: "bg-white",
    topicBorder: "border-[#C0E7EE]",
    topicHoverBorder: "hover:border-[#004B87]",
    topicIconColor: "text-[#004B87]",
    accentColor: "#004B87",
    lightBg: "bg-[#F3FAF8]",
  },
  comp: {
    icon: Cpu,
    cardBg: "bg-[#F2F5FC]",
    cardBorder: "border-[#BACCEE]",
    cardHoverBg: "hover:bg-[#E7EEFA]",
    activeRing: "ring-4 ring-[#1E3A8A]/15",
    activeBorder: "border-[#1E3A8A]",
    bannerBg: "bg-gradient-to-br from-[#E3ECF9] via-[#ECF2FB] to-[#F4F7FD]",
    bannerText: "text-[#1E3A8A]",
    bannerSubtitle: "text-[#284B9E]",
    badgeBg: "bg-[#1E3A8A]/10",
    badgeText: "text-[#1E3A8A]",
    badgeBorder: "border-[#1E3A8A]/20",
    tagColor: "bg-[#1E3A8A] text-white",
    topicCardBg: "bg-white",
    topicBorder: "border-[#CAD9F2]",
    topicHoverBorder: "hover:border-[#1E3A8A]",
    topicIconColor: "text-[#1E3A8A]",
    accentColor: "#1E3A8A",
    lightBg: "bg-[#F6F8FD]",
  },
  elec: {
    icon: Zap,
    cardBg: "bg-[#F0F7F9]",
    cardBorder: "border-[#A8D3DC]",
    cardHoverBg: "hover:bg-[#E3F1F4]",
    activeRing: "ring-4 ring-[#0E6073]/15",
    activeBorder: "border-[#0E6073]",
    bannerBg: "bg-gradient-to-br from-[#DBEEF3] via-[#E8F5F8] to-[#F2F9FB]",
    bannerText: "text-[#0E6073]",
    bannerSubtitle: "text-[#156D82]",
    badgeBg: "bg-[#0E6073]/10",
    badgeText: "text-[#0E6073]",
    badgeBorder: "border-[#0E6073]/20",
    tagColor: "bg-[#0E6073] text-white",
    topicCardBg: "bg-white",
    topicBorder: "border-[#BFE0E7]",
    topicHoverBorder: "hover:border-[#0E6073]",
    topicIconColor: "text-[#0E6073]",
    accentColor: "#0E6073",
    lightBg: "bg-[#F5FAFC]",
  },
};

export default function TracksSection({ isPreview = false }: { isPreview?: boolean }) {
  const [activeTrackId, setActiveTrackId] = useState<string>("it");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"focused" | "all">("focused");

  // Common Search Filter across all research tracks
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return conferenceTracksData.map((track) => {
      if (!q) {
        return {
          track,
          matchedTopics: track.topics,
          matchesTitle: false,
          matchesDescription: false,
          totalMatches: track.topics.length,
        };
      }

      const matchesTitle = track.title.toLowerCase().includes(q);
      const matchesDescription = track.description.toLowerCase().includes(q);
      const matchesNumber = track.number.toLowerCase().includes(q);
      const matchedTopics = track.topics.filter((topic) =>
        topic.toLowerCase().includes(q)
      );

      const isMatch = matchesTitle || matchesDescription || matchesNumber || matchedTopics.length > 0;

      return {
        track,
        matchedTopics: (matchesTitle || matchesDescription) ? track.topics : matchedTopics,
        matchesTitle,
        matchesDescription,
        totalMatches: (matchesTitle || matchesDescription) ? track.topics.length : matchedTopics.length,
        isMatch,
      };
    });
  }, [searchQuery]);

  const totalMatchingTopics = useMemo(() => {
    if (!searchQuery.trim()) return 0;
    return searchResults.reduce((acc, curr) => (curr.isMatch ? acc + curr.matchedTopics.length : acc), 0);
  }, [searchQuery, searchResults]);

  const filteredTracks = useMemo(() => {
    if (!searchQuery.trim()) return conferenceTracksData;
    return searchResults
      .filter((r) => r.isMatch)
      .map((r) => ({
        ...r.track,
        topics: r.matchedTopics,
      }));
  }, [searchQuery, searchResults]);

  const activeTrack = useMemo(() => {
    const foundInFiltered = filteredTracks.find((t) => t.id === activeTrackId);
    if (foundInFiltered) return foundInFiltered;
    return filteredTracks[0] || conferenceTracksData[0];
  }, [filteredTracks, activeTrackId]);

  const totalTopicsCount = useMemo(() => {
    return conferenceTracksData.reduce((acc, t) => acc + t.topics.length, 0);
  }, []);

  const handleScrollToSubmit = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById("submit");
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", "#submit");
    }
  };

  return (
    <section id="tracks" className="py-8 sm:py-12 bg-[#FAFBFD] border-b border-[#E2E8F0] scroll-mt-24">
      <div className="container-x">
        {/* Section Header Controls */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#002147]/5 border border-[#002147]/15 text-xs font-bold text-[#002147] uppercase tracking-wider mb-4">
            <Layers className="w-3.5 h-3.5 text-[#F5A623]" />
            <span>4 Pillars · {totalTopicsCount}+ Indicative Research Specializations</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#002147] mb-3">
            Technical Research Tracks
          </h2>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl mx-auto mb-8">
            Authors are invited to submit original, high-impact research papers aligned with any of
            the 4 core tracks. All accepted papers will be submitted for inclusion into{" "}
            <strong>IEEE Xplore®</strong>.
          </p>

          {/* =========================================================================
              COMMON UNIVERSAL SEARCH BAR FOR ALL TRACKS
          ========================================================================= */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center shadow-md rounded-2xl bg-white border-2 border-slate-300 focus-within:border-[#002147] focus-within:ring-4 focus-within:ring-[#002147]/10 transition-all">
              <Search className="w-5 h-5 text-[#002147] ml-4 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search research topics (e.g., Quantum, 5G, VLSI, Cloud, Robotics)..."
                className="w-full px-3.5 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none rounded-2xl bg-transparent"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mr-3 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Search Match Status */}
            {searchQuery.trim() && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
                <span className="font-semibold text-slate-700">
                  Found <strong className="text-[#002147]">{totalMatchingTopics}</strong> topic{totalMatchingTopics === 1 ? "" : "s"} matching &quot;{searchQuery}&quot;
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {searchResults.map(({ track, isMatch, totalMatches }) => {
                    const theme = trackThemeConfig[track.id] || trackThemeConfig.it;
                    if (!isMatch) return null;
                    return (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => {
                          setActiveTrackId(track.id);
                          setViewMode("focused");
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 ${theme.cardBg} ${theme.cardBorder} ${
                          activeTrack?.id === track.id ? "ring-2 ring-[#002147]" : ""
                        }`}
                      >
                        <span>{track.shortCode}:</span>
                        <span>{totalMatches}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            TRACK SELECTION CARDS WITH LIGHT PASTEL COLORS (Conference Themed)
        ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {conferenceTracksData.map((track) => {
            const theme = trackThemeConfig[track.id] || trackThemeConfig.it;
            const Icon = theme.icon;
            const isActive = activeTrack?.id === track.id;
            const matchInfo = searchResults.find((r) => r.track.id === track.id);
            const matchesCount = searchQuery.trim() ? (matchInfo?.isMatch ? matchInfo.totalMatches : 0) : track.topics.length;

            return (
              <button
                key={track.id}
                onClick={() => {
                  setActiveTrackId(track.id);
                  setViewMode("focused");
                }}
                className={`relative rounded-2xl p-5 sm:p-6 text-left transition-all duration-300 border-2 flex flex-col justify-between overflow-hidden group shadow-xs hover:shadow-md ${
                  theme.cardBg
                } ${
                  isActive && viewMode === "focused"
                    ? `${theme.activeBorder} ${theme.activeRing} -translate-y-1 shadow-md`
                    : `${theme.cardBorder} ${theme.cardHoverBg}`
                }`}
              >
                {/* Top Accent Line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 transition-opacity ${
                    isActive && viewMode === "focused"
                      ? "opacity-100"
                      : "opacity-40 group-hover:opacity-100"
                  }`}
                  style={{ backgroundColor: theme.accentColor }}
                />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider font-mono ${theme.tagColor}`}
                    >
                      {track.number}
                    </span>
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center bg-white/80 border border-black/5 shadow-2xs`}
                      style={{ color: theme.accentColor }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3
                    className="font-serif text-lg sm:text-xl font-bold leading-snug mb-1"
                    style={{ color: theme.accentColor }}
                  >
                    {track.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    {searchQuery.trim() ? (
                      <span className="font-bold text-[#002147]">
                        {matchesCount} matched topic{matchesCount === 1 ? "" : "s"}
                      </span>
                    ) : (
                      `${track.topics.length} Research Topics`
                    )}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-xs font-semibold">
                  <span className={isActive ? "font-bold text-[#002147]" : "text-slate-600"}>
                    {isActive ? "Viewing Track" : "Explore Track"}
                  </span>
                  <span
                    className="text-sm font-bold transition-transform group-hover:translate-x-1"
                    style={{ color: theme.accentColor }}
                  >
                    →
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* View Toggle Bar (Focused Track vs All Tracks) */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("focused")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                viewMode === "focused"
                  ? "bg-[#002147] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Focused Track View
            </button>
            <button
              onClick={() => setViewMode("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                viewMode === "all"
                  ? "bg-[#002147] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              All 4 Tracks Grid
            </button>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-slate-500 hover:text-[#002147] underline font-medium"
            >
              Reset Search
            </button>
          )}
        </div>

        {/* =========================================================================
            1. FOCUSED VIEW WITH MATCHING LIGHT PASTEL THEME
        ========================================================================= */}
        {viewMode === "focused" && activeTrack && (() => {
          const theme = trackThemeConfig[activeTrack.id] || trackThemeConfig.it;
          const Icon = theme.icon;

          return (
            <div className={`rounded-3xl border-2 shadow-lg overflow-hidden ${theme.cardBorder}`}>
              {/* Pastel Track Banner Header */}
              <div className={`${theme.bannerBg} p-6 sm:p-10 border-b ${theme.cardBorder} relative overflow-hidden`}>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 text-xs font-bold font-mono uppercase tracking-widest mb-3 border border-black/10 shadow-2xs">
                      <span style={{ color: theme.accentColor }}>{activeTrack.number}</span>
                      <span>·</span>
                      <span className="text-slate-600">{activeTrack.shortCode}</span>
                    </div>

                    <h3 className={`font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight ${theme.bannerText} mb-3`}>
                      {activeTrack.title}
                    </h3>

                    <p className={`text-sm sm:text-base md:text-lg leading-relaxed font-normal ${theme.bannerSubtitle}`}>
                      {activeTrack.description}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3">
                    <Link
                      href="/call-for-papers#submit"
                      onClick={handleScrollToSubmit}
                      className="btn-gold py-3 px-6 text-sm font-bold inline-flex items-center justify-center gap-2 text-center shadow-md hover:scale-105 transition-transform"
                    >
                      <span>Submit to this Track</span>
                    </Link>
                    <Link
                      href="/call-for-papers"
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 border border-slate-200 transition-colors text-center shadow-2xs"
                    >
                      <span>Submission Guidelines</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Topics Section with Matching Pastel Background Canvas */}
              <div className={`p-6 sm:p-10 ${theme.lightBg}`}>
                <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-black/10">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" style={{ color: theme.accentColor }} />
                    <h4 className="text-base sm:text-lg font-bold text-[#002147]">
                      Indicative Research Topics &amp; Domains
                    </h4>
                    <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`}>
                      {activeTrack.topics.length} topics
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 hidden sm:inline">
                    Scope is not restricted to listed keywords
                  </span>
                </div>

                {/* Topics Grid with Pastel Borders & Icons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                  {activeTrack.topics.map((topic) => (
                    <div
                      key={topic}
                      className={`p-4 rounded-xl ${theme.topicCardBg} border ${theme.topicBorder} ${theme.topicHoverBorder} hover:shadow-md transition-all flex items-start gap-3 group`}
                    >
                      <CheckCircle2
                        className={`w-5 h-5 shrink-0 mt-0.5 transition-transform group-hover:scale-110 ${theme.topicIconColor}`}
                      />
                      <span className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">
                        {topic}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* =========================================================================
            2. ALL 4 TRACKS GRID (EACH WITH ITS DISTINCT PASTEL PALETTE)
        ========================================================================= */}
        {viewMode === "all" && (
          <div className="space-y-10">
            {filteredTracks.map((track) => {
              const theme = trackThemeConfig[track.id] || trackThemeConfig.it;
              const Icon = theme.icon;

              return (
                <div
                  key={track.id}
                  className={`rounded-3xl border-2 shadow-md p-6 sm:p-8 ${theme.cardBg} ${theme.cardBorder}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-black/10">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase font-mono ${theme.tagColor}`}>
                          {track.number}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-600">
                          {track.shortCode}
                        </span>
                      </div>
                      <h3
                        className="font-serif text-2xl sm:text-3xl font-bold mt-1"
                        style={{ color: theme.accentColor }}
                      >
                        {track.title}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-700 mt-1 max-w-3xl leading-relaxed">
                        {track.description}
                      </p>
                    </div>
                    <Link
                      href="/call-for-papers#submit"
                      onClick={handleScrollToSubmit}
                      className="btn-gold text-xs py-2.5 px-4 inline-flex items-center gap-1.5 shrink-0 self-start sm:self-center font-bold shadow-sm"
                    >
                      <span>Submit to Track</span>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {track.topics.map((topic) => (
                      <div
                        key={topic}
                        className={`p-3.5 rounded-xl bg-white border ${theme.topicBorder} ${theme.topicHoverBorder} transition-all flex items-start gap-2.5 text-sm sm:text-base font-semibold text-slate-800 shadow-2xs`}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 mt-0.5 ${theme.topicIconColor}`}
                        />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {isPreview && (
          <div className="mt-12 text-center">
            <Link
              href="/tracks"
              className="btn-primary inline-flex items-center gap-2 py-3 px-6 text-sm font-bold"
            >
              <span>Explore All 4 Research Tracks in Detail</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
