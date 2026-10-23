import type { MetadataRoute } from "next";
import { contactEmail, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/jobs", "/about", "/privacy", ...(contactEmail ? ["/contact"] : [])];
  return paths.map((path) => ({ url: `${siteUrl}${path}` }));
}
