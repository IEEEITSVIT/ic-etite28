import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/advisory", {
  title: "Advisory Board & Technical Committee | ic-ETITE'28",
  description:
    "International and national advisory board and technical programme committee members of ic-ETITE'28, VIT Vellore.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
