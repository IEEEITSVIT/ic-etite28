"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { ImageOverrides, TextOverrides } from "@/lib/cms";

// Published overrides for every visitor. Inside the admin editor's preview iframe
// (?cms_preview=1, framed by this same site) it also:
//   • reports every text and image the page renders (so the editor can list them as fields)
//   • shows unsaved drafts the editor posts in, without saving anything
//   • highlights / reports the text the admin clicks.
// There is no editing on the public site itself.

interface CmsState {
  texts: TextOverrides;
  images: ImageOverrides;
  collections: Record<string, unknown[]>;
  preview: boolean;
  focusKey: string | null;
  register: (kind: "text" | "image", id: string, original: string) => () => void;
}

const CmsContext = createContext<CmsState>({ texts: {}, images: {}, collections: {}, preview: false, focusKey: null, register: () => () => {} });

export const useCms = () => useContext(CmsContext);

export type PreviewMessage =
  | { type: "cms-patch"; texts?: TextOverrides; images?: ImageOverrides; collections?: Record<string, unknown[]> }
  | { type: "cms-focus"; key: string }
  | { type: "cms-select-mode"; on: boolean }
  | { type: "cms-navigate"; path: string };

export default function CmsProvider({ texts, images, children }: { texts: TextOverrides; images: ImageOverrides; children: ReactNode }) {
  const [preview, setPreview] = useState(false);
  const [draftTexts, setDraftTexts] = useState<TextOverrides | null>(null);
  const [draftImages, setDraftImages] = useState<ImageOverrides | null>(null);
  const [draftCollections, setDraftCollections] = useState<Record<string, unknown[]>>({});
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const selectMode = useRef(true);
  // What the page currently renders: id → original + how many mounted copies.
  const inventory = useRef({ texts: new Map<string, { original: string; n: number }>(), images: new Map<string, { original: string; n: number }>() });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const post = useCallback((msg: unknown) => {
    if (window.parent !== window) window.parent.postMessage(msg, window.location.origin);
  }, []);

  // Preview mode only when framed by this same origin (the admin editor).
  useEffect(() => {
    let framedBySelf = false;
    try {
      framedBySelf = window.self !== window.top && window.parent.location.origin === window.location.origin;
    } catch {
      framedBySelf = false;
    }
    if (framedBySelf && new URLSearchParams(window.location.search).has("cms_preview")) setPreview(true);
  }, []);

  const flushInventory = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      post({
        type: "cms-inventory",
        path: window.location.pathname,
        texts: [...inventory.current.texts].map(([key, v]) => ({ key, original: v.original })),
        images: [...inventory.current.images].map(([src]) => ({ src })),
      });
    }, 250);
  }, [post]);

  const register = useCallback(
    (kind: "text" | "image", id: string, original: string) => {
      const map = kind === "text" ? inventory.current.texts : inventory.current.images;
      const entry = map.get(id);
      if (entry) entry.n++;
      else {
        map.set(id, { original, n: 1 });
        flushInventory();
      }
      return () => {
        const e = map.get(id);
        if (e && --e.n <= 0) {
          map.delete(id);
          flushInventory();
        }
      };
    },
    [flushInventory]
  );

  // (New) page inside the preview: tell the editor, then send the page's fields.
  useEffect(() => {
    if (!preview) return;
    post({ type: "cms-path", path: pathname });
    post({ type: "cms-ready" });
    flushInventory();
  }, [preview, pathname, post, flushInventory]);

  useEffect(() => {
    if (!preview) return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== window.parent) return;
      const m = e.data as PreviewMessage;
      if (m?.type === "cms-patch") {
        if (m.texts) setDraftTexts(m.texts);
        if (m.images) setDraftImages(m.images);
        if (m.collections) setDraftCollections(m.collections);
      } else if (m?.type === "cms-focus") {
        setFocusKey(m.key);
        document.querySelector(`[data-cms-key="${CSS.escape(m.key)}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (m?.type === "cms-select-mode") {
        selectMode.current = m.on;
      } else if (m?.type === "cms-navigate" && m.path.startsWith("/")) {
        window.location.href = `${m.path}${m.path.includes("?") ? "&" : "?"}cms_preview=1`;
      }
    };
    // Click a text in the preview to jump to its field; links don't navigate while selecting.
    const onClick = (e: MouseEvent) => {
      if (!selectMode.current) return;
      const el = (e.target as HTMLElement).closest("[data-cms-key]") as HTMLElement | null;
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      setFocusKey(el.dataset.cmsKey!);
      post({ type: "cms-select", key: el.dataset.cmsKey });
    };
    window.addEventListener("message", onMessage);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("click", onClick, true);
    };
  }, [preview, post]);

  const value = useMemo(
    () => ({
      texts: draftTexts ?? texts,
      images: draftImages ?? images,
      collections: draftCollections,
      preview,
      focusKey,
      register,
    }),
    [draftTexts, texts, draftImages, images, draftCollections, preview, focusKey, register]
  );
  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}
