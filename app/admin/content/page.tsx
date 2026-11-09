import { getSettings } from "@/lib/settings";
import { SITE_ROUTES } from "@/lib/seo";
import PageEditor from "@/components/admin/cms/PageEditor";

export const dynamic = "force-dynamic";

// Admin → Page content: form fields for every text and image of a page, with a live preview.
export default async function AdminContentPage() {
  const { texts, images } = await getSettings();
  const pages = [...SITE_ROUTES.map((r) => r.path), "/login", "/signup"];
  return <PageEditor pages={pages} texts={texts} images={images} />;
}
