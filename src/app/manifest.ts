import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "4 Home Inspections",
    short_name: "4HomeInspections",
    description:
      "Professional Home, Apartment, Villa & Commercial Building Inspection Services.",

    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f172a",

    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
