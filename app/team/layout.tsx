import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/team", {
  title: "Web Development Team | ic-ETITE'28",
  description:
    "The IEEE Information Theory Society Student Chapter team at SCORE, VIT Vellore that built the ic-ETITE'28 website.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
