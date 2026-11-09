import type { ReactNode } from "react";
import { getSettings } from "@/lib/settings";
import { SavedCollectionsProvider } from "@/components/cms/useCollection";

// Gives the client components under it the published copies of the listed CMS lists.
export default async function CollectionsBoundary({ keys, children }: { keys: string[]; children: ReactNode }) {
  const { collections } = await getSettings();
  const value = Object.fromEntries(keys.filter((k) => collections[k]).map((k) => [k, collections[k]]));
  return <SavedCollectionsProvider value={value}>{children}</SavedCollectionsProvider>;
}
