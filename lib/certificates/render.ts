import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib";

// Isomorphic certificate renderer (server routes and the admin's browser both use it).
// Certificates are generated on demand and never stored.

export type CertFieldKey = "name" | "team" | "event" | "rank" | "date" | "institution" | "custom";
export type CertFont = "Helvetica" | "Helvetica-Bold" | "Times-Roman" | "Times-Bold" | "Times-Italic" | "Courier";

export interface CertField {
  key: CertFieldKey;
  label: string;
  enabled: boolean;
  text?: string; // custom fields; may contain {{name}} style placeholders
  x: number; // 0–1 across the page
  y: number; // 0–1 down the page (text baseline)
  size: number; // points on an 842pt-wide page
  color: string; // #RRGGBB
  align: "left" | "center" | "right";
  font: CertFont;
}

export interface CertLayout {
  fields: CertField[];
}

export type CertValues = Partial<Record<Exclude<CertFieldKey, "custom">, string>>;

export const PAGE_WIDTH = 842;

export const DEFAULT_LAYOUT: CertLayout = {
  fields: [
    { key: "name", label: "Participant name", enabled: true, x: 0.5, y: 0.5, size: 34, color: "#0D2E5C", align: "center", font: "Times-Bold" },
    { key: "team", label: "Team / organisation", enabled: true, x: 0.5, y: 0.58, size: 16, color: "#334155", align: "center", font: "Helvetica" },
    { key: "event", label: "Event", enabled: false, x: 0.5, y: 0.64, size: 16, color: "#334155", align: "center", font: "Helvetica-Bold" },
    { key: "rank", label: "Position (winners)", enabled: true, x: 0.5, y: 0.42, size: 22, color: "#B45309", align: "center", font: "Helvetica-Bold" },
    { key: "institution", label: "Institution", enabled: false, x: 0.5, y: 0.62, size: 14, color: "#334155", align: "center", font: "Helvetica" },
    { key: "date", label: "Date", enabled: false, x: 0.2, y: 0.86, size: 12, color: "#334155", align: "center", font: "Helvetica" },
  ],
};

const FONT_MAP: Record<CertFont, StandardFonts> = {
  Helvetica: StandardFonts.Helvetica,
  "Helvetica-Bold": StandardFonts.HelveticaBold,
  "Times-Roman": StandardFonts.TimesRoman,
  "Times-Bold": StandardFonts.TimesRomanBold,
  "Times-Italic": StandardFonts.TimesRomanItalic,
  Courier: StandardFonts.Courier,
};

// Standard PDF fonts only cover WinAnsi; fold accents and drop anything else.
export function toWinAnsi(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, "")
    .trim();
}

function hexToRgb(hex: string) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  const n = m ? parseInt(m[1], 16) : 0;
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

export function fieldText(field: CertField, values: CertValues): string {
  if (field.key === "custom") {
    return (field.text ?? "").replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k: string) => values[k as keyof CertValues] ?? "");
  }
  return values[field.key] ?? "";
}

export interface TemplateImage {
  bytes: Uint8Array;
  mime: string;
  width: number;
  height: number;
}

export const pageSizeFor = (t: { width: number; height: number }) => ({
  width: PAGE_WIDTH,
  height: Math.round((PAGE_WIDTH * t.height) / t.width),
});

export async function embedTemplate(doc: PDFDocument, template: TemplateImage): Promise<PDFImage> {
  return template.mime === "image/png" ? doc.embedPng(template.bytes) : doc.embedJpg(template.bytes);
}

// Draws one certificate page; the embedded image and fonts are reused across pages,
// so a multi-page PDF of 1,500 certificates stays small.
export async function addCertificatePage(
  doc: PDFDocument,
  image: PDFImage,
  template: { width: number; height: number },
  layout: CertLayout,
  values: CertValues,
  fontCache: Map<CertFont, PDFFont> = new Map()
): Promise<PDFPage> {
  const { width, height } = pageSizeFor(template);
  const page = doc.addPage([width, height]);
  page.drawImage(image, { x: 0, y: 0, width, height });

  for (const field of layout.fields) {
    if (!field.enabled) continue;
    const text = toWinAnsi(fieldText(field, values));
    if (!text) continue;
    let font = fontCache.get(field.font);
    if (!font) {
      font = await doc.embedFont(FONT_MAP[field.font] ?? StandardFonts.Helvetica);
      fontCache.set(field.font, font);
    }
    // Shrink long text so it stays within 90% of the page width.
    let size = field.size;
    while (size > 6 && font.widthOfTextAtSize(text, size) > width * 0.9) size -= 1;
    const textWidth = font.widthOfTextAtSize(text, size);
    const anchorX = field.x * width;
    const x = field.align === "center" ? anchorX - textWidth / 2 : field.align === "right" ? anchorX - textWidth : anchorX;
    const y = height - field.y * height;
    page.drawText(text, { x, y, size, font, color: hexToRgb(field.color) });
  }
  return page;
}

export async function renderCertificatePdf(template: TemplateImage, layout: CertLayout, values: CertValues): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`Certificate - ${values.name ?? ""}`);
  doc.setCreator("ic-ETITE'28");
  const image = await embedTemplate(doc, template);
  await addCertificatePage(doc, image, template, layout, values);
  return doc.save();
}

const RANK_NAMES = ["", "Winner", "First Runner-Up", "Second Runner-Up"];
export const rankLabel = (rank: number | null | undefined) => {
  if (!rank) return "";
  if (RANK_NAMES[rank]) return RANK_NAMES[rank];
  const suffix = rank % 10 === 1 && rank % 100 !== 11 ? "st" : rank % 10 === 2 && rank % 100 !== 12 ? "nd" : rank % 10 === 3 && rank % 100 !== 13 ? "rd" : "th";
  return `${rank}${suffix} Place`;
};

export const safeFilename = (s: string) => s.replace(/[^\w.-]+/g, "_").replace(/_+/g, "_").slice(0, 80);
