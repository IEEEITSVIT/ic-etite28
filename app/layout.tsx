import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AppNavbar from "@/components/AppNavbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import StartupAnimation from "@/components/StartupAnimation";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

// Self-hosted at build time: Inter for body text, Plus Jakarta Sans for headings.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (!sessionStorage.getItem("icetite28_intro_seen")) {
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
        className="min-h-screen flex flex-col bg-white text-[#101B2E] antialiased"
        suppressHydrationWarning
      >
        <StartupAnimation />
        <AppNavbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
