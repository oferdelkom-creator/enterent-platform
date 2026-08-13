import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://enterent.org/", changeFrequency: "weekly", priority: 1 },
    { url: "https://enterent.org/signup", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://enterent.org/login", changeFrequency: "monthly", priority: 0.3 },
  ];
}
