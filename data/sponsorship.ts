// Sponsorship packages shown on /sponsorship. Defaults only — admins edit them in the CMS.

export type SponsorStyle = "platinum" | "gold" | "silver" | "bronze";

export interface SponsorPackage {
  name: string;
  price: string; // free text, e.g. "₹ 5,00,000"
  badge: string;
  tagline: string;
  style: SponsorStyle;
  popular?: boolean;
  benefits: string[];
}

export const defaultSponsorPackages: SponsorPackage[] = [
  {
    name: "Platinum Sponsor",
    price: "₹ 5,00,000",
    badge: "Title Sponsor · Maximum Brand Impact",
    tagline:
      "Premier tier with title sponsor naming rights, premier campus visibility, and dedicated event slots.",
    style: "platinum",
    popular: true,
    benefits: [
      "Company will be identified as the Title Sponsor for ic-ETITE'28.",
      "Branding around campus during the conference through high-impact LED screens across academic blocks and plazas.",
      "One full-page advertisement in the official conference program booklet.",
      "Publicity on campus at the Academic Blocks (during Pre-ic-ETITE and all two days of ic-ETITE).",
      "Nation-wide circulation of commercials through our online media partners.",
      "Marketing through standees inside the campus everywhere.",
      "Dedicated speaker time pre/post conference with non-competing program.",
      "Prominent advertisement on the ic-ETITE'28 website and mobile app.",
      "Name and Logo printed on the official conference T-Shirt.",
      "Dedicated sponsor webpage on conference website (content delivered once approved by committee).",
      "Official judge for the TechNext '28 Exhibition and BOLT 3.0 Hackathon.",
      "Keynote speaker session and tailored corporate event during the conference.",
      "Complimentary 10×10 sq ft exhibition stall for two full days.",
    ],
  },
  {
    name: "Gold Sponsor",
    price: "₹ 3,50,000",
    badge: "Co-Sponsor · High Campus Visibility",
    tagline:
      "Distinguished co-sponsor prominence across academic blocks, digital media, and exhibition arena.",
    style: "gold",
    benefits: [
      "Company will be identified as a Co-Sponsor for ic-ETITE'28.",
      "Branding around campus during the conference through LED screens (more than 30–40 times daily).",
      "Publicity on campus at the Academic Blocks (during Pre-ic-ETITE and all two days of ic-ETITE).",
      "One half-page advertisement in the official conference program booklet.",
      "Nation-wide circulation of commercials through our online media partners.",
      "Marketing through standees placed strategically inside the campus.",
      "Prominent advertisement on the ic-ETITE'28 website and mobile app.",
      "Name and Logo printed on the official conference T-Shirt.",
      "Dedicated speaker session at the conference.",
      "Complimentary 10×10 sq ft exhibition stall for two full days.",
    ],
  },
  {
    name: "Silver Sponsor",
    price: "₹ 2,00,000",
    badge: "Conference Sponsor · Essential Presence",
    tagline:
      "Core conference sponsor package with campus LED branding, marketing standees, and stall space.",
    style: "silver",
    benefits: [
      "Company will be identified as a Sponsor for ic-ETITE'28.",
      "Branding around campus during the conference through LED screens (more than 10–25 times daily).",
      "Publicity on campus at the Academic Blocks (during Pre-ic-ETITE and all two days of ic-ETITE).",
      "Nation-wide circulation of commercials through our online media partners.",
      "Marketing through standees inside the campus.",
      "Advertisement on the ic-ETITE'28 website and mobile app.",
      "Name and Logo printed on the official conference T-Shirt.",
      "Speaker session at the conference.",
      "Complimentary 5×5 sq ft exhibition stall for one full day.",
    ],
  },
];
