import Link from "next/link";
import E from "@/components/cms/E";

export default function InstitutionalSupport() {
  return (
    <div className="bg-white py-12">
      {/* Technical Sponsor */}
      <div className="flex flex-col items-center text-center px-8 mb-10">
        <h3 className="text-2xl font-bold text-black mb-6"><E f="c.InstitutionalSupport">{"TECHNICAL SPONSORSHIP"}</E></h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-48 h-20 flex items-center justify-center bg-gray-50 border border-gray-200 rounded p-3">
              <span className="text-3xl font-black text-[#006699]"><E f="c.InstitutionalSupport">{"IEEE"}</E></span>
            </div>
            <span className="text-sm font-semibold text-gray-700"><E f="c.InstitutionalSupport">{"Institute of Electrical and Electronics Engineers"}</E></span>
          </div>
        </div>
      </div>

      {/* Supported By */}
      <div className="flex flex-col items-center text-center px-8 mb-6">
        <h3 className="text-2xl font-bold text-black mb-6"><E f="c.InstitutionalSupport">{"ORGANIZING CHAPTER"}</E></h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 flex-wrap">
          {/* IEEE ITS VIT */}
          <Link href="https://ieee-its-vit.vercel.app/" target="_blank" className="flex flex-col items-center gap-2 group">
            <div className="w-48 h-24 bg-gray-50 border border-gray-200 rounded flex items-center justify-center p-3 group-hover:border-blue-500 transition-colors">
              <div className="text-center">
                <div className="text-xl font-black text-[#006699]"><E f="c.InstitutionalSupport">{"IEEE"}</E></div>
                <div className="text-sm text-gray-700 font-bold"><E f="c.InstitutionalSupport">{"Information Theory Society"}</E></div>
                <div className="text-[11px] text-gray-500"><E f="c.InstitutionalSupport">{"VIT Student Chapter"}</E></div>
              </div>
            </div>
            <span className="text-xs font-semibold text-gray-700"><E f="c.InstitutionalSupport">{"IEEE ITS VIT Chapter"}</E></span>
          </Link>
        </div>
      </div>
    </div>
  );
}
