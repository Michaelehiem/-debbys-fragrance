import { NextResponse } from "next/server";
import { absoluteUrl } from "@/lib/site";

// Served as a route handler rather than the app/robots.ts convention: Next's
// metadata-route loader mis-generates code when the project path contains an
// apostrophe (as "Debby's Fragrance" does).
export function GET() {
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /cart",
    "Disallow: /checkout",
    "Disallow: /order",
    "",
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    "",
  ].join("\n");

  return new NextResponse(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
