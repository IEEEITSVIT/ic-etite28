import E from "@/components/cms/E";
export default function ManuscriptSection() {
  return (
    <div className="px-8 md:px-16 py-8 shadow-xl bg-white">
      <h3 className="text-[#DE6D1B] text-2xl font-bold pb-2"><E f="c.ManuscriptSection">{"Manuscript Submission"}</E></h3>
      <p className="text-sm text-gray-700 text-justify leading-relaxed"><E f="c.ManuscriptSection">{"Papers should be submitted through the"}</E><E f="c.ManuscriptSection">{" "}</E>
        <a
          href="/call-for-papers#submit"
          className="text-blue-800 font-bold hover:underline"
        ><E f="c.ManuscriptSection">{"Microsoft (CMT) submission portal"}</E></a><E f="c.ManuscriptSection">{". All submitted papers will go through a plagiarism check process. The manuscript should not contain embedded links, scanned images, header or footer. Email submission will not be accepted. All queries related to the conference shall be addressed to"}</E><E f="c.ManuscriptSection">{" "}</E>
        <a href="mailto:icetiteconference@vit.ac.in" className="text-blue-800 font-bold hover:underline"><E f="c.ManuscriptSection">{"icetiteconference@vit.ac.in"}</E></a><E f="c.ManuscriptSection">{". Original contributions are solicited on topics covered under broad areas not restricted to Information Technology and Engineering."}</E></p>
    </div>
  );
}
