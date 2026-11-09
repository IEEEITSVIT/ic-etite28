import E from "@/components/cms/E";
export default function CampusGallery() {
  const photos = [
    { src: "/images/img1.jpg", alt: "VIT Campus View 1" },
    { src: "/images/vit2.jpg", alt: "VIT Campus View 2" },
    { src: "/images/img3.jpg", alt: "VIT Campus View 3" },
  ];

  const gradients = [
    "from-blue-200 to-blue-300",
    "from-indigo-200 to-indigo-300",
    "from-sky-200 to-sky-300",
  ];

  return (
    <div className="flex flex-col md:flex-row">
      {photos.map((photo, i) => (
        <div key={i} className="w-full md:w-1/3 h-[40vh] relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.src}
            alt={photo.alt}
            className="w-full h-full object-cover object-center"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${gradients[i]} flex items-center justify-center -z-10`}>
            <div className="text-center text-blue-600">
              <div className="text-4xl mb-2"><E f="c.CampusGallery">{"🏛️"}</E></div>
              <p className="text-sm font-medium"><E f="c.CampusGallery">{photo.alt}</E></p>
              <p className="text-xs mt-1 opacity-70"><E f="c.CampusGallery">{"VIT Vellore, India"}</E></p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
