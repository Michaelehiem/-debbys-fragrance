import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

// Route handler instead of the app/manifest.ts convention — see robots.txt/route.ts.
export function GET() {
  const manifest = {
    name: `${siteConfig.businessName} — ${siteConfig.tagline}`,
    short_name: siteConfig.businessName,
    description: siteConfig.seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f6f1e8",
    theme_color: "#1b1712",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };

  return NextResponse.json(manifest, {
    headers: { "Content-Type": "application/manifest+json" },
  });
}
