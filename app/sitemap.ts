import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: siteConfig.site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: siteConfig.site.url + "/soho", lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: siteConfig.site.url + "/phone", lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: siteConfig.site.url + "/cctv", lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
