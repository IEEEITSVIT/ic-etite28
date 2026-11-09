"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useCms } from "@/components/cms/CmsProvider";

// Saved CMS lists for the current route (provided by CollectionsBoundary).
const SavedCollections = createContext<Record<string, unknown[]>>({});

export function SavedCollectionsProvider({ value, children }: { value: Record<string, unknown[]>; children: ReactNode }) {
  return <SavedCollections.Provider value={value}>{children}</SavedCollections.Provider>;
}

// A CMS-managed list: the admin preview's unsaved draft, else the published copy, else the default.
export function useCollection<T>(key: string, defaults: T[]): T[] {
  const saved = useContext(SavedCollections);
  const { collections: drafts } = useCms();
  return (drafts[key] ?? saved[key] ?? defaults) as T[];
}
