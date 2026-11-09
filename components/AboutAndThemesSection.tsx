"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Award, Cpu, Globe2, ArrowRight } from "lucide-react";

export default function AboutAndThemesSection() {
  return (
    <section id="about" className="bg-white border-b border-[#E2E8F0] scroll-mt-20">
      <div className="container-x py-10 md:py-14">
        <div className="divide-y divide-slate-200/80 space-y-10 md:space-y-14">
          {/* =========================================================================
              1. ABOUT IC-ETITE'28
          ========================================================================= */}
          <div className="flow-root pt-0">
            {/* Enlarged Floated Image on Desktop (Right) */}
            <div className="w-full sm:w-[480px] md:w-[540px] lg:w-[600px] xl:w-[640px] md:float-right md:ml-8 md:mb-5 mb-6">
              <div className="p-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
                <div className="relative w-full aspect-[16/10] sm:aspect-[3/2] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <Image
                    src="/images/004A3218.webp"
                    alt="Dignitaries releasing conference proceedings on dais at ic-ETITE International Conference"
                    fill
                    sizes="(max-width: 1024px) 100vw, 640px"
                    className="object-cover object-center hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <p className="text-xs text-slate-600 font-medium mt-2 px-1 text-center">
                  Dignitaries and guests of honour on the Anna Auditorium dais at ic-ETITE
                </p>
              </div>
            </div>

            {/* Text flowing all around the picture */}
            <div className="space-y-3.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4DB] border border-[#F5A623]/50 text-xs font-bold text-[#002147] uppercase tracking-wider w-fit">
                <span>Organized by SCORE · VIT, Vellore, India</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#E05A00] font-serif">
                About ic-ETITE’28
              </h2>
              <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
                Third International Conference on Emerging Trends in Information Technology and Engineering (ic-ETITE’28) will be held at Vellore Institute of Technology (VIT), Vellore, India, on 10–11 February 2028.
              </p>
              <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
                The conference aims to provide an international platform for researchers, academicians, engineers, industry professionals, and students to present and exchange innovative research in Information Technology, Computer Engineering, Communication Engineering, Electronics Engineering, and related emerging areas. ic-ETITE’28 seeks to foster knowledge sharing, interdisciplinary collaboration, industry–academia interaction, and future research partnerships among participants from around the world.
              </p>
              <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
                Original and unpublished research papers addressing emerging challenges, innovative technologies, and recent developments are invited from researchers worldwide. The conference is committed to promoting research excellence and facilitating the dissemination of knowledge that contributes to the advancement of science, technology, and education.
              </p>
            </div>

            <div className="clear-both pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#002147] text-white text-sm font-semibold hover:bg-[#003366] transition-colors shadow-sm hover:shadow group"
              >
                <span>Read More About Conference</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* =========================================================================
              2. THEME OF THE CONFERENCE
          ========================================================================= */}
          <div className="flow-root pt-10 md:pt-14">
            {/* Enlarged Floated Image on Desktop (Left) */}
            <div className="w-full sm:w-[480px] md:w-[540px] lg:w-[600px] xl:w-[640px] md:float-left md:mr-8 md:mb-5 mb-6">
              <div className="p-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
                <div className="relative w-full aspect-[16/10] sm:aspect-[3/2] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <Image
                    src="/images/004A3344.webp"
                    alt="Auditorium Gathering with ic-ETITE Conference Banner at VIT Vellore"
                    fill
                    sizes="(max-width: 1024px) 100vw, 640px"
                    className="object-cover object-center hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <p className="text-xs text-slate-600 font-medium mt-2 px-1 text-center">
                  Plenary delegates and academic researchers assembled at Anna Auditorium, VIT
                </p>
              </div>
            </div>

            {/* Text flowing all around the picture */}
            <div className="space-y-3.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-[#DE6D1B] uppercase tracking-wider w-fit">
                <span>Scientific Vision &amp; Scope</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#E05A00] font-serif">
                Theme of the Conference
              </h2>
              <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
                ic-ETITE’28 emphasizes the importance of advancing research and innovation in Information Technology and Engineering. The conference aims to provide a global platform for researchers, academicians, engineers, industry professionals, and students to showcase their innovations, exchange knowledge, and explore emerging developments in science and technology.
              </p>
              <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
                The conference is committed to promoting research, innovation, and technological development in Information Technology and Engineering. It seeks to foster international collaboration, encourage interdisciplinary research, and facilitate global research networks that support future joint initiatives and academic partnerships.
              </p>
            </div>

            <div className="clear-both pt-4">
              <Link
                href="/tracks"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#004B87] text-white text-sm font-semibold hover:bg-[#003366] transition-colors shadow-sm hover:shadow group"
              >
                <span>Explore Research Tracks</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* =========================================================================
              3. ABOUT VIT (Host University)
          ========================================================================= */}
          <div className="flow-root pt-10 md:pt-14">
            {/* Enlarged Floated Image on Desktop (Right) */}
            <div className="w-full sm:w-[480px] md:w-[540px] lg:w-[600px] xl:w-[640px] md:float-right md:ml-8 md:mb-5 mb-6">
              <div className="p-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
                <div className="relative w-full aspect-[16/10] sm:aspect-[3/2] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <Image
                    src="/images/frame_1.webp"
                    alt="Main entrance to VIT Vellore campus"
                    fill
                    sizes="(max-width: 1024px) 100vw, 640px"
                    className="object-cover object-center hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <p className="text-xs text-slate-600 font-medium mt-2 px-1 text-center">
                  Vellore Institute of Technology (VIT), Vellore Main Campus Entrance
                </p>
              </div>
            </div>

            {/* Text flowing all around the picture */}
            <div className="space-y-3.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#002147]/5 border border-[#002147]/15 text-xs font-bold text-[#002147] uppercase tracking-wider w-fit">
                <Award className="w-3.5 h-3.5 text-[#F5A623]" />
                <span>Host University · Established 1984</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#002147] font-serif">
                About VIT
              </h2>
              <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
                Vellore Institute of Technology (VIT) was established in 1984 as Vellore Engineering College and was granted university status by the Government of India in 2001 under Section 3 of the University Grants Commission (UGC) Act, 1956. Founded by Dr. G. Viswanathan, VIT is committed to providing quality higher education and fostering excellence in teaching, research, and innovation.
              </p>
              <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
                The University promotes a vibrant and cosmopolitan academic environment, attracting students and faculty from across India and around the world. VIT places strong emphasis on research, innovation, international collaboration, and industry engagement. Its extensive academic and research collaborations with universities and institutions worldwide facilitate student and faculty exchanges, joint research, and global academic partnerships. With a strong focus on academic excellence and a professional approach to governance, VIT continues to advance its vision of “Transforming life through excellence in education and research.” The University remains committed to preparing students and researchers to address emerging global challenges and contribute meaningfully to society.
              </p>
            </div>

            <div className="clear-both pt-4 flex flex-wrap gap-3">
              <a
                href="https://vit.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2 text-xs py-2.5 px-5"
              >
                <span>Visit Official vit.ac.in</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <Link
                href="/venue"
                className="btn-outline inline-flex items-center gap-2 text-xs py-2.5 px-5"
              >
                <span>Campus Map &amp; Travel Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* =========================================================================
              4. ABOUT SCORE (Organizing School)
          ========================================================================= */}
          <div className="flow-root pt-10 md:pt-14">
            {/* Enlarged Floated Image on Desktop (Left) */}
            <div className="w-full sm:w-[480px] md:w-[540px] lg:w-[600px] xl:w-[640px] md:float-left md:mr-8 md:mb-5 mb-6">
              <div className="p-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
                <div className="relative w-full aspect-[16/10] sm:aspect-[3/2] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <Image
                    src="/images/vit-sjt.webp"
                    alt="Silver Jubilee Tower (SJT) at VIT Vellore"
                    fill
                    sizes="(max-width: 1024px) 100vw, 640px"
                    className="object-cover object-center hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <p className="text-xs text-slate-600 font-medium mt-2 px-1 text-center">
                  Silver Jubilee Tower (SJT), home to computing research &amp; labs at VIT Vellore
                </p>
              </div>
            </div>

            {/* Text flowing all around the picture */}
            <div className="space-y-3.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#004B87]/5 border border-[#004B87]/15 text-xs font-bold text-[#004B87] uppercase tracking-wider w-fit">
                <Cpu className="w-3.5 h-3.5" />
                <span>Organizing School</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#002147] font-serif">
                About SCORE
              </h2>
              <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
                The School of Computer Science Engineering and Information Systems (SCORE) at Vellore Institute of Technology (VIT), Vellore, is a vibrant academic and research community committed to excellence in Computer Science, Information Technology, Artificial Intelligence, Data Engineering, Cyber Security, Software Engineering, and Computer Applications.
              </p>
              <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
                The School offers a diverse range of undergraduate, postgraduate, research, and doctoral programmes, including B.Tech. in Information Technology, B.Tech. in Computer Science and Engineering (Artificial Intelligence and Data Engineering), B.Tech. in Computer Science and Engineering (Cyber Security), BCA, B.Sc. in Computer Science, M.Tech. in Computer Science and Engineering (Cybersecurity), M.Tech. in Software Engineering, MCA, M.Sc. in Artificial Intelligence and Machine Learning, M.Tech. by Research, and Ph.D. programmes, equipping students with strong technical knowledge, practical skills, and the ability to address real-world challenges.
              </p>
              <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
                SCORE fosters a research-driven and innovation-oriented environment through interdisciplinary research, industry collaboration, consultancy, and engagement with leading academic and research organisations. Supported by state-of-the-art infrastructure, industry- supported laboratories, Centres of Excellence, and a strong community of students, faculty members, researchers, visiting professors, and industry professionals, the School promotes excellence in teaching, learning, research, and innovation.
              </p>
            </div>

            <div className="clear-both pt-4">
              <a
                href="https://vit.ac.in/schools/school-of-computer-science-engineering-and-information-systems"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2 text-xs py-2.5 px-5"
              >
                <span>Visit SCORE Official School Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* =========================================================================
              5. ABOUT IEEE INFORMATION THEORY SOCIETY, VIT
          ========================================================================= */}
          <div className="flow-root pt-10 md:pt-14">
            {/* Enlarged Floated Image on Desktop (Right) */}
            <div className="w-full sm:w-[480px] md:w-[540px] lg:w-[600px] xl:w-[640px] md:float-right md:ml-8 md:mb-5 mb-6">
              <div className="p-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
                <div className="relative w-full aspect-[16/10] sm:aspect-[3/2] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <Image
                    src="/images/vit-its.jpg"
                    alt="IEEE Information Theory Society Team at VIT Vellore"
                    fill
                    sizes="(max-width: 1024px) 100vw, 640px"
                    className="object-cover object-center hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <p className="text-xs text-slate-600 font-medium mt-2 px-1 text-center">
                  IEEE Information Theory Society Student Chapter Executive Team
                </p>
              </div>
            </div>

            {/* Text flowing all around the picture */}
            <div className="space-y-3.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00B4D8]/10 border border-[#00B4D8]/30 text-xs font-bold text-[#004B87] uppercase tracking-wider w-fit">
                <Globe2 className="w-3.5 h-3.5 text-[#00B4D8]" />
                <span>Technical Student Body · VIT Vellore Chapter</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#002147] font-serif">
                About ITS
              </h2>
              <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
                The IEEE Information Theory Society at VIT is a student chapter dedicated to exploring the latest advancements in information theory and applying them to address contemporary technological challenges. The chapter provides a nurturing platform for students to foster innovative ideas, develop technical expertise, and engage in meaningful research and projects.
              </p>
              <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] text-slate-700 font-normal text-justify">
                Through technical events, workshops, seminars, and collaborative initiatives, the chapter promotes knowledge sharing and practical learning while connecting students with partners and collaborators from academia and industry. By encouraging curiosity, creativity, and continuous learning, the IEEE Information Theory Society at VIT strives to empower students to develop innovative solutions, address emerging challenges, and contribute meaningfully to the advancement of information and communication technologies.
              </p>
            </div>

            <div className="clear-both pt-4 flex flex-wrap gap-3">
              <a
                href="https://ieee-its-vit.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2 text-xs py-2.5 px-5"
              >
                <span>Visit IEEE ITS Chapter Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <Link
                href="/hackathon"
                className="btn-outline inline-flex items-center gap-2 text-xs py-2.5 px-5"
              >
                <span>Explore BOLT 3.0 Hackathon</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
