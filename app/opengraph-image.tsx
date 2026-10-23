import { ImageResponse } from "next/og";

export const alt = "caniworkhere. — Real jobs. Clear answers.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0b0b0d",
          color: "#f2f2f4",
        }}
      >
        <div style={{ display: "flex", fontSize: 64, fontWeight: 800, letterSpacing: -2 }}>
          caniworkhere<span style={{ color: "#7c9cff" }}>.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            See where you can work from — before you apply.
          </div>
          <div style={{ fontSize: 34, color: "#9fa0a6" }}>
            Real jobs. Clear answers. Tech jobs straight from company career
            boards.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
