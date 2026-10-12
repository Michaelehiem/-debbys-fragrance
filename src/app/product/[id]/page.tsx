import type { Metadata } from "next";
import { INITIAL_PRODUCTS } from "@/data/products";
import { siteConfig } from "@/config/site";
import { SITE } from "@/lib/site";
import ProductDetailPage from "./ProductDetail";

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const product = INITIAL_PRODUCTS.find((p) => p.id === params.id);

  if (!product) {
    return { title: "Fragrance" };
  }

  const description = `${product.tagline} — ${product.description}`.slice(0, 160);
  const image = product.images[0];
  const title = `${product.name} — ${product.brand}`;

  return {
    title,
    description,
    alternates: { canonical: `/product/${product.id}` },
    openGraph: {
      title: `${product.name} | ${SITE.name}`,
      description,
      url: `/product/${product.id}`,
      siteName: siteConfig.businessName,
      type: "website",
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ${SITE.name}`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default function Page() {
  return <ProductDetailPage />;
}
