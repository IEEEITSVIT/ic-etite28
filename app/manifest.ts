import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ic-ETITE'28 | International Conference on Emerging Trends in Information Technology and Engineering",
    short_name: "ic-ETITE'28",
    description:
      "Third International Conference on Emerging Trends in Information Technology and Engineering, VIT Vellore, 10–11 February 2028.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#002147",
    icons: [{ src: "/assets/icetite-logo.jpeg", sizes: "640x640", type: "image/jpeg" }],
  };
}
