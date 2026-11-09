import { randomBytes, createHash } from "node:crypto";

export const newId = () => randomBytes(12).toString("base64url");

export const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

// Team codes avoid look-alike characters (0/O, 1/I/L).
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export function newCode(length = 6): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  return out;
}

export function newNumericCode(length = 6): string {
  const n = randomBytes(4).readUInt32BE(0) % 10 ** length;
  return n.toString().padStart(length, "0");
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}
