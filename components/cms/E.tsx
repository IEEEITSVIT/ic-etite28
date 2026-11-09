"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { textKey, type TextOverride } from "@/lib/cms";
import { useCms } from "@/components/cms/CmsProvider";

const styleOf = (o?: TextOverride): CSSProperties | undefined =>
  o && (o.c || o.s || o.b) ? { color: o.c, fontSize: o.s ? `${o.s}em` : undefined, fontWeight: o.b ? 700 : undefined } : undefined;

// Editable text. Inserted around page text by scripts/cms-codemod.mjs; renders exactly the
// original text unless an admin has saved an override for it.
export default function E({ f, children }: { f: string; children?: ReactNode }) {
  const { texts, editing, saveText, select, selected } = useCms();
  const ref = useRef<HTMLSpanElement>(null);
  if (typeof children !== "string" && typeof children !== "number") return <>{children}</>;
  const original = String(children);
  if (!original.trim()) return <>{original}</>;
  const key = textKey(f, original);
  const o = texts[key];
  const text = o?.t ?? original;

  if (!editing) {
    if (o?.h) return null;
    const style = styleOf(o);
    return style ? <span style={style}>{text}</span> : <>{text}</>;
  }

  const isSel = selected?.key === key;
  return (
    <span
      ref={ref}
      data-cms-key={key}
      contentEditable
      suppressContentEditableWarning
      spellCheck
      onFocus={() => select({ key, original })}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          ref.current?.blur();
        }
        if (e.key === "Escape" && ref.current) {
          ref.current.textContent = text;
          ref.current.blur();
        }
      }}
      onBlur={() => {
        const value = (ref.current?.textContent ?? "").replace(/\s+/g, " ");
        if (value === text) return;
        const next: TextOverride = { ...o, t: value === original ? undefined : value, o: original };
        const empty = !next.t && !next.c && !next.s && !next.b && !next.h;
        void saveText(key, empty ? null : next);
      }}
      style={{
        ...styleOf(o),
        outline: isSel ? "2px solid #FFB81C" : "1px dashed rgba(14,165,233,0.7)",
        outlineOffset: 2,
        borderRadius: 2,
        cursor: "text",
        opacity: o?.h ? 0.35 : undefined,
        textDecoration: o?.h ? "line-through" : undefined,
      }}
    >
      {text}
    </span>
  );
}
