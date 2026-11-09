"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bold, EyeOff, ImageUp, RotateCcw, Search, Undo2 } from "lucide-react";
import type { ImageOverrides, TextOverride, TextOverrides } from "@/lib/cms";
import PreviewFrame, { type Inventory } from "@/components/admin/cms/PreviewFrame";
import { pickAndUploadImage, saveCms } from "@/components/admin/cms/upload";

// Admin → Page content: every text and image of the chosen page as form fields, with a live
// preview beside them (IEEE ITS style). Click a text in the preview to jump to its field.

const SIZES = [
  { v: 0, label: "Size" },
  { v: 0.75, label: "75%" },
  { v: 0.9, label: "90%" },
  { v: 1.1, label: "110%" },
  { v: 1.25, label: "125%" },
  { v: 1.5, label: "150%" },
  { v: 2, label: "200%" },
  { v: 2.5, label: "250%" },
];

type Edit = TextOverride | null; // null = back to the original

const strip = (o?: TextOverride | null): TextOverride | null => {
  if (!o) return null;
  const c: TextOverride = {};
  if (o.t != null) c.t = o.t;
  if (o.c) c.c = o.c;
  if (o.s) c.s = o.s;
  if (o.b) c.b = true;
  if (o.h) c.h = true;
  return Object.keys(c).length ? c : null;
};
const same = (a?: TextOverride | null, b?: TextOverride | null) => JSON.stringify(strip(a)) === JSON.stringify(strip(b));

const groupName = (fileId: string) =>
  fileId === "home" ? "Home page" : fileId.startsWith("c.") ? `Section: ${fileId.slice(2).replace(/([a-z])([A-Z])/g, "$1 $2")}` : `Page: /${fileId}`;

export default function PageEditor({ pages, texts: saved, images: savedImages }: { pages: string[]; texts: TextOverrides; images: ImageOverrides }) {
  const router = useRouter();
  const [path, setPath] = useState("/");
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [edits, setEdits] = useState<Record<string, Edit>>({});
  const [imgEdits, setImgEdits] = useState<Record<string, string | null>>({});
  const originals = useRef<Record<string, string>>({});
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [onlyChanged, setOnlyChanged] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok?: string; error?: string } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const current = useCallback((key: string): TextOverride => (key in edits ? edits[key] ?? {} : saved[key] ?? {}), [edits, saved]);

  const dirtyTexts = useMemo(() => Object.keys(edits).filter((k) => !same(edits[k], saved[k])), [edits, saved]);
  const dirtyImages = useMemo(() => Object.keys(imgEdits).filter((k) => (imgEdits[k] ?? null) !== (savedImages[k] ?? null)), [imgEdits, savedImages]);
  const dirty = dirtyTexts.length + dirtyImages.length;

  const patch = useMemo(() => {
    const texts: TextOverrides = { ...saved };
    for (const [k, v] of Object.entries(edits)) {
      if (v) texts[k] = v;
      else delete texts[k];
    }
    const images: ImageOverrides = { ...savedImages };
    for (const [k, v] of Object.entries(imgEdits)) {
      if (v) images[k] = v;
      else delete images[k];
    }
    return { texts, images };
  }, [saved, edits, savedImages, imgEdits]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const onInventory = useCallback((inv: Inventory) => {
    for (const t of inv.texts) originals.current[t.key] = t.original;
    setInventory(inv);
  }, []);

  const update = useCallback(
    (key: string, next: TextOverride) => {
      const original = originals.current[key] ?? "";
      const n: TextOverride = { ...next };
      if (n.t != null && n.t === original) delete n.t;
      setEdits((e) => ({ ...e, [key]: strip(n) }));
    },
    []
  );

  const onSelect = useCallback((key: string) => {
    setFocusKey(key);
    setQuery("");
    setOnlyChanged(false);
    requestAnimationFrame(() => {
      const el = listRef.current?.querySelector(`[data-field="${CSS.escape(key)}"]`) as HTMLElement | null;
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.querySelector<HTMLElement>("textarea,input")?.focus({ preventScroll: true });
    });
  }, []);

  const save = async () => {
    setBusy(true);
    setMsg(null);
    try {
      await saveCms({
        texts: Object.fromEntries(dirtyTexts.map((k) => [k, edits[k] ? { ...edits[k], o: originals.current[k] ?? saved[k]?.o } : null])),
        images: Object.fromEntries(dirtyImages.map((k) => [k, imgEdits[k] ?? null])),
      });
      setMsg({ ok: `Published ${dirty} change${dirty === 1 ? "" : "s"}.` });
      router.refresh();
      setEdits({});
      setImgEdits({});
    } catch (err) {
      setMsg({ error: err instanceof Error ? err.message : String(err) });
    } finally {
      setBusy(false);
    }
  };

  const discard = () => {
    if (dirty && !confirm(`Discard ${dirty} unsaved change${dirty === 1 ? "" : "s"}?`)) return;
    setEdits({});
    setImgEdits({});
  };

  const replaceImage = async (src: string) => {
    try {
      const url = await pickAndUploadImage();
      if (url) setImgEdits((e) => ({ ...e, [src]: url }));
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  // Fields of the page in the preview, grouped by page / shared section, in page order.
  const groups = useMemo(() => {
    if (!inventory) return [];
    const q = query.trim().toLowerCase();
    const out = new Map<string, { key: string; original: string }[]>();
    for (const t of inventory.texts) {
      const cur = current(t.key);
      if (onlyChanged && !strip(cur)) continue;
      if (q && !`${t.original} ${cur.t ?? ""}`.toLowerCase().includes(q)) continue;
      const g = groupName(t.key.split(":")[0]);
      if (!out.has(g)) out.set(g, []);
      out.get(g)!.push(t);
    }
    return [...out];
  }, [inventory, query, onlyChanged, current]);

  const images = inventory?.images ?? [];

  return (
    <div className="mx-auto max-w-[1700px] px-3 py-4 sm:px-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="mr-auto">
          <h1 className="font-heading text-xl font-bold text-brand-primary">Page content</h1>
          <p className="text-sm text-slate-500">Pick a page, edit its texts and images on the left and check them in the preview. Only admins can see this; nothing changes on the website until you publish.</p>
        </div>
        <select
          value={pages.includes(path) ? path : ""}
          onChange={(e) => e.target.value && setPath(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
          aria-label="Page to edit"
        >
          {!pages.includes(path) && <option value="">{inventory?.path ?? path}</option>}
          {pages.map((p) => (
            <option key={p} value={p}>
              {p === "/" ? "Home" : p}
            </option>
          ))}
        </select>
        <button type="button" onClick={discard} disabled={!dirty || busy} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-600 disabled:opacity-40">
          Discard
        </button>
        <button type="button" onClick={save} disabled={!dirty || busy} className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-40">
          {busy ? "Publishing…" : dirty ? `Publish ${dirty} change${dirty === 1 ? "" : "s"}` : "No changes"}
        </button>
      </div>
      {msg && (
        <div className={`mb-3 rounded-lg px-3 py-2 text-sm ${msg.error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`} role="status">
          {msg.error ?? msg.ok}
        </div>
      )}

      <div className="grid gap-4 lg:h-[calc(100dvh-14rem)] lg:min-h-[560px] lg:grid-cols-[minmax(340px,460px)_1fr]">
        <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2 border-b border-slate-200 p-2">
            <div className="relative flex-1">
              <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search texts on this page"
                className="w-full rounded-md border border-slate-200 py-1.5 pl-8 pr-2 text-sm outline-none focus:border-brand-primary"
              />
            </div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <input type="checkbox" checked={onlyChanged} onChange={(e) => setOnlyChanged(e.target.checked)} /> Edited only
            </label>
          </div>
          <div ref={listRef} className="max-h-[70vh] min-h-0 flex-1 overflow-y-auto p-3 lg:max-h-none">
            {!inventory ? (
              <p className="p-4 text-center text-sm text-slate-500">Loading the page’s fields…</p>
            ) : (
              <>
                {images.length > 0 && !query && !onlyChanged && (
                  <details className="mb-4 rounded-lg border border-slate-200" open={images.length <= 6}>
                    <summary className="cursor-pointer px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">Images ({images.length})</summary>
                    <div className="grid grid-cols-2 gap-2 p-2">
                      {images.map(({ src }) => {
                        const now = src in imgEdits ? imgEdits[src] : savedImages[src];
                        return (
                          <div key={src} className="rounded-lg border border-slate-200 p-1.5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={now || src} alt="" className="h-20 w-full rounded bg-slate-50 object-contain" />
                            <p className="mt-1 truncate text-[10px] text-slate-400" title={src}>
                              {src.split("/").pop()}
                            </p>
                            <div className="mt-1 flex gap-1">
                              <button type="button" onClick={() => replaceImage(src)} className="inline-flex flex-1 items-center justify-center gap-1 rounded bg-slate-100 px-1.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                                <ImageUp size={13} /> Replace
                              </button>
                              {now && (
                                <button type="button" onClick={() => setImgEdits((e) => ({ ...e, [src]: null }))} title="Restore the original image" className="rounded bg-slate-100 px-1.5 py-1 text-slate-600 hover:bg-slate-200">
                                  <Undo2 size={13} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                )}
                {groups.length === 0 && <p className="p-4 text-center text-sm text-slate-500">{query || onlyChanged ? "No texts match." : "This page has no editable texts."}</p>}
                {groups.map(([name, fields]) => (
                  <section key={name} className="mb-5">
                    <h2 className="sticky top-0 z-10 -mx-3 mb-2 bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-500">{name}</h2>
                    <div className="space-y-2.5">
                      {fields.map((t) => (
                        <TextField
                          key={t.key}
                          id={t.key}
                          original={t.original}
                          value={current(t.key)}
                          changed={dirtyTexts.includes(t.key)}
                          focused={focusKey === t.key}
                          onChange={update}
                          onFocus={setFocusKey}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </>
            )}
          </div>
        </div>
        <div className="h-[75vh] min-h-0 lg:h-auto">
          <PreviewFrame
            path={path}
            patch={patch}
            focusKey={focusKey}
            selectable
            onSelect={onSelect}
            onInventory={onInventory}
            onPath={() => setInventory(null)}
            note="Preview of your unsaved changes. Click any text to edit it (toggle the pointer button to browse links). Nothing is live until you publish."
          />
        </div>
      </div>
    </div>
  );
}

const TextField = memo(function TextField({
  id,
  original,
  value,
  changed,
  focused,
  onChange,
  onFocus,
}: {
  id: string;
  original: string;
  value: TextOverride;
  changed: boolean;
  focused: boolean;
  onChange: (key: string, next: TextOverride) => void;
  onFocus: (key: string) => void;
}) {
  const text = value.t ?? original;
  const long = original.length > 70 || text.length > 70;
  const set = (patch: Partial<TextOverride>) => onChange(id, { ...value, ...patch });
  const edited = !!strip(value);
  const inputCls = `w-full rounded-md border px-2.5 py-1.5 text-sm outline-none focus:border-brand-primary ${value.h ? "bg-slate-50 text-slate-400 line-through" : "bg-white"} ${focused ? "border-brand-accent ring-2 ring-brand-accent/30" : "border-slate-200"}`;

  return (
    <div data-field={id} className={`rounded-lg border p-2 ${changed ? "border-amber-300 bg-amber-50/40" : edited ? "border-sky-200 bg-sky-50/30" : "border-transparent"}`}>
      {long ? (
        <textarea value={text} rows={Math.min(8, Math.ceil(text.length / 55) + 1)} onChange={(e) => set({ t: e.target.value })} onFocus={() => onFocus(id)} className={inputCls} />
      ) : (
        <input value={text} onChange={(e) => set({ t: e.target.value })} onFocus={() => onFocus(id)} className={inputCls} />
      )}
      <div className="mt-1 flex flex-wrap items-center gap-1">
        <label className="relative inline-flex h-6 items-center gap-1 rounded border border-slate-200 bg-white px-1 text-[11px] text-slate-600" title="Text colour">
          <span className="h-3.5 w-3.5 rounded-full border border-slate-300" style={{ background: value.c ?? "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)" }} />
          <input type="color" value={value.c ?? "#000000"} onChange={(e) => set({ c: e.target.value })} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Text colour" />
          Colour
        </label>
        {value.c && (
          <button type="button" onClick={() => set({ c: undefined })} className="h-6 rounded border border-slate-200 bg-white px-1 text-[11px] text-slate-500" title="Default colour">
            ×
          </button>
        )}
        <select value={value.s ?? 0} onChange={(e) => set({ s: Number(e.target.value) || undefined })} className="h-6 rounded border border-slate-200 bg-white px-1 text-[11px] text-slate-600" aria-label="Text size">
          {SIZES.map((s) => (
            <option key={s.v} value={s.v}>
              {s.v ? s.label : "Size: default"}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => set({ b: !value.b || undefined })}
          aria-pressed={!!value.b}
          className={`inline-flex h-6 w-6 items-center justify-center rounded border text-[11px] ${value.b ? "border-brand-primary bg-brand-primary text-white" : "border-slate-200 bg-white text-slate-600"}`}
          title="Bold"
        >
          <Bold size={12} />
        </button>
        <button
          type="button"
          onClick={() => set({ h: !value.h || undefined })}
          aria-pressed={!!value.h}
          className={`inline-flex h-6 items-center gap-1 rounded border px-1.5 text-[11px] ${value.h ? "border-red-300 bg-red-50 text-red-700" : "border-slate-200 bg-white text-slate-600"}`}
          title="Hide this text on the website"
        >
          <EyeOff size={12} /> {value.h ? "Hidden" : "Hide"}
        </button>
        {edited && (
          <button type="button" onClick={() => onChange(id, {})} className="ml-auto inline-flex h-6 items-center gap-1 rounded px-1.5 text-[11px] text-slate-500 hover:bg-slate-100" title={`Restore the original: “${original}”`}>
            <RotateCcw size={12} /> Original
          </button>
        )}
      </div>
    </div>
  );
});
