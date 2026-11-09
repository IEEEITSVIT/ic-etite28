"use client";

import Link from "next/link";
import { Bold, EyeOff, Minus, PencilLine, Plus, RotateCcw, X } from "lucide-react";
import { useCms } from "@/components/cms/CmsProvider";

// Floating toolbar for admins: turn page editing on/off and style the selected text.
export default function EditBar() {
  const { isAdmin, editing, setEditing, selected, texts, saveText, status } = useCms();
  if (!isAdmin) return null;

  if (!editing) {
    return (
      <button
        data-cms-toolbar
        type="button"
        onClick={() => setEditing(true)}
        className="fixed bottom-5 left-5 z-[90] inline-flex items-center gap-2 rounded-full bg-brand-primary px-4 py-2.5 text-sm font-bold text-brand-accent shadow-xl ring-2 ring-brand-accent/40 hover:bg-brand-primary-hover"
      >
        <PencilLine className="h-4 w-4" /> Edit page
      </button>
    );
  }

  const o = selected ? texts[selected.key] ?? {} : {};
  const update = (patch: Record<string, unknown>) => {
    if (!selected) return;
    const next = { ...o, ...patch, o: selected.original };
    for (const k of Object.keys(next)) if ((next as Record<string, unknown>)[k] === undefined) delete (next as Record<string, unknown>)[k];
    const empty = !next.t && !next.c && !next.s && !next.b && !next.h;
    void saveText(selected.key, empty ? null : next);
  };
  const size = o.s ?? 1;

  return (
    <div data-cms-toolbar className="fixed bottom-5 left-1/2 z-[90] w-[min(96vw,760px)] -translate-x-1/2 rounded-2xl bg-brand-primary p-3 text-white shadow-2xl ring-2 ring-brand-accent/50">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 flex items-center gap-1.5 text-sm font-bold text-brand-accent">
          <PencilLine className="h-4 w-4" /> Editing
        </span>
        {selected ? (
          <>
            <span className="max-w-[180px] truncate rounded bg-white/10 px-2 py-1 text-xs" title={selected.original}>
              “{selected.original}”
            </span>
            <button type="button" title="Smaller" onClick={() => update({ s: Math.max(0.5, Math.round((size - 0.1) * 10) / 10) })} className="rounded-lg bg-white/10 p-1.5 hover:bg-white/20">
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center text-xs">{Math.round(size * 100)}%</span>
            <button type="button" title="Larger" onClick={() => update({ s: Math.min(3, Math.round((size + 0.1) * 10) / 10) })} className="rounded-lg bg-white/10 p-1.5 hover:bg-white/20">
              <Plus className="h-4 w-4" />
            </button>
            <label className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-xs" title="Text colour">
              Colour
              <input type="color" value={o.c ?? "#000000"} onChange={(e) => update({ c: e.target.value })} className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent" />
            </label>
            <button type="button" title="Bold" onClick={() => update({ b: o.b ? undefined : true })} className={`rounded-lg p-1.5 ${o.b ? "bg-brand-accent text-brand-primary" : "bg-white/10 hover:bg-white/20"}`}>
              <Bold className="h-4 w-4" />
            </button>
            <button type="button" title={o.h ? "Show" : "Hide on the website"} onClick={() => update({ h: o.h ? undefined : true })} className={`rounded-lg p-1.5 ${o.h ? "bg-red-500" : "bg-white/10 hover:bg-white/20"}`}>
              <EyeOff className="h-4 w-4" />
            </button>
            <button type="button" title="Restore original text and style" onClick={() => void saveText(selected.key, null)} className="rounded-lg bg-white/10 p-1.5 hover:bg-white/20">
              <RotateCcw className="h-4 w-4" />
            </button>
          </>
        ) : (
          <span className="text-xs text-white/80">Click any text to edit it (Enter to save, Esc to cancel). Click any image to replace it.</span>
        )}
        <span className="ml-auto text-xs text-brand-accent">{status}</span>
        <Link href="/admin/content" className="rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-semibold hover:bg-white/20">
          All edits
        </Link>
        <button type="button" onClick={() => setEditing(false)} className="inline-flex items-center gap-1 rounded-lg bg-brand-accent px-3 py-1.5 text-xs font-bold text-brand-primary">
          <X className="h-3.5 w-3.5" /> Done
        </button>
      </div>
    </div>
  );
}
