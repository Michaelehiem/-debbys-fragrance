import { siteConfig } from "@/config/site";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://debbys-fragrance.vercel.app"
).replace(/\/+$/, "");

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const SITE = {
  url: SITE_URL,
  name: siteConfig.businessName,
  tagline: siteConfig.tagline,
  description: siteConfig.seo.description,
  locale: "en_NG",
  email: siteConfig.contact.email,
  phone: siteConfig.contact.phone,
  city: siteConfig.location.city,
  country: siteConfig.location.country,
  sameAs: [
    siteConfig.socials.instagram,
    siteConfig.socials.facebook,
    siteConfig.socials.tiktok,
    siteConfig.socials.twitter,
  ].filter(Boolean),
} as const;
