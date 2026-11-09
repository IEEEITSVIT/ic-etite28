import type { Metadata, Viewport } from "next";
import { FONT_OPTIONS, fontVariables } from "@/lib/fonts";
import { THEME_COLORS, type Appearance, type ThemeColorKey } from "@/lib/settings";
import "./globals.css";
import AppNavbar from "@/components/AppNavbar";
import TickerBar from "@/components/TickerBar";
import CmsProvider from "@/components/cms/CmsProvider";
import EditBar from "@/components/cms/EditBar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import StartupAnimation from "@/components/StartupAnimation";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { getSettings } from "@/lib/settings";

const CSS_VAR: Record<ThemeColorKey, string> = {
  primary: "--c-primary",
  primaryDark: "--c-primary-dark",
  primaryHover: "--c-primary-hover",
  secondary: "--c-secondary",
  accent: "--c-accent",
  accentDark: "--c-accent-dark",
  text: "--c-text",
  muted: "--c-muted",
  surface: "--c-surface",
  border: "--c-border",
};

const hexToRgb = (hex: string) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

// Admin-chosen theme as CSS variables (colours as RGB triplets so Tailwind opacity works).
function themeCss(a: Appearance) {
  const vars: string[] = [];
  for (const key of Object.keys(THEME_COLORS) as ThemeColorKey[]) {
    const rgb = hexToRgb(a.colors[key] ?? THEME_COLORS[key].value);
    if (rgb) vars.push(`${CSS_VAR[key]}: ${rgb};`);
  }
  const font = (k: string, fallback: string) => FONT_OPTIONS[k as keyof typeof FONT_OPTIONS]?.cssVar ?? fallback;
  vars.push(`--font-body: var(${font(a.bodyFont, "--font-inter")});`);
  vars.push(`--font-heading: var(${font(a.headingFont, "--font-jakarta")});`);
  vars.push(`--font-scale: ${Math.min(1.25, Math.max(0.85, Number(a.fontScale) || 1))};`);
  return `:root{${vars.join("")}}`;
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: "ic-ETITE'28 | Third International Conference on Emerging Trends in Information Technology and Engineering",
    // Page titles already carry the conference name
    template: "%s",
  },
  description:
    "Official website of ic-ETITE'28, the Third International Conference on Emerging Trends in Information Technology and Engineering, organized by Vellore Institute of Technology, Vellore. Technically co-sponsored by IEEE. 10–11 February 2028.",
  keywords: [
    "ic-ETITE",
    "ic-ETITE 2028",
    "IEEE Conference",
    "VIT Vellore",
    "SCORE",
    "IEEE Information Theory Society",
    "Computer Science Conference",
    "Information Technology Conference",
    "Electronics Engineering",
    "IEEE Xplore",
    "ic-ETITE 2028 call for papers",
    "IEEE conference India 2028",
    "international conference Vellore",
    "BOLT hackathon",
  ],
  icons: {
    icon: "/assets/icetite-logo.jpeg",
    apple: "/assets/icetite-logo.jpeg",
  },
  category: "conference",
  authors: [{ name: "Vellore Institute of Technology (VIT), Vellore" }],
  creator: "VIT Vellore, SCORE",
  publisher: "IEEE & Vellore Institute of Technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Third International Conference on Emerging Trends in Information Technology and Engineering",
    description:
      "Official website of ic-ETITE'28, organized by Vellore Institute of Technology, Vellore. Technically co-sponsored by IEEE. 10–11 February 2028.",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ic-ETITE'28 | IEEE International Conference",
    description:
      "Third International Conference on Emerging Trends in Information Technology and Engineering, VIT Vellore, 10–11 Feb 2028.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#002147",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { visibility, ticker, appearance, texts, images } = await getSettings();
  return (
    <html lang="en" data-scroll-behavior="smooth" className={fontVariables} suppressHydrationWarning>
      <head>
        <style id="theme-vars" dangerouslySetInnerHTML={{ __html: themeCss(appearance) }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (location.pathname === "/" && !sessionStorage.getItem("icetite28_intro_seen")) {
                  document.documentElement.classList.add("show-intro");
                }
              } catch (e) {}
            `,
          }}
        />
        {/* JSON-LD Structured Data for Academic Conference Event */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AcademicConference",
              name: "The Third International Conference on Emerging Trends in Information Technology and Engineering (ic-ETITE'28)",
              alternateName: "ic-ETITE'28",
              url: SITE_URL,
              image: `${SITE_URL}/opengraph-image`,
              description:
                "The Third International Conference on Emerging Trends in Information Technology and Engineering, organized by the School of Computer Science Engineering and Information Systems (SCORE), VIT Vellore. Technically co-sponsored by IEEE.",
              startDate: "2028-02-10",
              endDate: "2028-02-11",
              eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
              eventStatus: "https://schema.org/EventScheduled",
              location: {
                "@type": "Place",
                name: "Vellore Institute of Technology",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "School of Computer Science Engineering and Information Systems (SCORE), VIT",
                  addressLocality: "Vellore",
                  addressRegion: "Tamil Nadu",
                  postalCode: "632014",
                  addressCountry: "IN",
                },
              },
              organizer: {
                "@type": "CollegeOrUniversity",
                name: "Vellore Institute of Technology, Vellore",
                url: "https://vit.ac.in",
              },
              sponsor: [
                {
                  "@type": "Organization",
                  name: "IEEE",
                  url: "https://www.ieee.org",
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className="min-h-screen flex flex-col bg-white text-brand-text antialiased"
        suppressHydrationWarning
      >
        <CmsProvider texts={texts} images={images}>
          <StartupAnimation />
          <TickerBar ticker={ticker} />
          <AppNavbar visibility={visibility} />
          <main className="flex-1">{children}</main>
          <Footer visibility={visibility} />
          <BackToTop />
          <EditBar />
        </CmsProvider>
      </body>
    </html>
  );
}
