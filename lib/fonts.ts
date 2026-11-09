import { Inter, Lato, Merriweather, Montserrat, Open_Sans, Playfair_Display, Plus_Jakarta_Sans, Poppins, Roboto } from "next/font/google";

// Fonts the admin can pick in Site content → Appearance. All are self-hosted by next/font;
// only the defaults are preloaded, and the others are downloaded only when selected.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-poppins", display: "swap", preload: false });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700", "900"], variable: "--font-roboto", display: "swap", preload: false });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap", preload: false });
const lato = Lato({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-lato", display: "swap", preload: false });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-opensans", display: "swap", preload: false });
const merriweather = Merriweather({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-merriweather", display: "swap", preload: false });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap", preload: false });

export const FONT_OPTIONS = {
  inter: { label: "Inter", cssVar: "--font-inter", kind: "Sans-serif" },
  jakarta: { label: "Plus Jakarta Sans", cssVar: "--font-jakarta", kind: "Sans-serif" },
  poppins: { label: "Poppins", cssVar: "--font-poppins", kind: "Sans-serif" },
  roboto: { label: "Roboto", cssVar: "--font-roboto", kind: "Sans-serif" },
  montserrat: { label: "Montserrat", cssVar: "--font-montserrat", kind: "Sans-serif" },
  lato: { label: "Lato", cssVar: "--font-lato", kind: "Sans-serif" },
  opensans: { label: "Open Sans", cssVar: "--font-opensans", kind: "Sans-serif" },
  merriweather: { label: "Merriweather", cssVar: "--font-merriweather", kind: "Serif" },
  playfair: { label: "Playfair Display", cssVar: "--font-playfair", kind: "Serif" },
} as const;

export type FontKey = keyof typeof FONT_OPTIONS;

export const fontVariables = [inter, jakarta, poppins, roboto, montserrat, lato, openSans, merriweather, playfair].map((f) => f.variable).join(" ");
