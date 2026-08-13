import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/invite", "/auth"],
      },
    ],
    sitemap: "https://enterent.org/sitemap.xml",
  };
}
