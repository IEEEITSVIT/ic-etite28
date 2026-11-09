// Inline CMS shared by server and client: text overrides keyed by file + hash of the
// original text, so keys survive code moves and identical texts in a file edit together.

export interface TextOverride {
  t?: string; // replacement text
  c?: string; // colour (#RRGGBB)
  s?: number; // size multiplier (1 = original)
  b?: boolean; // bold
  h?: boolean; // hidden
  o?: string; // original text, kept for the admin edit list
}

export type TextOverrides = Record<string, TextOverride>;
export type ImageOverrides = Record<string, string>; // original src → replacement URL

// FNV-1a, base36 — short and stable.
export function hashText(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

export const textKey = (file: string, text: string) => `${file}:${hashText(text)}`;
