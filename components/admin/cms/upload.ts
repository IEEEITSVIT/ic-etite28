"use client";

const MAX_B64 = 1_850_000;

// Re-encodes the chosen image (max 2400px) so it fits the media store.
async function toUpload(file: File) {
  const url = URL.createObjectURL(file);
  const img = new window.Image();
  try {
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error("Could not read that image."));
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
  const scale = Math.min(1, 2400 / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
  const png = file.type === "image/png" || file.type === "image/svg+xml";
  let mime = png ? "image/png" : "image/jpeg";
  let b64 = canvas.toDataURL(mime, 0.86).split(",")[1];
  for (const q of [0.8, 0.7, 0.6]) {
    if (b64.length <= MAX_B64) break;
    mime = "image/jpeg";
    b64 = canvas.toDataURL(mime, q).split(",")[1];
  }
  if (b64.length > MAX_B64) throw new Error("Image is too large; choose a smaller one.");
  return { data_b64: b64, mime, width: canvas.width, height: canvas.height };
}

// Asks for an image file, uploads it to the media store and returns its URL (null if cancelled).
export function pickAndUploadImage(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return resolve(null);
      try {
        const res = await fetch("/api/admin/media", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(await toUpload(file)),
        });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed");
        resolve(data.url);
      } catch (err) {
        reject(err);
      }
    };
    input.click();
  });
}

// Publishes CMS edits: { texts?, images?, collections? } (null values restore the original).
export async function saveCms(body: Record<string, unknown>) {
  const res = await fetch("/api/admin/cms", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(data.error ?? `Save failed (${res.status})`);
}
