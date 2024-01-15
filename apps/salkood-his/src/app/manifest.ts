import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "خدمات پرستاری سالکود",
    short_name: "خدمات پرستاری سالکود",
    categories: ["business", "health"],
    description:
      "خدمات پرستاری سالکود ارائه  دهنده خدمات پرستاری برای سالمندان و بیماران در منزل",
    icons: [
      {
        src: "/icons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/mstile-310x310.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/icons/mstile-150x150.png",
        sizes: "150x150",
        type: "image/png",
        purpose: "any",
      },
    ],
    theme_color: "#FFFFFF",
    background_color: "#FFFFFF",
    start_url: "/",
    scope: "/",
    lang: "fa",
    id: "salkood-his",
    display: "standalone",
    display_override: ["fullscreen", "minimal-ui"],
    orientation: "portrait",
    prefer_related_applications: false,
    protocol_handlers: [
      {
        protocol: "web+salkoodservice",
        url: "/services/%s",
        title: "مشاهده خدمت پرستاری",
      },
    ],
    // TODO: add shortcuts
    // TODO: add screenshots
  };
}
