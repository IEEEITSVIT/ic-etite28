export interface Icetite24Photo {
  id: string;
  image: string;
  title: string;
  category: "dais" | "hackathon" | "expo" | "networking" | "keynote";
  categoryLabel: string;
  edition: string;
  location: string;
  caption: string;
  badge?: string;
  featuredOnHome?: boolean;
}

export const ICETITE24_PHOTOS: Icetite24Photo[] = [
  {
    id: "dais-inaugural-2024",
    image: "/images/icetite24/icetite24_16_inaugural_ceremony_dais.webp",
    title: "Valedictory Ceremony & Proceedings",
    category: "dais",
    categoryLabel: "Inaugural & Dais",
    edition: "ic-ETITE'24 Second Edition",
    location: "Anna Auditorium Main Stage, VIT Vellore",
    caption:
      "Valedictory ceremony of ic-ETITE'24, marking the conclusion of the conference and celebrating the contributions of distinguished guests, researchers, and participants.",
    badge: "Official Valedictory Ceremony",
    featuredOnHome: true,
  },
  {
    id: "bolt-stage-awards-2024",
    image: "/images/icetite24/icetite24_18_bolt_hackathon_awards_stage.webp",
    title: "BOLT 2.0 Hackathon 3rd Place Award",
    category: "hackathon",
    categoryLabel: "BOLT 2.0 Hackathon",
    edition: "BOLT 2.0 National Hackathon",
    location: "Anna Auditorium Main Stage, VIT Vellore",
    caption:
      "Presentation of Certificate of Achievement to BOLT 2.0 third place winners by Chief Guest Shri S. Krishnan, IAS, and Vice President Dr. Sankar Viswanathan.",
    badge: "BOLT 2.0 Hackathon",
    featuredOnHome: true,
  },
  {
    id: "bolt-winners-felicitation-2024",
    image: "/images/icetite24/icetite24_19_bolt_winners_felicitation.webp",
    title: "BOLT 2.0 Hackathon 2nd Place Award",
    category: "hackathon",
    categoryLabel: "BOLT 2.0 Hackathon",
    edition: "BOLT 2.0 National Hackathon",
    location: "Anna Auditorium Dais, VIT Vellore",
    caption:
      "Presentation of Certificate of Achievement to BOLT 2.0 second place winners on dais by Chief Guest Shri S. Krishnan, IAS, and Vice President Dr. Sankar Viswanathan.",
    badge: "Hackathon Winners",
    featuredOnHome: false,
  },
  {
    id: "drone-prototype-expo-2024",
    image: "/images/icetite24/icetite24_11_drone_prototype_expo.webp",
    title: "SkyWatch Autonomous AI Drone Demonstration",
    category: "expo",
    categoryLabel: "TechNext & Industry Expo",
    edition: "TechNext'24 Project Expo",
    location: "Project Exhibition Pavilion, VIT Vellore",
    caption:
      "Student engineering team demonstrating autonomous surveillance drone prototype with live telemetry to Chief Guest Dr. Zvi Galil and faculty.",
    badge: "Autonomous Robotics",
    featuredOnHome: true,
  },
  {
    id: "startup-innovators-showcase-2024",
    image: "/images/icetite24/icetite24_13_java_capital_innovators.webp",
    title: "Student Startup Pitch to Java Capital",
    category: "expo",
    categoryLabel: "TechNext & Industry Expo",
    edition: "Startup & Innovation Showcase",
    location: "SCORE Innovation Concourse, VIT Vellore",
    caption:
      "Student innovators pitching their software prototype directly to startup mentor and venture partner Java Capital during TechNext'24.",
    badge: "Student Startups",
    featuredOnHome: true,
  },
  {
    id: "technext-committee-leads-2024",
    image: "/images/icetite24/icetite24_14_technext_committee.webp",
    title: "Project Evaluation by International Guest & Faculty",
    category: "expo",
    categoryLabel: "TechNext & Industry Expo",
    edition: "TechNext'24 Expo",
    location: "Exhibition Hall, VIT Vellore",
    caption:
      "TechNext'24 committee faculty and international delegate evaluating student software architecture and implementation.",
    badge: "TechNext Evaluation",
    featuredOnHome: false,
  },
  {
    id: "organizing-team-volunteers-2024",
    image: "/images/icetite24/icetite24_10_organizing_team.webp",
    title: "Traditional Welcome of Chief Guest Dr. Zvi Galil",
    category: "dais",
    categoryLabel: "Inaugural & Dais",
    edition: "Conference Leadership & Welcome",
    location: "Anna Auditorium Concourse, VIT Vellore",
    caption:
      "Ceremonial Indian floral welcome and aarti accorded to Chief Guest Dr. Zvi Galil (former Dean of Computing, Georgia Tech) by student hosts and faculty.",
    badge: "Ceremonial Welcome",
    featuredOnHome: true,
  },
  {
    id: "keynote-podium-speech-2024",
    image: "/images/icetite24/icetite24_15_podium_address.webp",
    title: "Distinguished Panel Discussion on Dais",
    category: "keynote",
    categoryLabel: "Keynotes & Sessions",
    edition: "ic-ETITE'24 Keynote Plenary",
    location: "Anna Auditorium Main Dais, VIT Vellore",
    caption:
      "Eminent panel of academic and industry leaders sharing insights during the executive panel discussion on emerging computational intelligence.",
    badge: "Panel Discussion",
    featuredOnHome: false,
  },
  {
    id: "dignitaries-assembly-chairs-2024",
    image: "/images/icetite24/icetite24_12_dignitaries_keynote.webp",
    title: "Jury Evaluation of Autonomous Rover Prototype",
    category: "expo",
    categoryLabel: "TechNext & Industry Expo",
    edition: "TechNext'24 Project Expo",
    location: "TechNext Exhibition Stalls, VIT Vellore",
    caption:
      "International jury members and delegates evaluating student robotic vehicle and hardware prototype at TechNext'24 project stalls.",
    badge: "Robotics Evaluation",
    featuredOnHome: false,
  },
  {
    id: "green-tech-computing-2024",
    image: "/images/icetite24/icetite24_17_intell_green_innovation.webp",
    title: "INTELL-i-GREEN Sustainable Tech Demo",
    category: "expo",
    categoryLabel: "TechNext & Industry Expo",
    edition: "TechNext'24 Project Expo",
    location: "TechNext Arena, VIT Vellore",
    caption:
      "Student innovators demonstrating their INTELL-i-GREEN sustainable energy management system to IEEE mentor and delegates.",
    badge: "Green Computing",
    featuredOnHome: false,
  },
  {
    id: "plenary-audience-authors-2024",
    image: "/images/icetite24/icetite24_06_plenary_audience_hall.webp",
    title: "Delegates Cheering at Cultural Evening",
    category: "networking",
    categoryLabel: "Networking & Cultural",
    edition: "ic-ETITE'24 Cultural Evening",
    location: "Campus Amphitheatre, VIT Vellore",
    caption:
      "International delegates and students cheering and capturing memorable moments during live cultural evening performances.",
    badge: "Cultural Celebration",
    featuredOnHome: true,
  },
  {
    id: "networking-gala-night-2024",
    image: "/images/icetite24/icetite24_01_networking_gala.webp",
    title: "Code with Cisco Pavilion & Student Interaction",
    category: "expo",
    categoryLabel: "TechNext & Industry Expo",
    edition: "Industry Expo",
    location: "Campus Concourse, VIT Vellore",
    caption:
      "Students engaging with industry engineers and exploring cloud platforms at Title Sponsor Cisco's innovation booth.",
    badge: "Cisco Pavilion",
    featuredOnHome: true,
  },
  {
    id: "evening-fellowship-mixer-2024",
    image: "/images/icetite24/icetite24_02_campus_evening.webp",
    title: "Cultural Evening & Valedictory Audience",
    category: "networking",
    categoryLabel: "Networking & Cultural",
    edition: "Delegates Reception",
    location: "Campus Open-Air Amphitheatre, VIT Vellore",
    caption:
      "International delegates, senior university leadership, faculty, and hundreds of students attending the conference cultural evening.",
    badge: "Delegates Assembly",
    featuredOnHome: false,
  },
  {
    id: "student-researchers-conclave-2024",
    image: "/images/icetite24/icetite24_03_student_delegates.webp",
    title: "Student Delegates at Open-Air Celebration",
    category: "networking",
    categoryLabel: "Networking & Cultural",
    edition: "Conference Fellowship",
    location: "Campus Grounds, VIT Vellore",
    caption:
      "Delegates and student participants enjoying cultural presentations and fellowship under campus night lights.",
    badge: "Student Gathering",
    featuredOnHome: false,
  },
  {
    id: "delegates-celebration-night-2024",
    image: "/images/icetite24/icetite24_07_delegates_celebration.webp",
    title: "Student Dance Troupe Choreography",
    category: "networking",
    categoryLabel: "Networking & Cultural",
    edition: "Cultural Reception",
    location: "Open Stage, VIT Vellore",
    caption:
      "Choreographed group dance performance by student cultural troupe honoring visiting delegates from 19 countries.",
    badge: "Group Dance",
    featuredOnHome: false,
  },
  {
    id: "campus-fellowship-dialogue-2024",
    image: "/images/icetite24/icetite24_08_campus_gathering.webp",
    title: "Contemporary Dance Performance",
    category: "networking",
    categoryLabel: "Networking & Cultural",
    edition: "Cultural Evening",
    location: "Outdoor Stage, VIT Vellore",
    caption:
      "Dynamic contemporary group dance routine presented by student artists during the evening gala entertainment.",
    badge: "Contemporary Dance",
    featuredOnHome: false,
  },
  {
    id: "cultural-evening-hospitality-2024",
    image: "/images/icetite24/icetite24_09_cultural_evening.webp",
    title: "Traditional Dance Performance",
    category: "networking",
    categoryLabel: "Networking & Cultural",
    edition: "Cultural Evening",
    location: "Auditorium Concourse Stage, VIT Vellore",
    caption:
      "Traditional Indian classical dance performance welcoming international conference delegates to VIT Vellore.",
    badge: "Classical Arts",
    featuredOnHome: false,
  },
];

