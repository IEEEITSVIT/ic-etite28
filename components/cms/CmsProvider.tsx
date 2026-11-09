"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { ImageOverrides, TextOverride, TextOverrides } from "@/lib/cms";

interface CmsState {
  texts: TextOverrides;
  images: ImageOverrides;
  isAdmin: boolean;
  editing: boolean;
  setEditing: (v: boolean) => void;
  selected: { key: string; original: string } | null;
  select: (s: { key: string; original: string } | null) => void;
  saveText: (key: string, value: TextOverride | null) => Promise<void>;
  saveImage: (src: string, url: string | null) => Promise<void>;
  status: string;
}

const CmsContext = createContext<CmsState>({
  texts: {},
  images: {},
  isAdmin: false,
  editing: false,
  setEditing: () => {},
  selected: null,
  select: () => {},
  saveText: async () => {},
  saveImage: async () => {},
  status: "",
});

export const useCms = () => useContext(CmsContext);

const EDIT_FLAG = "ic_cms_editing";

export default function CmsProvider({ texts: initialTexts, images: initialImages, children }: { texts: TextOverrides; images: ImageOverrides; children: ReactNode }) {
  const [texts, setTexts] = useState(initialTexts);
  const [images, setImages] = useState(initialImages);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editing, setEditingState] = useState(false);
  const [selected, select] = useState<{ key: string; original: string } | null>(null);
  const [status, setStatus] = useState("");
  const pathname = usePathname();

  useEffect(() => setTexts(initialTexts), [initialTexts]);
  useEffect(() => setImages(initialImages), [initialImages]);

  // Only signed-in admins get the editor; everyone else just sees the overrides. Re-checked on
  // navigation because the layout (and this provider) stays mounted across login/logout.
  useEffect(() => {
    if (!/(?:^|;\s*)ic_logged_in=1/.test(document.cookie)) {
      setIsAdmin(false);
      setEditingState(false);
      return;
    }
    if (isAdmin) return;
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((me: { role?: string } | null) => {
        if (me?.role !== "admin") return;
        setIsAdmin(true);
        try {
          if (sessionStorage.getItem(EDIT_FLAG) === "1") setEditingState(true);
        } catch {}
      })
      .catch(() => {});
  }, [pathname, isAdmin]);

  const setEditing = useCallback((v: boolean) => {
    setEditingState(v);
    select(null);
    try {
      sessionStorage.setItem(EDIT_FLAG, v ? "1" : "0");
    } catch {}
  }, []);

  // While editing, links and buttons must not navigate or submit when clicked to edit them.
  useEffect(() => {
    if (!editing) return;
    const block = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-cms-toolbar]")) return;
      if (t.closest("[data-cms-key],[data-cms-img]")) {
        if (t.closest("a,button,summary,label")) e.preventDefault();
      }
    };
    document.addEventListener("click", block, true);
    return () => document.removeEventListener("click", block, true);
  }, [editing]);

  const post = useCallback(async (body: unknown) => {
    setStatus("Saving…");
    const res = await fetch("/api/admin/cms", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setStatus(res.ok ? "Saved" : `Not saved: ${data.error ?? res.statusText}`);
    if (res.ok) setTimeout(() => setStatus(""), 1500);
    return res.ok;
  }, []);

  const saveText = useCallback(
    async (key: string, value: TextOverride | null) => {
      const prev = texts;
      setTexts((t) => {
        const next = { ...t };
        if (value) next[key] = value;
        else delete next[key];
        return next;
      });
      if (!(await post({ type: "text", key, value }))) setTexts(prev);
    },
    [post, texts]
  );

  const saveImage = useCallback(
    async (src: string, url: string | null) => {
      const prev = images;
      setImages((m) => {
        const next = { ...m };
        if (url) next[src] = url;
        else delete next[src];
        return next;
      });
      if (!(await post({ type: "image", src, url }))) setImages(prev);
    },
    [post, images]
  );

  const value = useMemo(
    () => ({ texts, images, isAdmin, editing, setEditing, selected, select, saveText, saveImage, status }),
    [texts, images, isAdmin, editing, setEditing, selected, saveText, saveImage, status]
  );
  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}
