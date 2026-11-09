"use client";

import NextImage, { type ImageProps } from "next/image";
import { useCms } from "@/components/cms/CmsProvider";

const MAX_B64 = 1_850_000;

// Re-encodes the chosen image (max 2400px) so it fits the media store.
async function toUpload(file: File) {
  const url = URL.createObjectURL(file);
  const img = new window.Image();
  await new Promise<void>((res, rej) => {
    img.onload = () => res();
    img.onerror = () => rej(new Error("Could not read that image."));
    img.src = url;
  });
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

// next/image with admin-replaceable source (swapped in by scripts/cms-codemod.mjs).
export default function Image(props: ImageProps) {
  const { images, editing, saveImage } = useCms();
  const original = typeof props.src === "string" ? props.src : null;
  const override = original ? images[original] : undefined;
  const src = override ?? props.src;

  if (!editing || !original) return <NextImage {...props} src={src} />;

  return (
    <NextImage
      {...props}
      src={src}
      data-cms-img={original}
      title={override ? "Click to replace this image (Shift+click to restore the original)" : "Click to replace this image"}
      style={{ ...props.style, outline: "2px dashed rgba(14,165,233,0.85)", outlineOffset: -2, cursor: "copy" }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.shiftKey && override) {
          if (confirm("Restore the original image?")) void saveImage(original, null);
          return;
        }
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async () => {
          const file = input.files?.[0];
          if (!file) return;
          try {
            const res = await fetch("/api/admin/media", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(await toUpload(file)),
            });
            const data = (await res.json()) as { url?: string; error?: string };
            if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed");
            await saveImage(original, data.url);
          } catch (err) {
            alert(err instanceof Error ? err.message : String(err));
          }
        };
        input.click();
      }}
    />
  );
}
