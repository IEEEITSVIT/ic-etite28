import Link from "next/link";
import E from "@/components/cms/E";

export default function AboutSection() {
  return (
    <>
      {/* About IC-ETITE — diagonal clip left */}
      <div className="flex flex-col lg:flex-row bg-[#E7F4FF]">
        <div
          className="w-full lg:w-[60%] pr-0 lg:pr-20 py-10 px-8 md:px-16"
          style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)" }}
        >
          <h2 className="text-2xl font-bold text-[#DE6D1B] mb-4"><E f="c.AboutSection">{"About IC-ETITE"}</E></h2>
          <p className="text-sm text-gray-800 text-justify leading-relaxed"><E f="c.AboutSection">{"The purpose of this conference is to enhance the research in Information Technology, Computer Engineering, Communication Engineering, Electronics Engineering and to afford an international platform for researchers, academicians, engineers, industrialists and students around the world to share their research findings with the global experts in the field of Science and Technology. The primary goal of the conference is to help the delegates to launch their research or business relations and to associate for future collaborations in their career path. Original, unpublished papers highlighting specific research domains from all subject perspectives are invited from delegates worldwide."}</E></p>
        </div>
        <div className="w-full lg:w-[40%] min-h-[280px] bg-gray-200 relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/conference1.jpg"
            alt="Conference Session"
            className="w-full h-full object-cover"
            style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)" }}
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.style.display = "none";
              el.parentElement!.innerHTML = `<div class="flex items-center justify-center h-full min-h-[280px] bg-gradient-to-br from-blue-100 to-blue-200 text-blue-400 text-sm font-medium" style="clip-path:polygon(15% 0, 100% 0, 100% 100%, 0 100%)"><span>📷 Conference Photo Placeholder</span></div>`;
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 -z-10">
            <span className="text-blue-400 text-sm font-medium"><E f="c.AboutSection">{"📷 Conference Photo Placeholder"}</E></span>
          </div>
        </div>
      </div>

      <div className="py-1 bg-white" />

      {/* Theme — diagonal clip right */}
      <div className="flex flex-col lg:flex-row-reverse bg-[#E7F4FF]">
        <div
          className="w-full lg:w-[60%] pl-0 lg:pl-20 py-10 px-8 md:px-16"
          style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)" }}
        >
          <h2 className="text-2xl font-bold text-[#DE6D1B] mb-4"><E f="c.AboutSection">{"Theme of the Conference"}</E></h2>
          <p className="text-sm text-gray-800 text-justify leading-relaxed"><E f="c.AboutSection">{"ic-ETITE'28 expresses the importance of upgrading the research in Information Technology and Engineering. It motivates to provide a worldwide platform to researchers far and widespread by exploring their innovations in the field of science and technology. The mission is to promote and improve the research and development related to Information Technology and Engineering. The essential objective of the conference is to assist the researchers in discovering the global linkage for future joint efforts in their academic outlook. The conference focuses on four core research tracks — Information Technology, Communication Engineering, Computing, and Electronics."}</E></p>
        </div>
        <div className="w-full lg:w-[40%] min-h-[280px] bg-gray-200 relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/conference2.jpg"
            alt="Conference Theme"
            className="w-full h-full object-cover"
            style={{ clipPath: "polygon(0 0, 85% 0, 100% 100%, 0% 100%)" }}
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.style.display = "none";
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-200 -z-10">
            <span className="text-indigo-400 text-sm font-medium"><E f="c.AboutSection">{"📷 Theme Photo Placeholder"}</E></span>
          </div>
        </div>
      </div>

      <div className="py-1 bg-white" />

      {/* ic-ETITE'20 Highlights */}
      <div className="flex flex-col lg:flex-row bg-[#E7F4FF]">
        <div
          className="w-full lg:w-[60%] pr-0 lg:pr-20 py-10 px-8 md:px-16"
          style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)" }}
        >
          <h2 className="text-2xl font-bold text-[#DE6D1B] mb-4"><E f="c.AboutSection">{"Highlights of Previous ic-ETITE'24"}</E></h2>
          <div className="space-y-2.5 text-sm text-gray-800 text-justify">
            <p><E f="c.AboutSection">{"✶ The Second International Conference on Emerging Trends in Information Technology and Engineering was organized on 22nd & 23rd February 2024."}</E></p>
            <p><E f="c.AboutSection">{"✶ ic-ETITE'24 was technically Co-sponsored by IEEE and organized by SCORE with IEEE ITS VIT."}</E></p>
            <p><E f="c.AboutSection">{"✶ All the presented papers were published in the IEEE Xplore by the IEEE."}</E></p>
            <p>
              <a href="https://ieeexplore.ieee.org/xpl/conhome/9070069/proceeding" target="_blank" rel="noopener noreferrer" className="text-blue-700 font-bold hover:underline"><E f="c.AboutSection">{"ic-ETITE'24 Proceedings on IEEE Xplore →"}</E></a>
            </p>
            <p><E f="c.AboutSection">{"✶ ic-ETITE'24 had 18+ technical and keynote sessions."}</E></p>
            <p><E f="c.AboutSection">{"✶ Over 300 papers submitted from 15+ countries."}</E></p>
          </div>
        </div>
        <div className="w-full lg:w-[40%] min-h-[280px] relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/ic-etite24.webp"
            alt="ic-ETITE'24 conference session"
            className="w-full h-full object-cover"
            style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)" }}
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.style.display = "none";
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 -z-10">
            <span className="text-green-500 text-sm font-medium"><E f="c.AboutSection">{"📷 Previous Edition Photo"}</E></span>
          </div>
        </div>
      </div>
    </>
  );
}
