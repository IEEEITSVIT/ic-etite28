import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/committees", {
  title: "Organizing Committees | ic-ETITE'28",
  description:
    "Chief patrons, patrons, organizing chairs, conference chairs, publication, finance and technical committees of ic-ETITE'28 at VIT Vellore.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
