export interface CommitteeMember {
  name: string;
  role: string;
  affiliation?: string;
  department?: string;
  image?: string;
  portfolioUrl?: string;
}

export interface CommitteeGroup {
  id: string;
  title: string;
  description?: string;
  members: CommitteeMember[];
}

export const chiefPatron: CommitteeMember = {
  name: "Dr. G. Viswanathan",
  role: "Chief Patron",
  affiliation: "Chancellor, VIT",
  image: "/images/patron-g-viswanathan.webp",
  portfolioUrl: "https://vit.ac.in/dr-g-viswanathan",
};

export const patrons: CommitteeMember[] = [
  {
    name: "Dr. Sankar Viswanathan",
    role: "Patron",
    affiliation: "Vice President, VIT",
    image: "/images/patron-sankar-viswanathan.webp",
    portfolioUrl: "https://vit.ac.in/dr-sankar-viswanathan",
  },
  {
    name: "Dr. Sekar Viswanathan",
    role: "Patron",
    affiliation: "Vice President, VIT",
    image: "/images/patron-sekar-viswanathan.webp",
    portfolioUrl: "https://vit.ac.in/dr-sekar-viswanathan",
  },
  {
    name: "Dr. G.V. Selvam",
    role: "Patron",
    affiliation: "Vice President, VIT",
    image: "/images/patron-gv-selvam.webp",
    portfolioUrl: "https://vit.ac.in/dr-gv-selvam",
  },
  {
    name: "Dr. Sandhya Pentareddy",
    role: "Patron",
    affiliation: "Executive Director, VIT",
    image: "/images/patron-sandhya-pentareddy.webp",
    portfolioUrl: "https://vit.ac.in/dr-sandhya-pentareddy",
  },
  {
    name: "Ms. Kadhambari S Viswanathan",
    role: "Patron",
    affiliation: "Assistant Vice - President, VIT",
    image: "/images/patron-kadhambari-viswanathan.webp",
    portfolioUrl: "https://vit.ac.in/ms-kadhambari-s-viswanathan",
  },
  {
    name: "Dr. V. S. Kanchana Bhaaskaran",
    role: "Patron",
    affiliation: "Vice-Chancellor, VIT",
    image: "/images/patron-kanchana-bhaaskaran.webp",
    portfolioUrl: "https://vit.ac.in/dr-v-s-kanchana-bhaaskaran",
  },
  {
    name: "Dr. Partha Sharathi Mallick",
    role: "Patron",
    affiliation: "Pro-Vice Chancellor, VIT, Vellore",
    image: "/images/patron-partha-mallick.webp",
    portfolioUrl: "https://vit.ac.in/dr-partha-sarathi-mallick",
  },
  {
    name: "Dr. Jayabarathi T",
    role: "Patron",
    affiliation: "Registrar, VIT",
    image: "/images/patron-jayabarathi.webp",
    portfolioUrl: "https://vit.ac.in/dr-jayabarathi",
  },
];

export const organizingLeadership: {
  chiefPatron: CommitteeMember;
  patrons: CommitteeMember[];
} = {
  chiefPatron,
  patrons,
};

export const organizingChairs = {
  organizingChair: {
    name: "Dr. Daphne Lopez",
    role: "Organizing Chair",
    affiliation: "Professor & Dean(i/c), SCORE, VIT, Vellore",
    image: "/images/faculty/dean-daphne-lopez.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-daphne-lopez",
  },
  organizingCoChair: {
    name: "Dr. Jeyanthi. N",
    role: "Organizing Co-chair",
    affiliation: "Professor & Associate Dean, SCORE, VIT, Vellore",
    image: "/images/faculty/dr-jeyanthi-n.webp",
    portfolioUrl: "https://vit.ac.in/system-and-software/dr-jeyanthi-n",
  },
  conferenceChair: {
    name: "Dr. John Singh. K",
    role: "Conference Chair",
    affiliation: "Professor, SCORE, VIT, Vellore",
    image: "/images/faculty/dr-john-singh-k.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-john-singh-k",
  },
  publicationChair: {
    name: "Dr. Vijayan. R",
    role: "Publication Chair",
    affiliation: "Professor, SITE, VIT, Vellore",
    image: "/images/faculty/dr-vijayan-r.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-vijayan-r",
  },
  publicationCoChairs: [
    {
      name: "Dr. Brindha. K",
      role: "Publication Co-chair",
      affiliation: "Professor, SCORE, VIT, Vellore",
      image: "/images/faculty/dr-brindha-k.webp",
      portfolioUrl: "https://vit.ac.in/smart-computing/dr-brindha-k",
    },
    {
      name: "Dr. Deepa. M",
      role: "Publication Co-chair",
      affiliation: "Professor, SCORE, VIT, Vellore",
      image: "/images/faculty/prof-deepa-p.webp",
      portfolioUrl: "https://vit.ac.in/schools/school-of-computer-science-engineering-and-information-systems",
    },
  ],
  financeChair: {
    name: "Dr. Priya. M",
    role: "Finance Chair",
    affiliation: "Associate Professor, SCORE, VIT, Vellore",
    image: "/images/faculty/dr-priya-m.webp",
    portfolioUrl: "https://vit.ac.in/computer-application/dr-priya-m",
  },
  financeCoChair: {
    name: "Dr. Rajkumar. M",
    role: "Finance Co-chair",
    affiliation: "Associate Professor, SCORE, VIT, Vellore",
    image: "/images/faculty/dr-rajkumar-m.webp",
    portfolioUrl: "https://vit.ac.in/smart-computing/dr-rajkumar-m",
  },
};

export const technicalProgrammeChairs: CommitteeMember[] = [
  {
    name: "Dr. Priya. V",
    role: "Technical Programme Chair",
    affiliation: "Professor, SCORE, VIT, Vellore",
    image: "/images/faculty/dr-priya-v.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-priya-v",
  },
  {
    name: "Dr. Krithika. L. B",
    role: "Technical Programme Chair",
    affiliation: "Associate Professor, SCORE, VIT, Vellore",
    image: "/images/faculty/dr-krithika-l-b.webp",
    portfolioUrl: "https://vit.ac.in/system-and-software/dr-krithika-l-b",
  },
  {
    name: "Dr. Senthil Kumar T",
    role: "Technical Programme Chair",
    affiliation: "Associate Professor, SCORE, VIT, Vellore",
    image: "/images/faculty/dr-senthil-kumar-t.webp",
    portfolioUrl: "https://vit.ac.in/computer-application/dr-senthil-kumar-t",
  },
  {
    name: "Dr. Tamil Priya. D",
    role: "Technical Programme Chair",
    affiliation: "Assistant Professor, SCORE, VIT, Vellore",
    image: "/images/faculty/dr-tamil-priya-d.webp",
    portfolioUrl: "https://vit.ac.in/system-and-software/ms-tamil-priya-d",
  },
];

export const executiveAdvisoryCommittee: CommitteeMember[] = [
  {
    name: "Dr. Arivuselvan K",
    role: "HOD / IT",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-arivuselvan-k.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-arivuselvan-k-2",
  },
  {
    name: "Dr. Thanapal. P",
    role: "HOD / SSE",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-thanapal-p.webp",
    portfolioUrl: "https://vit.ac.in/smart-computing/dr-thanapal-p",
  },
  {
    name: "Dr. Selvarani. B",
    role: "HOD / CSIS",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-selva-rani-b.webp",
    portfolioUrl: "https://vit.ac.in/school/allfaculty/score/cyber-security-and-intelligent-systems",
  },
  {
    name: "Dr. Senthilkumar. N",
    role: "HOD / CA",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-senthil-kumar-n.webp",
    portfolioUrl: "https://vit.ac.in/computer-application/dr-senthil-kumar-n",
  },
  {
    name: "Dr. Sumathy. S",
    role: "Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-sumathy-s.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-sumathy-s",
  },
  {
    name: "Dr. Dinesh Babu. L. D",
    role: "Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-dhinesh-babu-l-d.webp",
    portfolioUrl: "https://vit.ac.in/system-and-software/dr-dhinesh-babu-l-d",
  },
  {
    name: "Dr. Valarmathi. B",
    role: "Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-valarmathi-b.webp",
    portfolioUrl: "https://vit.ac.in/system-and-software/dr-valarmathi-b",
  },
  {
    name: "Dr. Nadesh. R. K",
    role: "Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-nadesh-r-k.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-nadesh-r-k",
  },
  {
    name: "Dr. Sujatha. R",
    role: "Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-sujatha-r.webp",
    portfolioUrl: "https://vit.ac.in/system-and-software/dr-sujatha-r",
  },
  {
    name: "Dr. Vanitha. M",
    role: "Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-vanitha-m.webp",
    portfolioUrl: "https://vit.ac.in/system-and-software/dr-vanitha-m",
  },
  {
    name: "Dr. Prasanna. S",
    role: "Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-prasanna-s.webp",
    portfolioUrl: "https://vit.ac.in/system-and-software/dr-prasanna-s",
  },
  {
    name: "Dr. Chiranji Lal Chowdhary",
    role: "Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-chiranji-lal-chowdhary.webp",
    portfolioUrl: "https://vit.ac.in/system-and-software/dr-chiranji-lal-chowdhary",
  },
  {
    name: "Dr. Ramya. G",
    role: "Associate Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-ramya-g.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-ramya-g",
  },
];

export const publicationCommittee: CommitteeMember[] = [
  {
    name: "Dr. Angulakshmi. M",
    role: "Associate Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-angulakshmi-m.webp",
    portfolioUrl: "https://vit.ac.in/smart-computing/dr-angulakshmi-m",
  },
  {
    name: "Dr. Parvathi. R",
    role: "Associate Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-parvathi-r.webp",
    portfolioUrl: "https://vit.ac.in/smart-computing/dr-parvathi-r",
  },
  {
    name: "Dr. Padmakumari. P",
    role: "Associate Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-padmakumari-p.webp",
    portfolioUrl: "https://vit.ac.in/computer-application/dr-padmakumari-p",
  },
  {
    name: "Dr. Gayathri. A",
    role: "Associate Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-gayathri-a.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-gayathri-a",
  },
  {
    name: "Dr. Benjula Anbu Malar. M. B",
    role: "Assistant Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/mrs-benjula-anbu-malar-m-b.webp",
    portfolioUrl: "https://vit.ac.in/schools/school-of-computer-science-engineering-and-information-systems",
  },
  {
    name: "Dr. Jagannathan. J",
    role: "Assistant Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-jagannathan-j.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-jagannathan-j",
  },
  {
    name: "Dr. Bhuvaneswari. M. S",
    role: "Assistant Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-bhuvaneswari-m-s.webp",
    portfolioUrl: "https://vit.ac.in/schools/school-of-computer-science-engineering-and-information-systems",
  },
  {
    name: "Dr. Karthikeyan. D",
    role: "Assistant Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-karthikeyan-d.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-karthikeyan-d",
  },
  
  {
    name: "Dr. Yogaraja. C. A",
    role: "Assistant Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-yoga-raja-c-a.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-yoga-raja-c-a",
  },
  {
    name: "Dr. Ayeswarya. S",
    role: "Assistant Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-ayeswarya-s.webp",
    portfolioUrl: "https://vit.ac.in/schools/school-of-computer-science-engineering-and-information-systems",
  },
];

export const sponsorshipCommittee: CommitteeMember[] = [
  {
    name: "Dr. Vivekananda. G. N",
    role: "Associate Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-vivekananda-g-n.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-vivekananda-g-n",
  },
  {
    name: "Dr. Praveen Kumar Reddy",
    role: "Associate Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-praveen-kumar-reddy.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-praveen-kumar-reddy-m",
  },
  {
    name: "Dr. Mohanraj. G",
    role: "Assistant Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-mohanraj-g.webp",
    portfolioUrl: "https://vit.ac.in/smart-computing/dr-mohanraj-g",
  },
];

export const publicityAndMediaCommittee: CommitteeMember[] = [
  {
    name: "Dr. Sumangali. K",
    role: "Associate Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-sumangali-k.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-sumangali-k",
  },
  {
    name: "Dr. Asha. N",
    role: "Associate Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-asha-n.webp",
    portfolioUrl: "https://vit.ac.in/computer-application/dr-asha-n",
  },
];

export const registrationCommittee: CommitteeMember[] = [
  {
    name: "Dr. Santhi. K",
    role: "Associate Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-santhi-k.webp",
    portfolioUrl: "https://vit.ac.in/system-and-software/dr-santhi-k",
  },
  {
    name: "Dr. Seetha. R",
    role: "Associate Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-seetha-r.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-seetha-r",
  },
  {
    name: "Dr. Bhuvana. S",
    role: "Associate Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-bhuvana-s.webp",
    portfolioUrl: "https://vit.ac.in/smart-computing/dr-bhuvana-s",
  },
  {
    name: "Dr. Sivashankari. R",
    role: "Assistant Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-sivashankari-r.webp",
    portfolioUrl: "https://vit.ac.in/smart-computing/dr-sivashankari-r",
  },
  {
    name: "Dr. Jenila Vincent. M",
    role: "Assistant Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/ms-jenila-vincent-m.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/ms-jenila-vincent-m",
  },
];

export const boltHackathonCommittee: CommitteeMember[] = [
  {
    name: "Dr. J. Karthikeyan",
    role: "Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-karthikeyan-j.webp",
    portfolioUrl: "https://vit.ac.in/system-and-software/dr-karthikeyan-j",
  },
  {
    name: "Dr. Brijendra Singh",
    role: "Associate Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-brijendra-singh.webp",
    portfolioUrl: "https://vit.ac.in/schools/school-of-information-technology-and-engineering",
  },
  {
    name: "Dr. Krishnamoorthy. N",
    role: "Associate Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-krishnamoorthy-n.webp",
    portfolioUrl: "https://vit.ac.in/system-and-software/dr-krishnamoorthy-n",
  },
];

export const technextExpoCommittee: CommitteeMember[] = [
  {
    name: "Dr. Raghavan. R",
    role: "Associate Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-raghavan-r.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-raghavan-r",
  },
  {
    name: "Dr. Balaji E",
    role: "Assistant Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-balaji-e.webp",
    portfolioUrl: "https://vit.ac.in/smart-computing/dr-balaji-e",
  },
  {
    name: "Dr. Balasubramani. M",
    role: "Assistant Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-balasubramani-m.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-balasubramani-m",
  },
  {
    name: "Dr. Arun Kumar. A",
    role: "Assistant Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-arun-kumar-a.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-arun-kumar-a",
  },
];

export const eventManagementCommittee: CommitteeMember[] = [
  {
    name: "Dr. Srinivas Koppu",
    role: "Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-srinivas-koppu.webp",
    portfolioUrl: "https://vit.ac.in/smart-computing/dr-srinivas-koppu",
  },
  {
    name: "Dr. Vanmathi. C",
    role: "Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-vanmathi-c.webp",
    portfolioUrl: "https://vit.ac.in/system-and-software/dr-vanmathi-c",
  },
  {
    name: "Dr. Mangayarkarasi. R",
    role: "Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-mangayarkarasi-r.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-mangayarkarasi-r",
  },
  {
    name: "Dr. Sudha. M",
    role: "Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-sudha-m.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-sudha-m",
  },
  {
    name: "Dr. Gundala Swathi",
    role: "Associate Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-gundala-swathi.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-gundala-swathi",
  },
  {
    name: "Dr. Chemmalar Selvi. G",
    role: "Associate Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-chemmalar-selvi-g.webp",
    portfolioUrl: "https://vit.ac.in/system-and-software/dr-chemmalar-selvi-g",
  },
];

export const guestCareCommittee: CommitteeMember[] = [
  {
    name: "Dr. Dharmendra Singh Rajput",
    role: "Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-dharmendra-singh-rajput.webp",
    portfolioUrl: "https://vit.ac.in/smart-computing/dr-dharmendra-singh-rajput",
  },
  {
    name: "Dr. Srinivasan. P",
    role: "Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-srinivasan-p.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-srinivasan-p",
  },
  {
    name: "Dr. Magesh. G",
    role: "Assistant Professor",
    affiliation: "SITE, VIT, Vellore",
    image: "/images/faculty/dr-magesh-g.webp",
    portfolioUrl: "https://vit.ac.in/system-and-software/dr-magesh-g",
  },
];

export const conferenceCoordinatingCommittee: CommitteeMember[] = [
  {
    name: "Dr. Hemalatha. S",
    role: "Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-hemalatha-s.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-hemalatha-s",
  },
  {
    name: "Dr. Anitha. A",
    role: "Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-anitha-a.webp",
    portfolioUrl: "https://vit.ac.in/smart-computing/dr-anitha-a",
  },
  {
    name: "Dr. Pounambal. M",
    role: "Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-pounambal-m.webp",
    portfolioUrl: "https://vit.ac.in/system-and-software/dr-pounambal-m",
  },
  {
    name: "Dr. Usha Devi. G",
    role: "Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-usha-devi-g.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-usha-devi-g",
  },
  {
    name: "Dr. Jagadeesh. G",
    role: "Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-jagadeesh-g.webp",
    portfolioUrl: "https://vit.ac.in/smart-computing/dr-jagadeesh-g",
  },
  {
    name: "Dr. Kamalakannan. J",
    role: "Associate Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-kamalakannan-j.webp",
    portfolioUrl: "https://vit.ac.in/system-and-software/dr-kamalakannan-j",
  },
  {
    name: "Dr. Jayaram Reddy A",
    role: "Associate Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-jayaram-reddy-a.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-jayaram-reddy-a",
  },
  {
    name: "Dr. Mala Serene. I",
    role: "Associate Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-malaserene-i.webp",
    portfolioUrl: "https://vit.ac.in/smart-computing/dr-malaserene-i",
  },
  {
    name: "Dr. Nirmala. M",
    role: "Associate Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-nirmala-m.webp",
    portfolioUrl: "https://vit.ac.in/smart-computing/dr-nirmala-m",
  },
  {
    name: "Dr. Mythili. N",
    role: "Associate Professor",
    affiliation: "SCORE, VIT, Vellore",
    image: "/images/faculty/dr-mythili-n.webp",
    portfolioUrl: "https://vit.ac.in/information-technolo/dr-mythili-n",
  },
];

export const organizingCommitteesData: CommitteeGroup[] = [
  {
    id: "organizing-leadership",
    title: "Organizing Leadership & Conference Chairs",
    description: "Executive academic leads directing the vision, operations, and university coordination of ic-ETITE'28.",
    members: [
      organizingChairs.organizingChair,
      organizingChairs.organizingCoChair,
      organizingChairs.conferenceChair,
      organizingChairs.publicationChair,
      ...organizingChairs.publicationCoChairs,
      organizingChairs.financeChair,
      organizingChairs.financeCoChair,
    ],
  },
  {
    id: "technical-programme-chairs",
    title: "Technical Programme Chairs",
    description: "Curating scientific tracks, reviewing technical paper submissions, and organizing session tracks.",
    members: technicalProgrammeChairs,
  },
  {
    id: "executive-committee",
    title: "Executive Advisory Committee",
    description: "Department heads and distinguished senior professors overseeing academic governance and advisory directions.",
    members: executiveAdvisoryCommittee,
  },
  {
    id: "publication-committee",
    title: "Publication Committee",
    description: "Peer-review coordination, manuscript formatting checks, and IEEE author correspondence.",
    members: publicationCommittee,
  },
  {
    id: "sponsorship-committee",
    title: "Sponsorship Committee",
    description: "Corporate technical sponsorships, industry tie-ups, and academic grant coordination.",
    members: sponsorshipCommittee,
  },
  {
    id: "publicity-media-committee",
    title: "Publicity and Media Committee",
    description: "Global digital marketing, university press releases, and IEEE chapter communication.",
    members: publicityAndMediaCommittee,
  },
  {
    id: "registration-committee",
    title: "Registration Committee",
    description: "Delegate credentialing, registration tariff verification, author pass distribution, and support desk.",
    members: registrationCommittee,
  },
  {
    id: "bolt-hackathon-committee",
    title: "BOLT 3.0 Hackathon Committee",
    description: "Organizing the 36-hour student code marathon, mentorship tracks, and jury evaluation.",
    members: boltHackathonCommittee,
  },
  {
    id: "technext-expo-committee",
    title: "Technext’28 Expo Committee",
    description: "Technology exposition, student innovation showcases, and corporate tech demonstrator stalls.",
    members: technextExpoCommittee,
  },
  {
    id: "event-management-committee",
    title: "Event Management Committee",
    description: "Auditorium logistics, stage protocol, inaugural and valedictory ceremonies management.",
    members: eventManagementCommittee,
  },
  {
    id: "guest-care-committee",
    title: "Guest Care Committee",
    description: "VIP speaker hospitality, campus guest house accommodation, and local transport logistics.",
    members: guestCareCommittee,
  },
  {
    id: "conference-coordinating-committee",
    title: "Conference Coordinating Committee",
    description: "Operational synchronization across departments, track monitoring, and session chair support.",
    members: conferenceCoordinatingCommittee,
  },
];
