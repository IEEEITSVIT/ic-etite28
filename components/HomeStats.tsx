import E from "@/components/cms/E";
const stats = [
  { value: "300+", label: "Papers Submitted", icon: "📄" },
  { value: "15+", label: "Countries", icon: "🌍" },
  { value: "40+", label: "Keynote Speakers", icon: "🎤" },
  { value: "IEEE", label: "Xplore Indexed", icon: "📚" },
];

export default function HomeStats() {
  return (
    <div className="bg-blue-50 border-b border-blue-100">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl mb-1"><E f="c.HomeStats">{s.icon}</E></div>
            <div className="text-3xl font-extrabold text-blue-900"><E f="c.HomeStats">{s.value}</E></div>
            <div className="text-sm text-blue-600 font-medium mt-1"><E f="c.HomeStats">{s.label}</E></div>
          </div>
        ))}
      </div>
    </div>
  );
}
