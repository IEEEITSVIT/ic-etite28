"use client";

import { useState } from "react";
import { saveAppearanceAction } from "@/app/actions/admin-settings";
import SubmitButton from "@/components/portal/SubmitButton";
import { btnSecondary, inputCls, labelCls } from "@/components/portal/ui";

interface Props {
  colors: Record<string, string>;
  meta: Record<string, { label: string; hint: string; value: string }>;
  fonts: Record<string, { label: string; cssVar: string; kind: string }>;
  bodyFont: string;
  headingFont: string;
  fontScale: number;
}

// Theme editor with a live preview; saving applies it to every page.
export default function AppearanceEditor({ colors: initial, meta, fonts, bodyFont: b, headingFont: h, fontScale: fs }: Props) {
  const [colors, setColors] = useState(initial);
  const [bodyFont, setBodyFont] = useState(b);
  const [headingFont, setHeadingFont] = useState(h);
  const [fontScale, setFontScale] = useState(fs);
  const fam = (k: string) => `var(${fonts[k]?.cssVar ?? "--font-inter"})`;

  return (
    <form id="appearance" action={saveAppearanceAction} className="scroll-mt-28 space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {Object.entries(meta).map(([key, m]) => (
          <label key={key} className="rounded-xl border border-slate-200 p-3">
            <span className="block text-sm font-semibold text-slate-800">{m.label}</span>
            <span className="block text-xs text-slate-500">{m.hint}</span>
            <span className="mt-2 flex items-center gap-2">
              <input type="color" value={colors[key]} onChange={(e) => setColors({ ...colors, [key]: e.target.value.toUpperCase() })} className="h-9 w-12 cursor-pointer rounded border border-slate-300" />
              <input
                name={`color_${key}`}
                value={colors[key]}
                onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                pattern="#[0-9A-Fa-f]{6}"
                className={`${inputCls} !py-1.5 !text-xs font-mono`}
              />
            </span>
          </label>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label>
          <span className={labelCls}>Heading font</span>
          <select name="headingFont" value={headingFont} onChange={(e) => setHeadingFont(e.target.value)} className={inputCls}>
            {Object.entries(fonts).map(([k, f]) => (
              <option key={k} value={k}>
                {f.label} ({f.kind})
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className={labelCls}>Body font</span>
          <select name="bodyFont" value={bodyFont} onChange={(e) => setBodyFont(e.target.value)} className={inputCls}>
            {Object.entries(fonts).map(([k, f]) => (
              <option key={k} value={k}>
                {f.label} ({f.kind})
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className={labelCls}>Text size: {Math.round(fontScale * 100)}%</span>
          <input name="fontScale" type="range" min={0.85} max={1.25} step={0.01} value={fontScale} onChange={(e) => setFontScale(Number(e.target.value))} className="mt-3 w-full accent-[#002147]" />
        </label>
      </div>

      {/* Live preview */}
      <div className="overflow-hidden rounded-2xl border border-slate-200" style={{ fontSize: `${fontScale}em` }}>
        <div className="flex items-center justify-between px-5 py-3" style={{ background: colors.primary, color: "#fff" }}>
          <span style={{ fontFamily: fam(headingFont), fontWeight: 800 }}>ic-ETITE&apos;28</span>
          <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: colors.accent, color: colors.primary, fontFamily: fam(bodyFont) }}>
            Register
          </span>
        </div>
        <div className="space-y-2 p-5" style={{ background: colors.surface, borderTop: `3px solid ${colors.accent}` }}>
          <div style={{ fontFamily: fam(headingFont), color: colors.primary, fontWeight: 800, fontSize: "1.6em" }}>Section heading preview</div>
          <p style={{ fontFamily: fam(bodyFont), color: colors.text }}>
            Body text preview — the conference will be held at VIT Vellore on 10–11 February 2028.{" "}
            <span style={{ color: colors.secondary, textDecoration: "underline" }}>A link</span>
          </p>
          <p style={{ fontFamily: fam(bodyFont), color: colors.muted, fontSize: "0.9em" }}>Muted text preview</p>
          <div className="rounded-xl p-3" style={{ border: `1px solid ${colors.border}`, background: "#fff" }}>
            <span style={{ background: colors.primaryDark, color: colors.accentDark }} className="rounded px-2 py-1 text-xs font-bold">
              Badge
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <SubmitButton pendingText="Applying…">Save appearance</SubmitButton>
        <SubmitButton className={btnSecondary} name="reset" value="1" confirm="Reset colours, fonts and text size to the original theme?">
          Reset to original
        </SubmitButton>
      </div>
    </form>
  );
}
