export interface RegistrationFeeTier {
  category: string;
  indianFee: string;
  foreignFee: string;
  isIeeeDiscount?: boolean;
}

export interface RegistrationPolicy {
  rule: string;
  isImportant?: boolean;
}

export const registrationFeesData: RegistrationFeeTier[] = [
  {
    category: "Industry Professionals",
    indianFee: "INR 15,000",
    foreignFee: "USD 400",
  },
  {
    category: "Faculty / Academicians",
    indianFee: "INR 14,000",
    foreignFee: "USD 350",
  },
  {
    category: "Faculty / Academicians (IEEE Members)",
    indianFee: "INR 12,000",
    foreignFee: "USD 325",
    isIeeeDiscount: true,
  },
  {
    category: "Research Scholars, UG and PG Students",
    indianFee: "INR 10,000",
    foreignFee: "USD 300",
  },
  {
    category: "Research Scholars, UG and PG Students (IEEE Members)",
    indianFee: "INR 8,000",
    foreignFee: "USD 275",
    isIeeeDiscount: true,
  },
  {
    category: "VIT (internal)",
    indianFee: "INR 10,000",
    foreignFee: "—",
  },
  {
    category: "Co-Authors / Participants (non-authors)",
    indianFee: "INR 5,000",
    foreignFee: "USD 200",
  },
];

export const registrationGuidelines: RegistrationPolicy[] = [
  {
    rule: "Registration fee includes conference participation, proceedings kit, technical session access, and applicable taxes.",
  },
  {
    rule: "In adherence to IEEE guidelines, only papers presented in person or as scheduled by the conference committee will be considered for recommendation to the IEEE Xplore® Digital Library.",
    isImportant: true,
  },
  {
    rule: "Authors must verify their registration category and IEEE membership credentials before completing payment. Deviations will require category rectification.",
    isImportant: true,
  },
  {
    rule: "For each accepted paper, at least one author must register under the applicable author category by the camera-ready deadline.",
  },
  {
    rule: "Co-Authors or non-presenting participants may register under the Co-Authors / Participants category.",
  },
];
