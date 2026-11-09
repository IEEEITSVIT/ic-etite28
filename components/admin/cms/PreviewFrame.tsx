"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Monitor, Tablet, Smartphone, RotateCw, ExternalLink, MousePointerClick } from "lucide-react";

// Live preview of the public site inside the admin. Unsaved edits are posted into the page
// (see components/cms/CmsProvider.tsx), so nothing is live until the editor saves.

const DEVICES = [
  { id: "desktop", label: "Desktop", width: 1280, Icon: Monitor },
  { id: "tablet", label: "Tablet", width: 820, Icon: Tablet },
  { id: "phone", label: "Phone", width: 390, Icon: Smartphone },
] as const;

export interface PreviewPatch {
  texts?: Record<string, unknown>;
  images?: Record<string, string>;
  collections?: Record<string, unknown[]>;
}

export interface Inventory {
  path: string;
  texts: { key: string; original: string }[];
  images: { src: string }[];
}

const withPreview = (p: string) => `${p}${p.includes("?") ? "&" : "?"}cms_preview=1`;

export default function PreviewFrame({
  path,
  patch,
  focusKey,
  selectable = false,
  onSelect,
  onPath,
  onInventory,
  note,
}: {
  path: string;
  patch: PreviewPatch;
  focusKey?: string | null;
  selectable?: boolean;
  onSelect?: (key: string) => void;
  onPath?: (path: string) => void;
  onInventory?: (inv: Inventory) => void;
  note?: string;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [device, setDevice] = useState<(typeof DEVICES)[number]["id"]>("desktop");
  const [size, setSize] = useState({ w: 900, h: 700 });
  const [ready, setReady] = useState(false);
  const [current, setCurrent] = useState(path);
  const [address, setAddress] = useState(path);
  const [src, setSrc] = useState(() => withPreview(path));
  const [selectMode, setSelectMode] = useState(selectable);
  const latest = useRef({ patch, focusKey, selectMode, onSelect, onPath, onInventory });
  useLayoutEffect(() => {
    latest.current = { patch, focusKey, selectMode, onSelect, onPath, onInventory };
  });

  const post = useCallback((msg: unknown) => frame.current?.contentWindow?.postMessage(msg, window.location.origin), []);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== frame.current?.contentWindow) return;
      const m = (e.data ?? {}) as { type?: string; path?: string; key?: string } & Partial<Inventory>;
      const l = latest.current;
      if (m.type === "cms-ready") {
        setReady(true);
        post({ type: "cms-patch", ...l.patch });
        post({ type: "cms-select-mode", on: l.selectMode });
      } else if (m.type === "cms-path" && m.path) {
        setCurrent(m.path);
        setAddress(m.path);
        l.onPath?.(m.path);
      } else if (m.type === "cms-select" && m.key) {
        l.onSelect?.(m.key);
      } else if (m.type === "cms-inventory" && m.path) {
        l.onInventory?.({ path: m.path, texts: m.texts ?? [], images: m.images ?? [] });
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [post]);

  // Stream drafts in (debounced so typing stays smooth).
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => post({ type: "cms-patch", ...patch }), 150);
    return () => clearTimeout(t);
  }, [patch, ready, post]);
  useEffect(() => {
    if (ready) post({ type: "cms-select-mode", on: selectMode });
  }, [selectMode, ready, post]);
  useEffect(() => {
    if (ready && focusKey) post({ type: "cms-focus", key: focusKey });
  }, [focusKey, ready, post]);
  // The editor asked for another page.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setReady(false);
    setSrc(withPreview(path));
  }, [path]);

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    if (box.current) ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  const go = (p: string) => {
    if (!p.startsWith("/") || p.startsWith("/admin")) return;
    setReady(false);
    setSrc(withPreview(p));
  };
  const reload = () => {
    setReady(false);
    setSrc(`${withPreview(current)}&r=${Date.now()}`);
  };

  const width = DEVICES.find((d) => d.id === device)!.width;
  const scale = Math.min(1, size.w / width);
  const btn = "inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-brand-primary";

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-1.5 border-b border-slate-200 px-2 py-1.5">
        <div className="flex rounded-lg bg-slate-100 p-0.5" role="group" aria-label="Preview size">
          {DEVICES.map(({ id, label, width: w, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setDevice(id)}
              title={`${label} (${w}px)`}
              aria-pressed={device === id}
              className={`inline-flex h-7 w-8 items-center justify-center rounded-md ${device === id ? "bg-white text-brand-primary shadow-sm" : "text-slate-500"}`}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
        <form
          className="min-w-0 flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            go(address);
          }}
        >
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            aria-label="Preview page"
            className="w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-sm text-slate-700 outline-none focus:border-brand-primary"
          />
        </form>
        {selectable && (
          <button
            type="button"
            onClick={() => setSelectMode((v) => !v)}
            aria-pressed={selectMode}
            title={selectMode ? "Click a text in the preview to edit it (links don't open). Click to browse normally." : "Browsing: links work. Click to pick texts again."}
            className={`${btn} ${selectMode ? "!bg-brand-primary !text-white" : ""}`}
          >
            <MousePointerClick size={16} />
          </button>
        )}
        <button type="button" onClick={reload} className={btn} title="Reload preview">
          <RotateCw size={16} />
        </button>
        <a href={current} target="_blank" rel="noreferrer" className={btn} title="Open the live page (without your unsaved changes)">
          <ExternalLink size={16} />
        </a>
      </div>
      <div ref={box} className="relative min-h-0 flex-1 overflow-hidden bg-slate-100">
        <iframe
          ref={frame}
          title="Website preview"
          src={src}
          className="absolute top-0 origin-top-left border-0 bg-white"
          style={{ width, height: size.h / scale, transform: `scale(${scale})`, left: Math.max(0, (size.w - width * scale) / 2) }}
        />
        {!ready && <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm text-slate-500">Loading preview…</div>}
      </div>
      <div className="border-t border-slate-200 px-3 py-1.5 text-xs text-slate-500">{note ?? "Preview of your unsaved changes. Nothing is live until you save."}</div>
    </div>
  );
}
