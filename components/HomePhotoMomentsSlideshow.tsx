import GallerySlideshow, {
  type GalleryItem,
} from "@/components/GallerySlideshow";
import { ICETITE24_PHOTOS } from "@/data/icetite24GalleryData";

const base = "/images/icetite24-slideshow";

const existingSlideshowItems: GalleryItem[] = ICETITE24_PHOTOS.map((photo) => ({
  id: photo.id,
  image: photo.image,
  title: photo.title,
  edition: photo.edition,
  location: photo.location,
  caption: photo.caption,
  category: "2024",
}));

function createGroup(
  folder: string,
  filenames: string[],
  title: string,
  caption: string,
): GalleryItem[] {
  return filenames.map((filename, index) => {
    const encodedName = encodeURIComponent(filename);

    return {
      id: `${folder}-${index + 1}`,
      image: `${base}/${folder}/${encodedName}`,
      thumbnail: `${base}/thumbs/${folder}/${encodedName}`,
      title,
      edition: "ic-ETITE'24 · Second Edition",
      location: "VIT Vellore",
      caption,
      category: "2024",
    };
  });
}

const newSlideshowItems: GalleryItem[] = [
  ...createGroup(
    "inauguration",
    [
      "inauguration (1).webp",
      "inauguration (2).webp",
      "inauguration (3).webp",
      "inauguration (4).webp",
      "inauguration (5).webp",
      "inauguration (6).webp",
    ],
    "Inauguration Ceremony",
    "Highlights from the inauguration of ic-ETITE'24, bringing together distinguished guests, faculty, researchers and student delegates."
  ),
  ...createGroup(
    "presentation",
    ["Presentation (1).webp", "Presentation (2).webp", "Presentation (3).webp"],
    "Research Presentations",
    "Researchers and presenters sharing their work and engaging in technical discussions during the conference sessions."
  ),
  ...createGroup(
    "bolt-hackathon",
    [
      "Bolt Hackathon (1).webp",
      "Bolt Hackathon (2).webp",
      "Bolt Hackathon (3).webp",
    ],
    "BOLT 2.0 Hackathon",
    "Student teams collaborating, developing ideas and presenting solutions during the BOLT 2.0 hackathon."
  ),
  ...createGroup(
    "evening-dinner",
    [
      "Evening Dinner Events (1).webp",
      "Evening Dinner Events (2).webp",
      "Evening Dinner Events (3).webp",
      "Evening Dinner Events (4).webp",
      "Evening Dinner Events (5).webp",
      "Evening Dinner Events (6).webp",
      "Evening Dinner Events (7).webp",
      "Evening Dinner Events (8).webp",
    ],
    "Evening Dinner & Fellowship",
    "Conference delegates, speakers and organisers coming together for an evening of fellowship and networking."
  ),
  ...createGroup(
    "technext24",
    [
      "TechNext'24 (1).webp",
      "TechNext'24 (2).webp",
      "TechNext'24 (3).webp",
      "TechNext'24 (4).webp",
      "TechNext'24 (5).webp",
      "TechNext'24 (6).webp",
    ],
    "TechNext'24 Industry Expo",
    "Student projects, prototypes and emerging technologies showcased during the TechNext'24 industrial expo."
  ),
  ...createGroup(
    "panel-discussion",
    [
      "Panel Discussion (1).webp",
      "Panel Discussion (2).webp",
      "Panel Discussion (3).webp",
    ],
    "Panel Discussion",
    "Experts exchanging perspectives on emerging trends, challenges and opportunities in information technology and engineering."
  ),
  ...createGroup(
    "valedictory",
    ["Valedictory (1).webp", "Valedictory (2).webp", "Valedictory (3).webp"],
    "Valedictory Ceremony",
    "The closing proceedings of ic-ETITE'24, recognising the contributions and achievements of speakers, researchers and participants."
  ),
];

const slideshowItems = [...existingSlideshowItems, ...newSlideshowItems];

export default function HomePhotoMomentsSlideshow() {
  return (
    <section className="bg-[#F7F9FC] border-b border-slate-200 py-10 md:py-14 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#002147]">
            Moments from ic-ETITE&apos;24
          </h2>
        </div>

        <div className="bg-white p-4 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <GallerySlideshow
            items={slideshowItems}
            showCategoryFilter={false}
          />
        </div>
      </div>
    </section>
  );
}
