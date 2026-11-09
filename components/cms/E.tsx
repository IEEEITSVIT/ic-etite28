"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";
import { textKey, type TextOverride } from "@/lib/cms";
import { useCms } from "@/components/cms/CmsProvider";

const styleOf = (o?: TextOverride): CSSProperties | undefined =>
  o && (o.c || o.s || o.b) ? { color: o.c, fontSize: o.s ? `${o.s}em` : undefined, fontWeight: o.b ? 700 : undefined } : undefined;

// CMS-managed text (inserted by scripts/cms-codemod.mjs). Shows the original text unless an
// admin has published a change in Admin → Page content.
export default function E({ f, children }: { f: string; children?: ReactNode }) {
  const { texts, preview, focusKey, register } = useCms();
  const isText = typeof children === "string" || typeof children === "number";
  const original = isText ? String(children) : "";
  const key = original.trim() ? textKey(f, original) : "";

  useEffect(() => (preview && key ? register("text", key, original) : undefined), [preview, key, original, register]);

  if (!isText || !key) return <>{children}</>;
  const o = texts[key];
  const text = o?.t ?? original;

  if (!preview) {
    if (o?.h) return null;
    const style = styleOf(o);
    return style ? <span style={style}>{text}</span> : <>{text}</>;
  }

  // Admin preview: every text is selectable; hidden ones stay visible but faded.
  const focused = focusKey === key;
  return (
    <span
      data-cms-key={key}
      style={{
        ...styleOf(o),
        cursor: "pointer",
        outline: focused ? "2px solid #FFB81C" : undefined,
        outlineOffset: 2,
        borderRadius: 2,
        opacity: o?.h ? 0.35 : undefined,
        textDecoration: o?.h ? "line-through" : undefined,
      }}
    >
      {text}
    </span>
  );
}
