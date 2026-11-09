export interface ConferenceInfo {
  name: string;
  shortName: string;
  edition: string;
  editionNumber: number;
  year: number;
  dates: string;
  datesRaw: {
    start: string;
    end: string;
  };
  venue: {
    name: string;
    department: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    fullAddress: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    mapsUrl: string;
  };
  organizer: {
    name: string;
    shortName: string;
    establishedYear: number;
    chancellor: string;
    website: string;
  };
  technicalCoSponsor: {
    name: string;
    role: string;
    badgeText: string;
    website: string;
  };
  supportedBy: Array<{
    name: string;
    role: string;
    badgeText: string;
    website?: string;
  }>;
  theme: {
    title: string;
    tagline: string;
    description: string;
    pillars: Array<{
      title: string;
      desc: string;
    }>;
  };
  aboutConference: {
    summary: string;
    paragraphs: string[];
    audiences: string[];
    focusAreas: string[];
  };
  contact: {
    email: string;
    alternateEmail?: string;
    organizer?: string;
    institution?: string;
    chairName?: string;
    publicationChair?: string;
    financeChair?: string;
    phoneNumbers?: Array<{
      role: string;
      name: string;
      designation: string;
      email: string;
      phone: string;
    }>;
    address: string;
    socials: {
      instagram?: string;
      linkedin?: string;
      facebook?: string;
    };
  };
  submission: {
    platform: string;
    url: string;
    emailSubmissionAccepted: boolean;
    plagiarismCheck: boolean;
    scopusNote: string;
    rules: string[];
  };
  rankings: Array<{
    agency: string;
    year: string;
    highlight: string;
    details: string;
  }>;
  scoreInfo: {
    name: string;
    formerName?: string;
    studentsCount: string;
    facultyCount: string;
    description: string;
    domains: string[];
  };
  ieeeItsInfo: {
    name: string;
    description: string;
    mission: string;
    pillars: string[];
  };
  previousEditions: {
    edition24: {
      year: number;
      dates: string;
      description: string;
      stats: Array<{ label: string; value: string; count: number; suffix?: string }>;
      highlights: string[];
      proceedingsUrl: string;
    };
    edition20: {
      year: number;
      dates: string;
      description: string;
      proceedingsUrl: string;
      ieeeXploreIsbn: string;
      usbIsbn: string;
      highlights: string[];
    };
  };
  previousCollaborations: Array<{
    name: string;
    category: string;
    note: string;
  }>;
}

export const conferenceData: ConferenceInfo = {
  name: "Third International Conference on Emerging Trends in Information Technology and Engineering",
  shortName: "ic-ETITE’28",
  edition: "Third International Conference on Emerging Trends in Information Technology and Engineering",
  editionNumber: 3,
  year: 2028,
  dates: "10–11 February 2028",
  datesRaw: {
    start: "2028-02-10",
    end: "2028-02-11",
  },
  venue: {
    name: "Vellore Institute of Technology",
    department: "School of Computer Science Engineering and Information Systems (SCORE)",
    city: "Vellore",
    state: "Tamil Nadu",
    country: "India",
    pincode: "632014",
    fullAddress: "School of Computer Science Engineering and Information Systems (SCORE), Vellore Institute of Technology, Vellore, Tamil Nadu, India - 632014",
    coordinates: {
      lat: 12.9698,
      lng: 79.1559,
    },
    mapsUrl: "https://maps.google.com/?q=Vellore+Institute+of+Technology+Vellore",
  },
  organizer: {
    name: "Vellore Institute of Technology",
    shortName: "VIT Vellore",
    establishedYear: 1984,
    chancellor: "Dr. G. Viswanathan",
    website: "https://vit.ac.in",
  },
  technicalCoSponsor: {
    name: "IEEE",
    role: "Technical Sponsor",
    badgeText: "Technically Sponsored By",
    website: "https://www.ieee.org",
  },
  supportedBy: [
    {
      name: "IEEE Information Theory Society, VIT Student Chapter",
      role: "Supported By",
      badgeText: "Organizing Society Chapter",
      website: "https://ieee-its-vit.vercel.app/",
    },
  ],
  theme: {
    title: "Theme of the Conference",
    tagline: "Advancing research, innovation, and technological development in Information Technology and Engineering.",
    description:
      "ic-ETITE’28 emphasizes the importance of advancing research and innovation in Information Technology and Engineering. The conference aims to provide a global platform for researchers, academicians, engineers, industry professionals, and students to showcase their innovations, exchange knowledge, and explore emerging developments in science and technology. The conference is committed to promoting research, innovation, and technological development in Information Technology and Engineering. It seeks to foster international collaboration, encourage interdisciplinary research, and facilitate global research networks that support future joint initiatives and academic partnerships.",
    pillars: [
      {
        title: "Advancing Research & Innovation",
        desc: "Promoting research, innovation, and technological development in Information Technology and Engineering.",
      },
      {
        title: "Global Scholarly Platform",
        desc: "Providing a global podium to showcase innovations, exchange knowledge, and explore emerging scientific developments.",
      },
      {
        title: "International Collaboration",
        desc: "Fostering international collaboration and encouraging interdisciplinary research across global engineering domains.",
      },
      {
        title: "Future Academic Partnerships",
        desc: "Facilitating global research networks that support future joint initiatives and academic partnerships.",
      },
    ],
  },
  aboutConference: {
    summary:
      "The Third International Conference on Emerging Trends in Information Technology and Engineering (ic-ETITE’28) will be held at the Vellore Institute of Technology (VIT), Vellore, India, on 10–11 February 2028.",
    paragraphs: [
      "The Third International Conference on Emerging Trends in Information Technology and Engineering (ic-ETITE’28) will be held at the Vellore Institute of Technology (VIT), Vellore, India, on 10–11 February 2028.",
      "The conference aims to provide an international platform for researchers, academicians, engineers, industry professionals, and students to present and exchange innovative research in Information Technology, Computer Engineering, Communication Engineering, Electronics Engineering, and related emerging areas. ic-ETITE’28 seeks to foster knowledge sharing, interdisciplinary collaboration, industry–academia interaction, and future research partnerships among participants from around the world.",
      "Original and unpublished research papers addressing emerging challenges, innovative technologies, and recent developments are invited from researchers worldwide. The conference is committed to promoting research excellence and facilitating the dissemination of knowledge that contributes to the advancement of science, technology, and education.",
    ],
    audiences: [
      "Researchers & Principal Investigators",
      "Academicians & Faculty Members",
      "Engineers & Industry Professionals",
      "Research Scholars & Postgraduate Students",
      "Undergraduate Innovators",
    ],
    focusAreas: [
      "Information Technology",
      "Computer Engineering",
      "Communication Engineering",
      "Electronics Engineering",
      "Interdisciplinary Collaborations & Partnerships",
    ],
  },
  contact: {
    email: "icetiteconference@vit.ac.in",
    organizer: "School of Computer Science Engineering and Information Systems (SCORE)",
    institution: "Vellore Institute of Technology (VIT), Vellore",
    address: "School of Computer Science Engineering and Information Systems (SCORE), Vellore Institute of Technology, Vellore, Tamil Nadu, India - 632014",
    phoneNumbers: [
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
    ],
    socials: {
      instagram: "https://www.instagram.com/icetite20/",
      facebook: "https://www.facebook.com/icetite.icetite.3/",
    },
  },
  submission: {
    platform: "Microsoft (CMT)",
    url: "https://cmt3.research.microsoft.com/About",
    emailSubmissionAccepted: false,
    plagiarismCheck: true,
    scopusNote: "Extended version of selected papers will be recommended for publication in Scopus indexed journals with impact factor.",
    rules: [
      "The papers should be submitted through Microsoft (CMT) (https://cmt3.research.microsoft.com/About).",
      "All submitted papers will go through a plagiarism check process.",
      "The manuscript should not contain embedded links, scanned images, header and footer.",
      "Email submission will not be accepted.",
      "All queries related to the conference shall be addressed to icetiteconference@vit.ac.in.",
      "Extended version of selected papers will be recommended for publication in Scopus indexed journals with impact factor.",
      "Manuscripts must adhere strictly to IEEE standard two-column conference formatting.",
      "In accordance with IEEE guidelines, at least one author of each accepted paper must register at the applicable author rate and present the work at the conference.",
    ],
  },
  rankings: [
    {
      agency: "QS World University Rankings by Subject 2026",
      year: "2026",
      highlight: "86 Globally (Computer Science & Information Systems)",
      details: "Ranked 119th globally in Engineering & Technology, 86th in Computer Science & Information Systems, and 87th in Electrical & Electronic Engineering, with several other disciplines placed among the top 200 globally.",
    },
    {
      agency: "QS Sustainability Rankings 2026",
      year: "2026",
      highlight: "352nd Globally · 7th in India",
      details: "Ranked 352nd globally and 7th among institutions in India, reflecting its performance in sustainability-related areas.",
    },
    {
      agency: "Shanghai Ranking (ARWU) 2025",
      year: "2025",
      highlight: "501–600 Global Rank Band · Top 1–2 in India",
      details: "Placed in the 501–600 global rank band and in the 1–2 rank band among Indian institutions.",
    },
    {
      agency: "NAAC Accreditation",
      year: "Current",
      highlight: "A++ Grade · CGPA 3.66",
      details: "VIT Vellore is accredited with an A++ grade, with a CGPA of 3.66 on a four-point scale.",
    },
    {
      agency: "NIRF 2025 (Govt. of India)",
      year: "2025",
      highlight: "14th University · 14th Research · 16th Engineering",
      details: "VIT is ranked 14th in the University category, 14th in Research, and 16th in Engineering in the National Institutional Ranking Framework (NIRF), Government of India.",
    },
  ],
  scoreInfo: {
    name: "School of Computer Science Engineering and Information Systems (SCORE)",
    studentsCount: "5,900+",
    facultyCount: "188+",
    description:
      "The School of Computer Science Engineering and Information Systems (SCORE) at Vellore Institute of Technology (VIT), Vellore, is a vibrant academic and research community committed to excellence in Computer Science, Information Technology, Artificial Intelligence, Data Engineering, Cyber Security, Software Engineering, and Computer Applications. The School offers a diverse range of undergraduate, postgraduate, research, and doctoral programmes, including B.Tech. in Information Technology, B.Tech. in Computer Science and Engineering (Artificial Intelligence and Data Engineering), B.Tech. in Computer Science and Engineering (Cyber Security), BCA, B.Sc. in Computer Science, M.Tech. in Computer Science and Engineering (Cybersecurity), M.Tech. in Software Engineering, MCA, M.Sc. in Artificial Intelligence and Machine Learning, M.Tech. by Research, and Ph.D. programmes, equipping students with strong technical knowledge, practical skills, and the ability to address real-world challenges. SCORE fosters a research-driven and innovation-oriented environment through interdisciplinary research, industry collaboration, consultancy, and engagement with leading academic and research organisations. Supported by state-of-the-art infrastructure, industry-supported laboratories, Centres of Excellence, and a strong community of students, faculty members, researchers, visiting professors, and industry professionals, the School promotes excellence in teaching, learning, research, and innovation. Through seminars, workshops, international expert talks, symposia, conferences, and industry interactions, SCORE provides opportunities to engage with emerging technologies and global research developments, while advancing its vision of transformative education, impactful research, innovation, and lifelong learning.",
    domains: [
      "B.Tech. in Information Technology",
      "B.Tech. in CSE (Artificial Intelligence and Data Engineering)",
      "B.Tech. in CSE (Cyber Security)",
      "BCA & B.Sc. in Computer Science",
      "M.Tech. in CSE (Cybersecurity)",
      "M.Tech. in Software Engineering",
      "MCA & M.Sc. in Artificial Intelligence and Machine Learning",
      "M.Tech. by Research & Ph.D. Programmes",
    ],
  },
  ieeeItsInfo: {
    name: "IEEE Information Theory Society, VIT",
    description:
      "The IEEE Information Theory Society at VIT is a student chapter dedicated to exploring the latest advancements in information theory and applying them to address contemporary technological challenges. The chapter provides a nurturing platform for students to foster innovative ideas, develop technical expertise, and engage in meaningful research and projects. Through technical events, workshops, seminars, and collaborative initiatives, the chapter promotes knowledge sharing and practical learning while connecting students with partners and collaborators from academia and industry. By encouraging curiosity, creativity, and continuous learning, the IEEE Information Theory Society at VIT strives to empower students to develop innovative solutions, address emerging challenges, and contribute meaningfully to the advancement of information and communication technologies.",
    mission:
      "By encouraging curiosity, creativity, and continuous learning, the IEEE Information Theory Society at VIT strives to empower students to develop innovative solutions, address emerging challenges, and contribute meaningfully to the advancement of information and communication technologies.",
    pillars: [
      "Information Theory & Advanced Computational Paradigms",
      "Collaborative Technical Events, Seminars & Workshops",
      "Interdisciplinary Student R&D & Industry Partnerships",
      "Organizing the Flagship BOLT International Hackathon",
      "Scholarly Peer Dissemination & Research Publication Support",
    ],
  },
  previousEditions: {
    edition24: {
      year: 2024,
      dates: "22–23 February 2024",
      description:
        "Organized by SCORE, VIT Vellore: 22–23 February 2024. Technically co-sponsored by IEEE.",
      stats: [
        { label: "Papers Received", value: "1,688", count: 1688 },
        { label: "Countries Represented", value: "19", count: 19 },
        { label: "Technical Sessions", value: "32", count: 32 },
        { label: "Keynote Sessions", value: "22", count: 22 },
        { label: "Conference Participants", value: "1,088", count: 1088 },
        { label: "BOLT 2.0 Hackathon Registrations", value: "683", count: 683 },
      ],
      highlights: [
        "Organized by SCORE, VIT Vellore: 22–23 February 2024.",
        "Technically co-sponsored by IEEE.",
        "1,688 papers received from 19 countries.",
        "32 technical sessions conducted.",
        "22 keynote sessions delivered by eminent international academicians, Vice-Chancellors, IIT professors, and industry experts from Microsoft, Amazon, and other organizations.",
        "Expert panel discussions were conducted with distinguished speakers from academia, IEEE, and industry.",
        "1,088 participants attended the conference.",
        "BOLT 2.0 International Hackathon: 683 registrations.",
        "Technext’24: Industrial expo and project competition conducted.",
        "Chief Guests: Dr. Zvi Galil, Georgia Institute of Technology, USA, and Shri S. Krishnan, IAS, Secretary, MeitY, Government of India.",
        "Industry collaborations and sponsorships established with Intel, Cisco, Yellow.ai, Java Capital, and Seed VC Innovation.",
        "IEEE Xplore Proceedings: https://ieeexplore.ieee.org/xpl/conhome/10493200/proceeding",
      ],
      proceedingsUrl: "https://ieeexplore.ieee.org/xpl/conhome/10493200/proceeding",
    },
    edition20: {
      year: 2020,
      dates: "24–25 February 2020",
      description:
        "The first IEEE International Conference on “Emerging Trends in Information Technology and Engineering” was organized on 24th & 25th February 2020.",
      proceedingsUrl: "https://ieeexplore.ieee.org/xpl/conhome/9070069/proceeding",
      ieeeXploreIsbn: "978-1-7281-4142-8",
      usbIsbn: "978-1-7281-4141-1",
      highlights: [
        "The first IEEE International Conference on “Emerging Trends in Information Technology and Engineering” was organized on 24th & 25th February 2020.",
        "ic-ETITE’20 was technically co-sponsored by IEEE.",
        "All the presented papers were published in the IEEE Xplore by the IEEE.",
        "Electronic ISBN: 978-1-7281-4142-8 | USB ISBN: 978-1-7281-4141-1",
        "ic-ETITE’20 had 21 technical and 17 keynote sessions.",
        "A hackathon titled, “Breakthrough on Locked Technology” BOLT was conducted with 500+ participants and gave Rs. 1,00,000 as prize money.",
      ],
    },
  },
  previousCollaborations: [
    { name: "Intel", category: "Technology Partner (ic-ETITE'24)", note: "Previous Edition Technical Collaboration" },
    { name: "Cisco", category: "Title Sponsor (ic-ETITE'24)", note: "Previous Edition Technical Collaboration" },
    { name: "Yellow.ai", category: "Industry Partner (ic-ETITE'24)", note: "Previous Edition AI Collaboration" },
    { name: "Java Capital", category: "Venture Partner (ic-ETITE'24)", note: "Previous Edition Innovation Partner" },
    { name: "Seed VC Innovation", category: "Ecosystem Partner (ic-ETITE'24)", note: "Previous Edition Incubation Partner" },
  ],
};
