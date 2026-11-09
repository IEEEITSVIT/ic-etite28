"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Copy, ImageUp, Plus, RotateCcw, Search, Trash2 } from "lucide-react";
import { COLLECTIONS, type FieldDef } from "@/lib/collections";
import PreviewFrame from "@/components/admin/cms/PreviewFrame";
import { pickAndUploadImage, saveCms } from "@/components/admin/cms/upload";

// Admin → Lists: add, remove, reorder and edit committee members, advisory boards, the team and
// research tracks, with a live preview of the page that shows the list.

type Item = Record<string, unknown>;

const KEYS = Object.keys(COLLECTIONS);
const GROUPS = [...new Set(KEYS.map((k) => COLLECTIONS[k].group))];
const blank = (fields: FieldDef[]): Item => Object.fromEntries(fields.map((f) => [f.key, f.type === "list" || f.type === "lines" ? [] : ""]));
const move = <T,>(arr: T[], from: number, to: number) => {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [x] = next.splice(from, 1);
  next.splice(to, 0, x);
  return next;
};
const inputCls = "w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-brand-primary";
const iconBtn = "inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-brand-primary disabled:opacity-30";

export default function ListsEditor({ saved }: { saved: Record<string, unknown[]> }) {
  const router = useRouter();
  const [key, setKey] = useState(KEYS[0]);
  const [drafts, setDrafts] = useState<Record<string, Item[]>>({});
  const [resets, setResets] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok?: string; error?: string } | null>(null);

  const def = COLLECTIONS[key];
  const publishedOf = (k: string) => (saved[k] ?? COLLECTIONS[k].defaults) as Item[];
  const items = drafts[key] ?? publishedOf(key);

  const dirtyKeys = useMemo(
    () => KEYS.filter((k) => drafts[k] && (resets[k] || JSON.stringify(drafts[k]) !== JSON.stringify(saved[k] ?? COLLECTIONS[k].defaults))),
    [drafts, resets, saved]
  );
  const patch = useMemo(() => ({ collections: Object.fromEntries(Object.entries(drafts)) }), [drafts]);

  useEffect(() => {
    if (!dirtyKeys.length) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirtyKeys.length]);

  const setItems = (next: Item[]) => setDrafts((d) => ({ ...d, [key]: next }));
  const setItem = (i: number, item: Item) => setItems(items.map((x, j) => (j === i ? item : x)));

  const save = async () => {
    setBusy(true);
    setMsg(null);
    try {
      await saveCms({ collections: Object.fromEntries(dirtyKeys.map((k) => [k, resets[k] && JSON.stringify(drafts[k]) === JSON.stringify(COLLECTIONS[k].defaults) ? null : drafts[k]])) });
      setMsg({ ok: `Published ${dirtyKeys.length} list${dirtyKeys.length === 1 ? "" : "s"}.` });
      router.refresh();
      setDrafts({});
      setResets({});
    } catch (err) {
      setMsg({ error: err instanceof Error ? err.message : String(err) });
    } finally {
      setBusy(false);
    }
  };

  const discard = () => {
    if (!confirm("Discard all unsaved list changes?")) return;
    setDrafts({});
    setResets({});
  };

  const restoreDefaults = () => {
    if (!confirm(`Replace “${def.label}” with the original list from the website code? (You can still discard before publishing.)`)) return;
    setItems(def.defaults as Item[]);
    setResets((r) => ({ ...r, [key]: true }));
    setOpen(null);
  };

  const titleOf = (item: Item, i: number) => String(item[def.titleField] ?? "").trim() || `${def.itemLabel[0].toUpperCase()}${def.itemLabel.slice(1)} ${i + 1}`;
  const q = query.trim().toLowerCase();
  const visible = items.map((item, i) => ({ item, i })).filter(({ item }) => !q || JSON.stringify(item).toLowerCase().includes(q));

  return (
    <div className="mx-auto max-w-[1700px] px-3 py-4 sm:px-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="mr-auto">
          <h1 className="font-heading text-xl font-bold text-brand-primary">Lists</h1>
          <p className="text-sm text-slate-500">Committees, advisory boards, team and research tracks. Add, remove, reorder and edit entries; the preview shows your unsaved changes.</p>
        </div>
        <select
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
            setOpen(null);
            setQuery("");
          }}
          className="max-w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
          aria-label="List to edit"
        >
          {GROUPS.map((g) => (
            <optgroup key={g} label={g}>
              {KEYS.filter((k) => COLLECTIONS[k].group === g).map((k) => (
                <option key={k} value={k}>
                  {COLLECTIONS[k].label}
                  {dirtyKeys.includes(k) ? " •" : ""}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <button type="button" onClick={discard} disabled={!dirtyKeys.length || busy} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-600 disabled:opacity-40">
          Discard
        </button>
        <button type="button" onClick={save} disabled={!dirtyKeys.length || busy} className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-40">
          {busy ? "Publishing…" : dirtyKeys.length ? `Publish ${dirtyKeys.length} list${dirtyKeys.length === 1 ? "" : "s"}` : "No changes"}
        </button>
      </div>
      {msg && (
        <div className={`mb-3 rounded-lg px-3 py-2 text-sm ${msg.error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`} role="status">
          {msg.error ?? msg.ok}
        </div>
      )}

      <div className="grid gap-4 lg:h-[calc(100dvh-14rem)] lg:min-h-[560px] lg:grid-cols-[minmax(360px,500px)_1fr]">
        <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-3">
            <p className="text-sm font-bold text-brand-primary">{def.label}</p>
            <p className="text-xs text-slate-500">
              {def.description} {saved[key] ? "" : "(Showing the original list — not edited yet.)"}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${items.length} ${def.itemLabel}s`} className={`${inputCls} pl-8`} />
              </div>
              <button
                type="button"
                onClick={() => {
                  setItems([...items, blank(def.fields)]);
                  setOpen(items.length);
                  setQuery("");
                }}
                className="inline-flex items-center gap-1 rounded-lg bg-brand-primary px-3 py-1.5 text-sm font-semibold text-white"
              >
                <Plus size={15} /> Add {def.itemLabel}
              </button>
              <button type="button" onClick={restoreDefaults} className={iconBtn} title="Restore the original list">
                <RotateCcw size={15} />
              </button>
            </div>
          </div>
          <div className="max-h-[70vh] min-h-0 flex-1 space-y-1.5 overflow-y-auto p-3 lg:max-h-none">
            {visible.length === 0 && <p className="p-4 text-center text-sm text-slate-500">{q ? "Nothing matches." : `No ${def.itemLabel}s yet.`}</p>}
            {visible.map(({ item, i }) => {
              const isOpen = open === i;
              return (
                <div key={i} className={`rounded-lg border ${isOpen ? "border-brand-primary/40 shadow-sm" : "border-slate-200"}`}>
                  <div className="flex items-center gap-1 px-1.5 py-1">
                    <button type="button" onClick={() => setOpen(isOpen ? null : i)} className="flex min-w-0 flex-1 items-center gap-1.5 rounded px-1 py-1 text-left">
                      {isOpen ? <ChevronDown size={15} className="shrink-0 text-slate-400" /> : <ChevronRight size={15} className="shrink-0 text-slate-400" />}
                      <span className="w-6 shrink-0 text-xs tabular-nums text-slate-400">{i + 1}</span>
                      <span className="truncate text-sm font-semibold text-slate-800">{titleOf(item, i)}</span>
                      {Array.isArray(item.members) && <span className="shrink-0 text-xs text-slate-400">· {(item.members as unknown[]).length}</span>}
                    </button>
                    <button type="button" className={iconBtn} disabled={i === 0} onClick={() => (setItems(move(items, i, i - 1)), setOpen(open === i ? i - 1 : open))} title="Move up">
                      <ArrowUp size={14} />
                    </button>
                    <button type="button" className={iconBtn} disabled={i === items.length - 1} onClick={() => (setItems(move(items, i, i + 1)), setOpen(open === i ? i + 1 : open))} title="Move down">
                      <ArrowDown size={14} />
                    </button>
                    <button type="button" className={iconBtn} onClick={() => (setItems([...items.slice(0, i + 1), structuredClone(item), ...items.slice(i + 1)]), setOpen(i + 1))} title="Duplicate">
                      <Copy size={14} />
                    </button>
                    <button
                      type="button"
                      className={`${iconBtn} hover:!text-red-600`}
                      onClick={() => {
                        if (!confirm(`Remove “${titleOf(item, i)}”?`)) return;
                        setItems(items.filter((_, j) => j !== i));
                        setOpen(null);
                      }}
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {isOpen && (
                    <div className="space-y-2.5 border-t border-slate-100 p-3">
                      {def.fields.map((f) => (
                        <FieldInput key={f.key} field={f} value={item[f.key]} onChange={(v) => setItem(i, { ...item, [f.key]: v })} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="h-[75vh] min-h-0 lg:h-auto">
          <PreviewFrame path={def.page} patch={patch} note="Preview of your unsaved list changes. Nothing is live until you publish." />
        </div>
      </div>
    </div>
  );
}

function FieldInput({ field: f, value, onChange }: { field: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  const label = (
    <span className="mb-1 block text-xs font-semibold text-slate-600">
      {f.label}
      {f.required && <span className="text-red-500"> *</span>}
    </span>
  );
  const str = value == null ? "" : String(value);

  if (f.type === "list") return <NestedList field={f} items={(Array.isArray(value) ? value : []) as Item[]} onChange={onChange} />;
  if (f.type === "lines") {
    const lines = Array.isArray(value) ? (value as string[]) : [];
    return (
      <label className="block">
        {label}
        <textarea value={lines.join("\n")} rows={Math.min(14, lines.length + 2)} onChange={(e) => onChange(e.target.value.split("\n"))} className={inputCls} />
        <span className="text-[11px] text-slate-400">{lines.filter((l) => l.trim()).length} entries</span>
      </label>
    );
  }
  if (f.type === "textarea")
    return (
      <label className="block">
        {label}
        <textarea value={str} rows={4} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      </label>
    );
  if (f.type === "select")
    return (
      <label className="block">
        {label}
        <select value={str} onChange={(e) => onChange(e.target.value)} className={inputCls}>
          <option value="">—</option>
          {f.options?.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>
    );
  if (f.type === "image")
    return (
      <div>
        {label}
        <div className="flex items-center gap-2">
          {str ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={str} alt="" className="h-12 w-12 shrink-0 rounded-md border border-slate-200 bg-slate-50 object-cover" />
          ) : (
            <span className="h-12 w-12 shrink-0 rounded-md border border-dashed border-slate-300" />
          )}
          <input value={str} onChange={(e) => onChange(e.target.value)} placeholder="/images/… or upload" className={inputCls} />
          <button
            type="button"
            onClick={async () => {
              try {
                const url = await pickAndUploadImage();
                if (url) onChange(url);
              } catch (err) {
                alert(err instanceof Error ? err.message : String(err));
              }
            }}
            className="inline-flex shrink-0 items-center gap-1 rounded-md bg-slate-100 px-2 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
          >
            <ImageUp size={14} /> Upload
          </button>
        </div>
      </div>
    );
  return (
    <label className="block">
      {label}
      <input type={f.type === "url" ? "url" : "text"} value={str} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </label>
  );
}

// Sub-items (e.g. members of a committee) as compact rows.
function NestedList({ field: f, items, onChange }: { field: FieldDef; items: Item[]; onChange: (v: Item[]) => void }) {
  const fields = f.fields ?? [];
  const set = (i: number, k: string, v: string) => onChange(items.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  return (
    <div>
      <span className="mb-1 block text-xs font-semibold text-slate-600">
        {f.label} ({items.length})
      </span>
      <div className="space-y-1.5">
        {items.map((it, i) => (
          <div key={i} className="flex items-start gap-1 rounded-md bg-slate-50 p-1.5">
            <div className="grid min-w-0 flex-1 gap-1 sm:grid-cols-2">
              {fields.map((sf) => (
                <input key={sf.key} value={String(it[sf.key] ?? "")} placeholder={sf.label} onChange={(e) => set(i, sf.key, e.target.value)} className={`${inputCls} !py-1 !text-xs`} aria-label={sf.label} />
              ))}
            </div>
            <button type="button" className={iconBtn} disabled={i === 0} onClick={() => onChange(move(items, i, i - 1))} title="Move up">
              <ArrowUp size={13} />
            </button>
            <button type="button" className={iconBtn} disabled={i === items.length - 1} onClick={() => onChange(move(items, i, i + 1))} title="Move down">
              <ArrowDown size={13} />
            </button>
            <button type="button" className={`${iconBtn} hover:!text-red-600`} onClick={() => onChange(items.filter((_, j) => j !== i))} title="Remove">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, blank(fields)])} className="mt-1.5 inline-flex items-center gap-1 rounded-md border border-dashed border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:border-brand-primary hover:text-brand-primary">
        <Plus size={13} /> Add {f.itemLabel ?? "item"}
      </button>
    </div>
  );
}
