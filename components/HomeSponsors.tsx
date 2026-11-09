// Sponsor logos in rectangle format with fallback placeholders
const technicalCoSponsors = [
  { name: "IEEE", logo: "/logos/ieee-logo.svg", url: "https://www.ieee.org", bg: "bg-blue-50" },
];

const supportedBy = [
  { name: "IEEE ITS VIT Chapter", logo: "/logos/logo-round-ieee-its.png", url: "https://ieee-its-vit.vercel.app/", bg: "bg-blue-50" },
  { name: "VIT Vellore", logo: "/logos/vit-header-logo.webp", url: "https://vit.ac.in", bg: "bg-sky-50" },
];

type Sponsor = { name: string; logo: string; url: string; bg: string };

function SponsorLogo({ s, size = "normal" }: { s: Sponsor; size?: "large" | "normal" }) {
  const h = size === "large" ? "h-20" : "h-14";
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center ${s.bg} border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${size === "large" ? "px-8 py-6" : "px-5 py-4"}`}
    >
      {s.logo ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={s.logo}
          alt={s.name}
          className={`${h} w-auto object-contain`}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      ) : null}
      <span className="text-xs font-semibold text-gray-500 text-center leading-tight">{s.name}</span>
    </a>
  );
}

export default function HomeSponsors() {
  return (
    <section className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-6">

        {/* Technical Sponsor */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Technical Sponsorship</p>
          <h3 className="text-2xl font-extrabold text-gray-900 mb-6">IEEE</h3>
          <div className="flex justify-center">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl px-12 py-6 flex items-center gap-4 max-w-sm">
              <div className="text-4xl font-black text-blue-800">IEEE</div>
              <div className="text-left">
                <p className="font-bold text-blue-900 text-sm">Institute of Electrical &amp; Electronics Engineers</p>
                <p className="text-xs text-blue-600">Technical Sponsor</p>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-100 mb-10" />

        {/* Supported By */}
        <div className="text-center mb-6">
          <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Organizing Society</p>
          <h3 className="text-xl font-bold text-gray-800 mb-6">Academic &amp; Professional Chapters</h3>
          <div className="flex justify-center gap-6 flex-wrap">
            {supportedBy.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                className={`${s.bg} border border-gray-200 rounded-lg p-5 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow min-w-[200px] min-h-[100px]`}>
                <div className="text-2xl font-black text-blue-800">IEEE</div>
                <p className="text-xs font-semibold text-gray-700 text-center leading-tight">{s.name}</p>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
