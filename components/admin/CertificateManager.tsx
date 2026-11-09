"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Eye, FileArchive, Upload } from "lucide-react";
import { deleteCertificateTemplateAction, saveCertificateTemplateAction, setCertificateReleaseAction } from "@/app/actions/admin-comms";
import { DEFAULT_LAYOUT, PAGE_WIDTH, fieldText, type CertField, type CertLayout, type CertValues } from "@/lib/certificates/render";
import SubmitButton from "@/components/portal/SubmitButton";
import { Badge, btnDanger, btnGold, btnPrimary, btnSecondary, inputCls } from "@/components/portal/ui";

type Kind = "participation" | "winner";

export interface TemplateMeta {
  kind: Kind;
  width: number;
  height: number;
  mime: string;
  layout: CertLayout;
  released: number;
  updated_at: string;
}

const SAMPLE: CertValues = {
  name: "Aarav Krishnan",
  team: "Team Quantum Leap",
  event: "BOLT 3.0 Hackathon",
  rank: "Winner",
  institution: "Vellore Institute of Technology",
  date: "11 February 2028",
};

const MAX_B64 = 1_850_000;

// Reads an uploaded image; anything too large for D1 is re-encoded as JPEG.
async function readImage(file: File): Promise<{ b64: string; mime: string; width: number; height: number; url: string }> {
  const url = URL.createObjectURL(file);
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Could not read that image."));
    img.src = url;
  });
  let width = img.naturalWidth;
  let height = img.naturalHeight;
  const raw = new Uint8Array(await file.arrayBuffer());
  let mime = file.type;
  let b64 = btoa(Array.from(raw, (c) => String.fromCharCode(c)).join(""));
  if (b64.length > MAX_B64 || (mime !== "image/png" && mime !== "image/jpeg")) {
    const scale = Math.min(1, 2480 / Math.max(width, height));
    width = Math.round(width * scale);
    height = Math.round(height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    for (const q of [0.88, 0.8, 0.7, 0.6, 0.5]) {
      b64 = canvas.toDataURL("image/jpeg", q).split(",")[1];
      if (b64.length <= MAX_B64) break;
    }
    mime = "image/jpeg";
    if (b64.length > MAX_B64) throw new Error("Image is too large even after compression. Use a smaller image.");
  }
  return { b64, mime, width, height, url };
}

const b64ToBytes = (b64: string) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

function download(bytes: Uint8Array | Blob, filename: string, type = "application/pdf") {
  const blob = bytes instanceof Blob ? bytes : new Blob([bytes as BlobPart], { type });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

export default function CertificateManager({
  scope,
  back,
  kinds,
  templates,
  eligible,
}: {
  scope: string;
  back: string;
  kinds: Kind[];
  templates: TemplateMeta[];
  eligible: Record<Kind, number>;
}) {
  const [kind, setKind] = useState<Kind>(kinds[0]);
  const existing = templates.find((t) => t.kind === kind);
  const [layout, setLayout] = useState<CertLayout>(existing?.layout ?? DEFAULT_LAYOUT);
  const [upload, setUpload] = useState<{ b64: string; mime: string; width: number; height: number; url: string } | null>(null);
  const [selected, setSelected] = useState(0);
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = useState(800);

  useEffect(() => {
    setLayout(templates.find((t) => t.kind === kind)?.layout ?? DEFAULT_LAYOUT);
    setUpload(null);
    setSelected(0);
  }, [kind, templates]);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBoxWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [existing, upload]);

  const imageUrl = upload?.url ?? (existing ? `/api/admin/certificates/template?scope=${encodeURIComponent(scope)}&kind=${kind}&v=${encodeURIComponent(existing.updated_at)}` : null);
  const dims = upload ?? existing;
  const scale = boxWidth / PAGE_WIDTH;
  const field = layout.fields[selected];
  const values = { ...SAMPLE, rank: kind === "winner" ? SAMPLE.rank : "" };

  const update = (i: number, patch: Partial<CertField>) =>
    setLayout((l) => ({ fields: l.fields.map((f, j) => (j === i ? { ...f, ...patch } : f)) }));

  const startDrag = (i: number) => (e: React.PointerEvent) => {
    e.preventDefault();
    setSelected(i);
    const box = boxRef.current!.getBoundingClientRect();
    const move = (ev: PointerEvent) => {
      const x = Math.min(1, Math.max(0, (ev.clientX - box.left) / box.width));
      const y = Math.min(1, Math.max(0, (ev.clientY - box.top) / box.height));
      update(i, { x: Math.round(x * 1000) / 1000, y: Math.round(y * 1000) / 1000 });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  async function loadTemplateBytes() {
    if (upload) return { bytes: b64ToBytes(upload.b64), mime: upload.mime, width: upload.width, height: upload.height };
    const res = await fetch(imageUrl!);
    return { bytes: new Uint8Array(await res.arrayBuffer()), mime: existing!.mime, width: existing!.width, height: existing!.height };
  }

  async function preview() {
    setErr("");
    setBusy("preview");
    try {
      const { renderCertificatePdf } = await import("@/lib/certificates/render");
      const bytes = await renderCertificatePdf(await loadTemplateBytes(), layout, values);
      const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
      window.open(url, "_blank");
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy("");
    }
  }

  // Bulk export runs in the browser: one combined PDF (template embedded once), or a ZIP
  // of individual PDFs split into parts so memory stays bounded for 1,500 recipients.
  async function bulk(format: "pdf" | "zip") {
    setErr("");
    setBusy(format);
    try {
      const res = await fetch(`/api/admin/certificates/manifest?scope=${encodeURIComponent(scope)}&kind=${kind}`);
      const data = (await res.json()) as {
        error?: string;
        template: { b64: string; mime: string; width: number; height: number };
        layout: CertLayout;
        recipients: { values: CertValues }[];
      };
      if (!res.ok) throw new Error(data.error ?? "Could not load recipients.");
      if (data.recipients.length === 0) throw new Error("No eligible recipients yet.");
      const { PDFDocument } = await import("pdf-lib");
      const { addCertificatePage, embedTemplate, renderCertificatePdf, safeFilename } = await import("@/lib/certificates/render");
      const template = { bytes: b64ToBytes(data.template.b64), mime: data.template.mime, width: data.template.width, height: data.template.height };
      const label = safeFilename(`${scope.replace(":", "-")}-${kind}`);

      if (format === "pdf") {
        const doc = await PDFDocument.create();
        const image = await embedTemplate(doc, template);
        const fonts = new Map();
        for (let i = 0; i < data.recipients.length; i++) {
          await addCertificatePage(doc, image, template, data.layout, data.recipients[i].values, fonts);
          if (i % 50 === 0) setBusy(`pdf ${i}/${data.recipients.length}`);
        }
        download(await doc.save(), `${label}-all.pdf`);
      } else {
        const JSZip = (await import("jszip")).default;
        const PART = 250;
        const parts = Math.ceil(data.recipients.length / PART);
        for (let p = 0; p < parts; p++) {
          const zip = new JSZip();
          const slice = data.recipients.slice(p * PART, (p + 1) * PART);
          const names = new Map<string, number>();
          for (let i = 0; i < slice.length; i++) {
            const base = safeFilename(slice[i].values.name || `certificate-${p * PART + i + 1}`);
            const n = (names.get(base) ?? 0) + 1;
            names.set(base, n);
            zip.file(`${base}${n > 1 ? `-${n}` : ""}.pdf`, await renderCertificatePdf(template, data.layout, slice[i].values));
            if (i % 25 === 0) setBusy(`zip ${p * PART + i}/${data.recipients.length}`);
          }
          download(await zip.generateAsync({ type: "blob" }), `${label}${parts > 1 ? `-part${p + 1}of${parts}` : ""}.zip`, "application/zip");
        }
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {kinds.map((k) => {
          const t = templates.find((x) => x.kind === k);
          return (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${k === kind ? "bg-[#002147] text-white" : "border border-slate-300 bg-white text-slate-700"}`}
            >
              {k === "winner" ? "Winner" : "Participation"} {t ? (t.released ? "· released" : "· draft") : "· no template"}
            </button>
          );
        })}
        <span className="ml-auto text-sm text-slate-500">{eligible[kind] ?? 0} eligible recipient(s)</span>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
        <Upload className="h-5 w-5 text-slate-500" />
        <label className="text-sm text-slate-700">
          <span className="font-semibold">{existing ? "Replace template image" : "Upload template image"}</span> (PNG or JPEG, landscape A4 recommended — leave the name area blank)
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="mt-2 block text-sm"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setErr("");
              try {
                setUpload(await readImage(f));
              } catch (ex) {
                setErr(ex instanceof Error ? ex.message : String(ex));
              }
            }}
          />
        </label>
      </div>

      {err && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{err}</p>}

      {imageUrl && dims ? (
        <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
          <div>
            <div ref={boxRef} className="relative w-full select-none overflow-hidden rounded-xl border border-slate-200 shadow-sm" style={{ aspectRatio: `${dims.width} / ${dims.height}` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Certificate template" className="absolute inset-0 h-full w-full" draggable={false} />
              {layout.fields.map((f, i) =>
                f.enabled ? (
                  <div
                    key={i}
                    onPointerDown={startDrag(i)}
                    className={`absolute cursor-move whitespace-nowrap rounded px-0.5 leading-none ${i === selected ? "outline outline-2 outline-[#FFB81C]" : "outline outline-1 outline-dashed outline-sky-400/70"}`}
                    style={{
                      left: `${f.x * 100}%`,
                      top: `${f.y * 100}%`,
                      transform: `translate(${f.align === "center" ? "-50%" : f.align === "right" ? "-100%" : "0"}, -82%)`,
                      fontSize: `${f.size * scale}px`,
                      color: f.color,
                      fontFamily: f.font.startsWith("Times") ? "Times New Roman, serif" : f.font === "Courier" ? "Courier New, monospace" : "Helvetica, Arial, sans-serif",
                      fontWeight: f.font.endsWith("Bold") ? 700 : 400,
                      fontStyle: f.font.endsWith("Italic") ? "italic" : "normal",
                    }}
                  >
                    {fieldText(f, values) || f.label}
                  </div>
                ) : null
              )}
            </div>
            <p className="mt-2 text-xs text-slate-500">Drag the text onto the template. Sample text is shown; each recipient&apos;s own details are printed. Long names shrink automatically.</p>
          </div>

          <div className="space-y-3">
            <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
              {layout.fields.map((f, i) => (
                <div key={i} className={`rounded-xl border p-3 ${i === selected ? "border-[#FFB81C] bg-amber-50/40" : "border-slate-200"}`} onClick={() => setSelected(i)}>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <input type="checkbox" checked={f.enabled} onChange={(e) => update(i, { enabled: e.target.checked })} className="accent-[#002147]" />
                    {f.label}
                  </label>
                  {i === selected && f.enabled && (
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      {f.key === "custom" && (
                        <input value={f.text ?? ""} onChange={(e) => update(i, { text: e.target.value })} placeholder="Text, e.g. for securing {{rank}}" className={`${inputCls} col-span-2 !py-1.5 !text-xs`} />
                      )}
                      <label>
                        Size
                        <input type="number" min={6} max={120} value={f.size} onChange={(e) => update(i, { size: Number(e.target.value) || 12 })} className={`${inputCls} !py-1.5 !text-xs`} />
                      </label>
                      <label>
                        Colour
                        <input type="color" value={f.color} onChange={(e) => update(i, { color: e.target.value })} className="h-9 w-full rounded-lg border border-slate-300" />
                      </label>
                      <label>
                        Align
                        <select value={f.align} onChange={(e) => update(i, { align: e.target.value as CertField["align"] })} className={`${inputCls} !py-1.5 !text-xs`}>
                          <option value="left">Left</option>
                          <option value="center">Center</option>
                          <option value="right">Right</option>
                        </select>
                      </label>
                      <label>
                        Font
                        <select value={f.font} onChange={(e) => update(i, { font: e.target.value as CertField["font"] })} className={`${inputCls} !py-1.5 !text-xs`}>
                          {["Helvetica", "Helvetica-Bold", "Times-Roman", "Times-Bold", "Times-Italic", "Courier"].map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  )}
                </div>
              ))}
              <button
                type="button"
                className={btnSecondary}
                onClick={() => {
                  setLayout((l) => ({ fields: [...l.fields, { key: "custom", label: `Custom text ${l.fields.filter((f) => f.key === "custom").length + 1}`, enabled: true, text: "", x: 0.5, y: 0.7, size: 14, color: "#334155", align: "center", font: "Helvetica" }] }));
                  setSelected(layout.fields.length);
                }}
              >
                + Custom text
              </button>
            </div>

            <form action={saveCertificateTemplateAction} className="space-y-2 border-t border-slate-100 pt-3">
              <input type="hidden" name="scope" value={scope} />
              <input type="hidden" name="back" value={back} />
              <input type="hidden" name="kind" value={kind} />
              <input type="hidden" name="layout" value={JSON.stringify(layout)} />
              {upload && (
                <>
                  <input type="hidden" name="image_b64" value={upload.b64} />
                  <input type="hidden" name="mime" value={upload.mime} />
                  <input type="hidden" name="width" value={upload.width} />
                  <input type="hidden" name="height" value={upload.height} />
                </>
              )}
              <div className="flex flex-wrap gap-2">
                <SubmitButton pendingText="Saving…">Save template</SubmitButton>
                <button type="button" onClick={preview} disabled={!!busy} className={btnSecondary}>
                  <Eye className="h-4 w-4" /> {busy === "preview" ? "Rendering…" : "Preview PDF"}
                </button>
              </div>
              {upload && <p className="text-xs text-amber-700">New image not saved yet.</p>}
            </form>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500">Upload a template image to start designing.</p>
      )}

      {existing && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <Badge tone={existing.released ? "green" : "amber"}>{existing.released ? "Released to recipients" : "Not released"}</Badge>
          <form action={setCertificateReleaseAction}>
            <input type="hidden" name="scope" value={scope} />
            <input type="hidden" name="back" value={back} />
            <input type="hidden" name="kind" value={kind} />
            <input type="hidden" name="released" value={existing.released ? "0" : "1"} />
            <SubmitButton className={existing.released ? btnSecondary : btnGold}>{existing.released ? "Hide from recipients" : "Release to recipients"}</SubmitButton>
          </form>
          <button type="button" onClick={() => bulk("pdf")} disabled={!!busy} className={btnPrimary}>
            <Download className="h-4 w-4" /> {busy.startsWith("pdf") ? `Building ${busy.slice(4)}…` : "All as one PDF"}
          </button>
          <button type="button" onClick={() => bulk("zip")} disabled={!!busy} className={btnSecondary}>
            <FileArchive className="h-4 w-4" /> {busy.startsWith("zip") ? `Zipping ${busy.slice(4)}…` : "ZIP of individual PDFs"}
          </button>
          <form action={deleteCertificateTemplateAction} className="ml-auto">
            <input type="hidden" name="scope" value={scope} />
            <input type="hidden" name="back" value={back} />
            <input type="hidden" name="kind" value={kind} />
            <SubmitButton className={btnDanger} confirm="Delete this certificate template?">
              Delete template
            </SubmitButton>
          </form>
        </div>
      )}
    </div>
  );
}
