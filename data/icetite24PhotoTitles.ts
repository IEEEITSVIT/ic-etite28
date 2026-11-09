export type PhotoTitleMap = Record<string, string>;

/**
 * Keys use the public image path after the category folder.
 * Keep filenames exactly as they appear in public/images.
 */
const PHOTO_TITLES: PhotoTitleMap = {
  // Inaugural ceremony
  "inaugural/004A3120.webp": "Distinguished Guests in Conversation",
  "inaugural/004A3136.webp": "Ceremonial Planting",
  "inaugural/004A3145.webp": "Guests at the Inaugural Ceremony",
  "inaugural/004A3182.webp": "Conference Audience",
  "inaugural/004A3189.webp": "Inaugural Ceremony Highlights",
  "inaugural/004A3344.webp": "Distinguished Guests at VIT",
  "inaugural/IMG_2981.webp": "IC-ETITE’24 Audience",
  "inaugural/IMG_3505.webp": "Technical Presentation",
  "inaugural/IMG_4352.webp": "Ceremonial Lamp Lighting",
  "inaugural/IMG_4377.webp": "Felicitation Ceremony",
  "inaugural/IMG_4392.webp": "Keynote Address",
  "inaugural/IMG_4424.webp": "Distinguished Guests on Stage",
  "inaugural/IMG_4432.webp": "Inaugural Ceremony Moments",

  // Bolt Hackathon
  "bolt-hackathon/004A3647.webp": "Hackathon Highlights",
  "bolt-hackathon/IMG_3397.webp": "Hackathon Participants",
  "bolt-hackathon/IMG_3402.webp": "Collaborative Problem Solving",
  "bolt-hackathon/IMG_3422.webp": "Innovation in Action",
  "bolt-hackathon/IMG_3433.webp": "Hackathon Teamwork",
  "bolt-hackathon/IMG_3482.webp": "Student Innovation",
  "bolt-hackathon/IMG_3496.webp": "Hackathon Showcase",

  // Conference
  "conference/IMG_3505.webp": "Conference Presentation",
  "conference/IMG_4777.webp": "Conference Highlights",
  "conference/IMG_8949.webp": "Conference Participants",

  // Conference keynote
  "conference-keynote/IMG_8900.webp": "Keynote Session",
  "conference-keynote/IMG_8949.webp": "Keynote Audience",
  "conference-keynote/IMG_8993.webp": "Distinguished Keynote Speaker",
  "conference-keynote/IMG_9159.webp": "Expert Insights",

  // Evening dinner
  "evening-dinner-greenos/004A3622.webp": "Conference Dinner Gathering",
  "evening-dinner-greenos/A32A0994.webp": "Dinner with Distinguished Guests",
  "evening-dinner-greenos/A32A1001.webp": "Evening Networking",
  "evening-dinner-greenos/A32A1022.webp": "Conference Dinner Moments",
  "evening-dinner-greenos/A32A1052.webp": "Guests at the Dinner",
  "evening-dinner-greenos/A32A1199.webp": "Networking over Dinner",
  "evening-dinner-greenos/A32A1210.webp": "Evening Celebration",
  "evening-dinner-greenos/A32A1252.webp": "Conference Community",
  "evening-dinner-greenos/A32A1283.webp": "Dinner Gathering",
  "evening-dinner-greenos/A32A1356.webp": "Memorable Evening",

  // Panel discussion
  "panel-discussion/IMG_9227.webp": "Panel of Experts",
  "panel-discussion/IMG_9229.webp": "Expert Discussion",
  "panel-discussion/IMG_9245.webp": "Knowledge Exchange",
  "panel-discussion/IMG_9273.webp": "Panel Perspectives",
  "panel-discussion/IMG_9289.webp": "Interactive Discussion",
  "panel-discussion/IMG_9306.webp": "Audience Engagement",

  // TechNext'24
  "technext24/004A3356.webp": "TechNext’24 Highlights",
  "technext24/004A3374.webp": "Technology Showcase",
  "technext24/004A3378.webp": "Emerging Technology",
  "technext24/004A3386.webp": "Technical Exchange",
  "technext24/004A3390.webp": "Innovation Showcase",
  "technext24/004A3406.webp": "Technology and Research",
  "technext24/004A3409.webp": "TechNext’24 Participants",
  "technext24/IMG_3067.webp": "Technology Session",
  "technext24/IMG_3341.webp": "Research Highlights",
  "technext24/IMG_4458.webp": "Technical Community",
  "technext24/IMG_4487.webp": "TechNext’24 Moments",

  // Valedictory
  "valedictory/004A3695.webp": "Valedictory Ceremony",
  "valedictory/004A3712.webp": "Celebrating Conference Achievements",
  "valedictory/IMG_3873.webp": "Valedictory Highlights",
  "valedictory/IMG_9370.webp": "Closing Ceremony",
  "valedictory/IMG_9383.webp": "Conference Recognition",
  "valedictory/IMG_9437.webp": "Felicitation and Appreciation",
  "valedictory/IMG_9440.webp": "Distinguished Guests",
  "valedictory/IMG_9450.webp": "Celebrating Contributions",
  "valedictory/IMG_9464.webp": "Conference Memories",
  "valedictory/IMG_9477.webp": "A Memorable Conclusion",
};

const CATEGORY_TITLES: Record<string, string> = {
  inaugural: "Inaugural Ceremony",
  "bolt-hackathon": "Bolt Hackathon Highlights",
  conference: "Conference Moments",
  "conference-keynote": "Keynote Session",
  "evening-dinner-greenos": "Conference Dinner",
  valedictory: "Valedictory Ceremony",
  "panel-discussion": "Panel Discussion",
  technext24: "TechNext’24 Highlights",
  main: "IC-ETITE’24 Memories",
};

export function getIcetite24PhotoTitle(
  imagePath: string,
  originalTitle?: string,
): string {
  const path = imagePath
    .split("/images/icetite24-folder-gallery/")
    .pop()
    ?.replace(/^\/+/, "");

  if (path && PHOTO_TITLES[path]) {
    return PHOTO_TITLES[path];
  }

  const folder = path?.split("/")[0] ?? "";
  const original = originalTitle?.trim() ?? "";

  if (
    original &&
    !/^(IMG|DSC|DSCF|PXL|DJI|DSCN|WhatsApp Image|A)\s*[_\s-]*\d+/i.test(
      original,
    ) &&
    !/^\d+$/.test(original)
  ) {
    return original.replace(/[_-]+/g, " ");
  }

  return CATEGORY_TITLES[folder] ?? "IC-ETITE’24 Memories";
}
