import { ImageResponse } from "next/og";

export const runtime = "edge";

// Route handler instead of the app/opengraph-image.tsx convention — the metadata
// image loader also breaks on the apostrophe in the project path.
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f6f1e8",
          color: "#1b1712",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 40,
            right: 40,
            bottom: 40,
            border: "1px solid #b28a49",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <div
            style={{
              fontSize: 24,
              letterSpacing: 10,
              textTransform: "uppercase",
              color: "#b28a49",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Artisanal Luxury Perfumery
          </div>
          <div style={{ fontSize: 96, fontFamily: "Georgia, serif", fontWeight: 700 }}>
            Debby&apos;s Fragrance
          </div>
          <div style={{ fontSize: 26, color: "#4a443b", fontFamily: "Arial, sans-serif" }}>
            Discover your signature scent · Nationwide delivery
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
