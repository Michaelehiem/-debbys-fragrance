import { NextResponse } from "next/server";
import { absoluteUrl } from "@/lib/site";
import { INITIAL_PRODUCTS } from "@/data/products";

type Entry = { loc: string; priority: string; freq: string };

// Route handler instead of the app/sitemap.ts convention — see robots.txt/route.ts.
export function GET() {
  const lastmod = new Date().toISOString();

  const entries: Entry[] = [
    { loc: absoluteUrl("/"), priority: "1.0", freq: "weekly" },
    { loc: absoluteUrl("/shop"), priority: "0.9", freq: "daily" },
    { loc: absoluteUrl("/about"), priority: "0.6", freq: "monthly" },
    { loc: absoluteUrl("/contact"), priority: "0.6", freq: "monthly" },
    ...INITIAL_PRODUCTS.map((product) => ({
      loc: absoluteUrl(`/product/${product.id}`),
      priority: "0.8",
      freq: "weekly",
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.freq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  return new NextResponse(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
