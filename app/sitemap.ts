import { MetadataRoute } from "next";
import { SITE_ROUTES, SITE_URL } from "@/lib/seo";
import { getSettings } from "@/lib/settings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const { visibility } = await getSettings();
  // Pages switched off in the CMS return 404, so keep them out of the sitemap.
  const hidden = new Set([...(visibility.bolt ? [] : ["/hackathon"]), ...(visibility.technext ? [] : ["/technext"])]);

  return SITE_ROUTES.filter(({ path }) => !hidden.has(path)).map(({ path, priority }) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority,
  }));
}
