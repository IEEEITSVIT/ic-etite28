"use client";

import { useEffect, useRef } from "react";
import Image from "@/components/cms/EImage";
import Link from "next/link";
import { History, ExternalLink } from "lucide-react";
import E from "@/components/cms/E";

export default function WhatsIcetiteHistorySection() {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const statNumbers = el.querySelectorAll(".stat-num");
            statNumbers.forEach((stat) => {
              const target = parseInt(stat.getAttribute("data-target") || "0", 10);
              if (reduceMotion) {
                stat.textContent = target.toLocaleString();
                return;
              }
              let start: number | null = null;
              const duration = 1200;
              const step = (timestamp: number) => {
                if (!start) start = timestamp;
                const progress = Math.min((timestamp - start) / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                stat.textContent = Math.floor(easeOut * target).toLocaleString();
                if (progress < 1) {
                  requestAnimationFrame(step);
                } else {
                  stat.textContent = target.toLocaleString();
                }
              };
              requestAnimationFrame(step);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="border-b border-brand-border bg-brand-surface scroll-mt-20">
      <div className="container-x py-20 md:py-24">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-border bg-white text-[12px] font-semibold text-[#0B6B4A] mb-3">
            <History className="w-3.5 h-3.5" />
            <span><E f="c.WhatsIcetiteHistorySection">{"Conference Genesis & Evolution"}</E></span>
          </div>
          <h2 className="font-serif text-[clamp(1.8rem,3.4vw,2.7rem)] text-brand-text leading-tight"><E f="c.WhatsIcetiteHistorySection">{"What is ic-ETITE?"}</E></h2>
          <p className="mt-4 text-[15px] md:text-base leading-relaxed text-brand-text/80"><E f="c.WhatsIcetiteHistorySection">{"The "}</E><strong><E f="c.WhatsIcetiteHistorySection">{"International Conference on Emerging Trends in Information Technology and Engineering (ic-ETITE)"}</E></strong><E f="c.WhatsIcetiteHistorySection">{" "}</E><E f="c.WhatsIcetiteHistorySection">{"is a premier biennial symposium established by Vellore Institute of Technology (VIT) to advance foundational and applied scientific breakthroughs across computing, networking, electronics, and digital systems."}</E></p>
        </div>

        {/* Narrative & Conference Hall Image */}
        <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-center mb-20">
          <div className="md:col-span-6 space-y-4">
            <h3 className="font-serif text-2xl text-brand-text font-semibold"><E f="c.WhatsIcetiteHistorySection">{"A Worldwide Convergence of Scholarly Rigor"}</E></h3>
            <p className="text-[15px] leading-[1.85] text-brand-text/85"><E f="c.WhatsIcetiteHistorySection">{"Conceived in 2020 and expanded continuously, ic-ETITE offers an open, internationally respected podium where faculty, doctoral scholars, industry R&D architects, and student innovators present original research. Every accepted and presented paper undergoes stringent IEEE double-blind review and is submitted for archival in the "}</E><strong><E f="c.WhatsIcetiteHistorySection">{"IEEE Xplore® Digital Library"}</E></strong><E f="c.WhatsIcetiteHistorySection">{"."}</E></p>
            <p className="text-[15px] leading-[1.85] text-brand-text/85"><E f="c.WhatsIcetiteHistorySection">{"The conference emphasizes interdisciplinary synthesis — connecting cutting-edge information theory with real-world applications in autonomous robotics, quantum cybersecurity, machine intelligence, and sustainable edge architectures."}</E></p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link href="/call-for-papers" className="btn-primary text-xs"><E f="c.WhatsIcetiteHistorySection">{"Call for Papers Guidelines"}</E></Link>
              <a
                href="https://ieeexplore.ieee.org/xpl/conhome/9070069/proceeding"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-xs inline-flex items-center gap-1.5"
              >
                <span><E f="c.WhatsIcetiteHistorySection">{"Browse IEEE Xplore Archives"}</E></span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>
          </div>

          <div className="md:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-brand-border shadow-[0_10px_30px_rgba(16,27,46,0.08)] group">
              <Image
                src="/images/vit-auditorium.webp"
                alt="ic-ETITE International Conference Session in Grand Auditorium"
                width={800}
                height={450}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-brand-text/90 via-brand-text/40 to-transparent p-5 text-white">
                <p className="text-[14px] font-semibold"><E f="c.WhatsIcetiteHistorySection">{"ic-ETITE Plenary Keynote Session"}</E></p>
                <p className="text-[12px] text-white/75"><E f="c.WhatsIcetiteHistorySection">{"Grand Auditorium at VIT Vellore · International Delegates & IEEE Session"}</E></p>
              </div>
            </div>
          </div>
        </div>

        {/* The 3 Editions Timeline & Heritage */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[12px] uppercase tracking-wider text-brand-muted font-semibold mb-2"><E f="c.WhatsIcetiteHistorySection">{"The Legacy"}</E></p>
            <h3 className="font-serif text-2xl md:text-3xl text-brand-text"><E f="c.WhatsIcetiteHistorySection">{"From Inception to the Frontier: 2020, 2024 & 2028"}</E></h3>
          </div>

          {/* Timeline Nodes */}
          <div className="relative mb-14">
            <div className="hidden md:block absolute left-0 right-0 top-[14px] h-[2px] bg-gradient-to-r from-brand-border via-[#0B6B4A] to-[#1D5C82]" />
            <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
              {/* 2020 */}
              <div className="relative">
                <div className="mx-auto w-[13px] h-[13px] rounded-full bg-brand-text mb-3 relative z-10 ring-4 ring-white" />
                <p className="font-serif text-xl font-bold text-brand-text"><E f="c.WhatsIcetiteHistorySection">{"ic-ETITE'20"}</E></p>
                <p className="text-[12px] text-brand-muted mt-0.5"><E f="c.WhatsIcetiteHistorySection">{"First Edition · Feb 2020"}</E></p>
                <span className="inline-block mt-2 text-[11px] px-2.5 py-0.5 rounded-full bg-white border border-brand-border text-brand-muted"><E f="c.WhatsIcetiteHistorySection">{"IEEE Xplore Published"}</E></span>
              </div>

              {/* 2024 */}
              <div className="relative">
                <div className="mx-auto w-[13px] h-[13px] rounded-full bg-[#1D5C82] mb-3 relative z-10 ring-4 ring-white" />
                <p className="font-serif text-xl font-bold text-[#1D5C82]"><E f="c.WhatsIcetiteHistorySection">{"ic-ETITE'24"}</E></p>
                <p className="text-[12px] text-brand-muted mt-0.5"><E f="c.WhatsIcetiteHistorySection">{"Second Edition · Feb 2024"}</E></p>
                <span className="inline-block mt-2 text-[11px] px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-[#1D5C82] font-semibold"><E f="c.WhatsIcetiteHistorySection">{"1,688 Papers Received"}</E></span>
              </div>

              {/* 2028 */}
              <div className="relative">
                <div className="mx-auto w-[15px] h-[15px] rounded-full bg-[#0B6B4A] mb-3 relative z-10 ring-4 ring-emerald-100" />
                <p className="font-serif text-xl font-bold text-[#0B6B4A]"><E f="c.WhatsIcetiteHistorySection">{"ic-ETITE'28"}</E></p>
                <p className="text-[12px] text-brand-muted mt-0.5"><E f="c.WhatsIcetiteHistorySection">{"Third Edition · Feb 2028"}</E></p>
                <span className="inline-block mt-2 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#0B6B4A] font-semibold animate-pulse"><E f="c.WhatsIcetiteHistorySection">{"Current Edition"}</E></span>
              </div>
            </div>
          </div>

          {/* Cards for ic-ETITE'24 and ic-ETITE'20 */}
          <div ref={statsRef} className="grid md:grid-cols-2 gap-8">
            {/* ic-ETITE'24 */}
            <div className="bg-white border border-brand-border rounded-2xl p-7 md:p-9 shadow-sm hover:border-[#1D5C82] transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#1D5C82] font-semibold"><E f="c.WhatsIcetiteHistorySection">{"Second Edition"}</E></span>
                  <h4 className="font-serif text-2xl text-brand-text font-semibold mt-1"><E f="c.WhatsIcetiteHistorySection">{"ic-ETITE'24 Highlights"}</E></h4>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-md bg-sky-50 text-[#1D5C82] font-semibold border border-sky-100"><E f="c.WhatsIcetiteHistorySection">{"22–23 Feb 2024"}</E></span>
              </div>
              <p className="text-[13.5px] text-brand-muted mb-6 leading-relaxed"><E f="c.WhatsIcetiteHistorySection">{"Assembled over 1,000 international delegates across 19 countries, technically co-sponsored by IEEE, with key industry collaborations from Intel, Cisco, and Yellow.ai."}</E></p>

              {/* Count-up Stats */}
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4 pt-4 border-t border-brand-border">
                <div>
                  <dt className="stat-num text-2xl sm:text-3xl font-serif font-bold text-brand-text tabular-nums" data-target="1688"><E f="c.WhatsIcetiteHistorySection">{"0"}</E></dt>
                  <dd className="text-[11.5px] text-brand-muted mt-0.5"><E f="c.WhatsIcetiteHistorySection">{"Papers Received"}</E></dd>
                </div>
                <div>
                  <dt className="stat-num text-2xl sm:text-3xl font-serif font-bold text-brand-text tabular-nums" data-target="19"><E f="c.WhatsIcetiteHistorySection">{"0"}</E></dt>
                  <dd className="text-[11.5px] text-brand-muted mt-0.5"><E f="c.WhatsIcetiteHistorySection">{"Countries"}</E></dd>
                </div>
                <div>
                  <dt className="stat-num text-2xl sm:text-3xl font-serif font-bold text-brand-text tabular-nums" data-target="32"><E f="c.WhatsIcetiteHistorySection">{"0"}</E></dt>
                  <dd className="text-[11.5px] text-brand-muted mt-0.5"><E f="c.WhatsIcetiteHistorySection">{"Technical Sessions"}</E></dd>
                </div>
                <div>
                  <dt className="stat-num text-2xl sm:text-3xl font-serif font-bold text-brand-text tabular-nums" data-target="22"><E f="c.WhatsIcetiteHistorySection">{"0"}</E></dt>
                  <dd className="text-[11.5px] text-brand-muted mt-0.5"><E f="c.WhatsIcetiteHistorySection">{"Keynote Sessions"}</E></dd>
                </div>
                <div>
                  <dt className="stat-num text-2xl sm:text-3xl font-serif font-bold text-brand-text tabular-nums" data-target="1088"><E f="c.WhatsIcetiteHistorySection">{"0"}</E></dt>
                  <dd className="text-[11.5px] text-brand-muted mt-0.5"><E f="c.WhatsIcetiteHistorySection">{"Participants"}</E></dd>
                </div>
                <div>
                  <dt className="stat-num text-2xl sm:text-3xl font-serif font-bold text-brand-text tabular-nums" data-target="683"><E f="c.WhatsIcetiteHistorySection">{"0"}</E></dt>
                  <dd className="text-[11.5px] text-brand-muted mt-0.5"><E f="c.WhatsIcetiteHistorySection">{"BOLT 2.0 Hackathon"}</E></dd>
                </div>
              </dl>
            </div>

            {/* ic-ETITE'20 */}
            <div className="bg-white border border-brand-border rounded-2xl p-7 md:p-9 shadow-sm hover:border-[#0B6B4A] transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#0B6B4A] font-semibold"><E f="c.WhatsIcetiteHistorySection">{"Inaugural Edition"}</E></span>
                  <h4 className="font-serif text-2xl text-brand-text font-semibold mt-1"><E f="c.WhatsIcetiteHistorySection">{"ic-ETITE'20 Foundation"}</E></h4>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-[#0B6B4A] font-semibold border border-emerald-100"><E f="c.WhatsIcetiteHistorySection">{"24–25 Feb 2020"}</E></span>
              </div>
              <p className="text-[13.5px] text-brand-muted mb-6 leading-relaxed"><E f="c.WhatsIcetiteHistorySection">{"The inaugural edition laid the institutional benchmark for excellence with full IEEE Xplore digital proceedings, multi-track presentations, and the launch of the national student hackathon series."}</E></p>

              <ul className="space-y-3 text-[14px] text-brand-text/85 pt-4 border-t border-brand-border">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B4A] mt-2 shrink-0" />
                  <span><E f="c.WhatsIcetiteHistorySection">{"Technically co-sponsored by IEEE and organized by SCORE, VIT Vellore"}</E></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B4A] mt-2 shrink-0" />
                  <span><E f="c.WhatsIcetiteHistorySection">{"Official IEEE Xplore archival: "}</E><strong className="font-mono text-xs"><E f="c.WhatsIcetiteHistorySection">{"ISBN 978-1-7281-4142-8"}</E></strong>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B4A] mt-2 shrink-0" />
                  <span><E f="c.WhatsIcetiteHistorySection">{"21 technical sessions & 17 distinguished keynote sessions from USA, Finland & India"}</E></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B4A] mt-2 shrink-0" />
                  <span><E f="c.WhatsIcetiteHistorySection">{"Inaugural BOLT hackathon hosted with 500+ participants and ₹1,00,000 awards"}</E></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
