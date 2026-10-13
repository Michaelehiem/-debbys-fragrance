import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AdminProvider } from "@/context/AdminContext";
import { ReviewProvider } from "@/context/ReviewContext";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { BackToTop } from "@/components/ui/BackToTop";
import { CartToast } from "@/components/ui/CartToast";
import { SupportChat } from "@/components/ui/SupportChat";
import { JsonLd } from "@/components/ui/JsonLd";
import { siteConfig } from "@/config/site";
import { SITE, SITE_URL } from "@/lib/site";

const playfair = localFont({
  src: [
    { path: "../../public/fonts/PlayfairDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/PlayfairDisplay-Italic.woff2", weight: "400", style: "italic" },
    { path: "../../public/fonts/PlayfairDisplay-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/PlayfairDisplay-Italic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-playfair",
  display: "swap",
});

const greatVibes = localFont({
  src: [{ path: "../../public/fonts/GreatVibes-Regular.woff2", weight: "400", style: "normal" }],
  variable: "--font-script",
  display: "swap",
});

const inter = localFont({
  src: [
    { path: "../../public/fonts/Inter-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Inter-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/Inter-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteConfig.seo.title,
    template: `%s | ${siteConfig.businessName}`,
  },
  description: siteConfig.seo.description,
  keywords: siteConfig.seo.keywords,
  applicationName: siteConfig.businessName,
  authors: [{ name: siteConfig.businessName }],
  creator: siteConfig.businessName,
  publisher: siteConfig.businessName,
  alternates: { canonical: "/" },
  openGraph: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    url: "/",
    siteName: siteConfig.businessName,
    locale: "en_NG",
    type: "website",
    images: [{ url: "/og", width: 1200, height: 630, alt: siteConfig.businessName }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: ["/og"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#2e2126",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    slogan: SITE.tagline,
    email: SITE.email,
    telephone: SITE.phone,
    sameAs: SITE.sameAs,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressCountry: "NG",
    },
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
  };

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${greatVibes.variable}`}>
      <body className="bg-paper text-ink font-sans antialiased min-h-screen flex flex-col justify-between">
        <JsonLd data={[organizationLd, websiteLd]} />
        <CustomerAuthProvider>
          <AdminProvider>
            <CartProvider>
              <ReviewProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <CartDrawer />
                <CartToast />
                <BackToTop />
                <SupportChat />
              </ReviewProvider>
            </CartProvider>
          </AdminProvider>
        </CustomerAuthProvider>
      </body>
    </html>
  );
}
