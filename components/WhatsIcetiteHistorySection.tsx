"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { History, ExternalLink } from "lucide-react";

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
    <section id="about" className="border-b border-[#E4E7EC] bg-[#F7F8FA] scroll-mt-20">
      <div className="container-x py-20 md:py-24">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E4E7EC] bg-white text-[12px] font-semibold text-[#0B6B4A] mb-3">
            <History className="w-3.5 h-3.5" />
            <span>Conference Genesis &amp; Evolution</span>
          </div>
          <h2 className="font-serif text-[clamp(1.8rem,3.4vw,2.7rem)] text-[#101B2E] leading-tight">
            What is ic-ETITE?
          </h2>
          <p className="mt-4 text-[15px] md:text-base leading-relaxed text-[#101B2E]/80">
            The <strong>International Conference on Emerging Trends in Information Technology and Engineering (ic-ETITE)</strong>{" "}
            is a premier biennial symposium established by Vellore Institute of Technology (VIT) to advance foundational
            and applied scientific breakthroughs across computing, networking, electronics, and digital systems.
          </p>
        </div>

        {/* Narrative & Conference Hall Image */}
        <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-center mb-20">
          <div className="md:col-span-6 space-y-4">
            <h3 className="font-serif text-2xl text-[#101B2E] font-semibold">
              A Worldwide Convergence of Scholarly Rigor
            </h3>
            <p className="text-[15px] leading-[1.85] text-[#101B2E]/85">
              Conceived in 2020 and expanded continuously, ic-ETITE offers an open, internationally respected podium where
              faculty, doctoral scholars, industry R&amp;D architects, and student innovators present original research.
              Every accepted and presented paper undergoes stringent IEEE double-blind review and is submitted for
              archival in the <strong>IEEE Xplore® Digital Library</strong>.
            </p>
            <p className="text-[15px] leading-[1.85] text-[#101B2E]/85">
              The conference emphasizes interdisciplinary synthesis — connecting cutting-edge information theory with
              real-world applications in autonomous robotics, quantum cybersecurity, machine intelligence, and
              sustainable edge architectures.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link href="/call-for-papers" className="btn-primary text-xs">
                Call for Papers Guidelines
              </Link>
              <a
                href="https://ieeexplore.ieee.org/xpl/conhome/9070069/proceeding"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-xs inline-flex items-center gap-1.5"
              >
                <span>Browse IEEE Xplore Archives</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>
          </div>

          <div className="md:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-[#E4E7EC] shadow-[0_10px_30px_rgba(16,27,46,0.08)] group">
              <Image
                src="/images/vit-auditorium.webp"
                alt="ic-ETITE International Conference Session in Grand Auditorium"
                width={800}
                height={450}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#101B2E]/90 via-[#101B2E]/40 to-transparent p-5 text-white">
                <p className="text-[14px] font-semibold">ic-ETITE Plenary Keynote Session</p>
                <p className="text-[12px] text-white/75">Grand Auditorium at VIT Vellore · International Delegates &amp; IEEE Session</p>
              </div>
            </div>
          </div>
        </div>

        {/* The 3 Editions Timeline & Heritage */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[12px] uppercase tracking-wider text-[#4A5568] font-semibold mb-2">The Legacy</p>
            <h3 className="font-serif text-2xl md:text-3xl text-[#101B2E]">
              From Inception to the Frontier: 2020, 2024 &amp; 2028
            </h3>
          </div>

          {/* Timeline Nodes */}
          <div className="relative mb-14">
            <div className="hidden md:block absolute left-0 right-0 top-[14px] h-[2px] bg-gradient-to-r from-[#E4E7EC] via-[#0B6B4A] to-[#1D5C82]" />
            <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
              {/* 2020 */}
              <div className="relative">
                <div className="mx-auto w-[13px] h-[13px] rounded-full bg-[#101B2E] mb-3 relative z-10 ring-4 ring-white" />
                <p className="font-serif text-xl font-bold text-[#101B2E]">ic-ETITE&apos;20</p>
                <p className="text-[12px] text-[#4A5568] mt-0.5">First Edition · Feb 2020</p>
                <span className="inline-block mt-2 text-[11px] px-2.5 py-0.5 rounded-full bg-white border border-[#E4E7EC] text-[#4A5568]">
                  IEEE Xplore Published
                </span>
              </div>

              {/* 2024 */}
              <div className="relative">
                <div className="mx-auto w-[13px] h-[13px] rounded-full bg-[#1D5C82] mb-3 relative z-10 ring-4 ring-white" />
                <p className="font-serif text-xl font-bold text-[#1D5C82]">ic-ETITE&apos;24</p>
                <p className="text-[12px] text-[#4A5568] mt-0.5">Second Edition · Feb 2024</p>
                <span className="inline-block mt-2 text-[11px] px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-[#1D5C82] font-semibold">
                  1,688 Papers Received
                </span>
              </div>

              {/* 2028 */}
              <div className="relative">
                <div className="mx-auto w-[15px] h-[15px] rounded-full bg-[#0B6B4A] mb-3 relative z-10 ring-4 ring-emerald-100" />
                <p className="font-serif text-xl font-bold text-[#0B6B4A]">ic-ETITE&apos;28</p>
                <p className="text-[12px] text-[#4A5568] mt-0.5">Third Edition · Feb 2028</p>
                <span className="inline-block mt-2 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#0B6B4A] font-semibold animate-pulse">
                  Current Edition
                </span>
              </div>
            </div>
          </div>

          {/* Cards for ic-ETITE'24 and ic-ETITE'20 */}
          <div ref={statsRef} className="grid md:grid-cols-2 gap-8">
            {/* ic-ETITE'24 */}
            <div className="bg-white border border-[#E4E7EC] rounded-2xl p-7 md:p-9 shadow-sm hover:border-[#1D5C82] transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#1D5C82] font-semibold">
                    Second Edition
                  </span>
                  <h4 className="font-serif text-2xl text-[#101B2E] font-semibold mt-1">ic-ETITE&apos;24 Highlights</h4>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-md bg-sky-50 text-[#1D5C82] font-semibold border border-sky-100">
                  22–23 Feb 2024
                </span>
              </div>
              <p className="text-[13.5px] text-[#4A5568] mb-6 leading-relaxed">
                Assembled over 1,000 international delegates across 19 countries, technically co-sponsored by IEEE,
                with key industry collaborations from Intel, Cisco, and Yellow.ai.
              </p>

              {/* Count-up Stats */}
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4 pt-4 border-t border-[#E4E7EC]">
                <div>
                  <dt className="stat-num text-2xl sm:text-3xl font-serif font-bold text-[#101B2E] tabular-nums" data-target="1688">
                    0
                  </dt>
                  <dd className="text-[11.5px] text-[#4A5568] mt-0.5">Papers Received</dd>
                </div>
                <div>
                  <dt className="stat-num text-2xl sm:text-3xl font-serif font-bold text-[#101B2E] tabular-nums" data-target="19">
                    0
                  </dt>
                  <dd className="text-[11.5px] text-[#4A5568] mt-0.5">Countries</dd>
                </div>
                <div>
                  <dt className="stat-num text-2xl sm:text-3xl font-serif font-bold text-[#101B2E] tabular-nums" data-target="32">
                    0
                  </dt>
                  <dd className="text-[11.5px] text-[#4A5568] mt-0.5">Technical Sessions</dd>
                </div>
                <div>
                  <dt className="stat-num text-2xl sm:text-3xl font-serif font-bold text-[#101B2E] tabular-nums" data-target="22">
                    0
                  </dt>
                  <dd className="text-[11.5px] text-[#4A5568] mt-0.5">Keynote Sessions</dd>
                </div>
                <div>
                  <dt className="stat-num text-2xl sm:text-3xl font-serif font-bold text-[#101B2E] tabular-nums" data-target="1088">
                    0
                  </dt>
                  <dd className="text-[11.5px] text-[#4A5568] mt-0.5">Participants</dd>
                </div>
                <div>
                  <dt className="stat-num text-2xl sm:text-3xl font-serif font-bold text-[#101B2E] tabular-nums" data-target="683">
                    0
                  </dt>
                  <dd className="text-[11.5px] text-[#4A5568] mt-0.5">BOLT 2.0 Hackathon</dd>
                </div>
              </dl>
            </div>

            {/* ic-ETITE'20 */}
            <div className="bg-white border border-[#E4E7EC] rounded-2xl p-7 md:p-9 shadow-sm hover:border-[#0B6B4A] transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#0B6B4A] font-semibold">
                    Inaugural Edition
                  </span>
                  <h4 className="font-serif text-2xl text-[#101B2E] font-semibold mt-1">ic-ETITE&apos;20 Foundation</h4>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-[#0B6B4A] font-semibold border border-emerald-100">
                  24–25 Feb 2020
                </span>
              </div>
              <p className="text-[13.5px] text-[#4A5568] mb-6 leading-relaxed">
                The inaugural edition laid the institutional benchmark for excellence with full IEEE Xplore digital
                proceedings, multi-track presentations, and the launch of the national student hackathon series.
              </p>

              <ul className="space-y-3 text-[14px] text-[#101B2E]/85 pt-4 border-t border-[#E4E7EC]">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B4A] mt-2 shrink-0" />
                  <span>Technically co-sponsored by IEEE and organized by SCORE, VIT Vellore</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B4A] mt-2 shrink-0" />
                  <span>
                    Official IEEE Xplore archival: <strong className="font-mono text-xs">ISBN 978-1-7281-4142-8</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B4A] mt-2 shrink-0" />
                  <span>21 technical sessions &amp; 17 distinguished keynote sessions from USA, Finland &amp; India</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B4A] mt-2 shrink-0" />
                  <span>Inaugural BOLT hackathon hosted with 500+ participants and ₹1,00,000 awards</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
