import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EnterRent — Verified Airbnb Host Swap & Backup Network",
    short_name: "EnterRent",
    description:
      "A trusted network for verified Airbnb hosts to swap stays with hosts abroad or find emergency backup hosting.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f2942",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
