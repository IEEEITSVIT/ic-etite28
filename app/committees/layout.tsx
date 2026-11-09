import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import CollectionsBoundary from "@/components/cms/CollectionsBoundary";

export const metadata: Metadata = pageMetadata("/committees", {
  title: "Organizing Committees | ic-ETITE'28",
  description:
    "Chief patrons, patrons, organizing chairs, conference chairs, publication, finance and technical committees of ic-ETITE'28 at VIT Vellore.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CollectionsBoundary keys={["committees.leadershipLeft", "committees.leadershipRight", "committees.functional", "committees.students", "advisory.international", "advisory.national", "advisory.technical"]}>{children}</CollectionsBoundary>;
}
