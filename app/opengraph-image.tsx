import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "ic-ETITE'28 — Third International Conference on Emerging Trends in Information Technology and Engineering, VIT Vellore";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logos/ic-etite28-cropped-transparent.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(135deg, #001733 0%, #002147 55%, #0D2E5C 100%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={617} height={119} alt="" style={{ marginBottom: 40 }} />
        <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.2, maxWidth: 1000 }}>
          Third International Conference on Emerging Trends in Information Technology and Engineering
        </div>
        <div style={{ display: "flex", marginTop: 36, fontSize: 32, fontWeight: 700, color: "#FFB81C" }}>
          10–11 February 2028 · VIT Vellore, India
        </div>
        <div style={{ display: "flex", marginTop: 14, fontSize: 24, color: "rgba(255,255,255,0.8)" }}>
          Technically co-sponsored by IEEE
        </div>
      </div>
    ),
    size
  );
}
