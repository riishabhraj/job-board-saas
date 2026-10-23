import { ImageResponse } from "next/og";

export const alt = "jobboard — Tech jobs, straight from the source";
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
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 36, fontWeight: 700 }}>
          <div style={{ width: 16, height: 16, borderRadius: 8, background: "#7c9cff" }} />
          jobboard
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            Every listing, straight from the source.
          </div>
          <div style={{ fontSize: 34, color: "#9fa0a6" }}>
            Tech jobs from company career boards — with clear location,
            experience and freshness.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
