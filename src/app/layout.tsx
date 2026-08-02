import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AdminProvider } from "@/context/AdminContext";
import { ReviewProvider } from "@/context/ReviewContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { BackToTop } from "@/components/ui/BackToTop";
import { CartToast } from "@/components/ui/CartToast";
import { siteConfig } from "@/config/site";

const playfair = localFont({
  src: [
    { path: "../../public/fonts/PlayfairDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/PlayfairDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-playfair",
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
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  keywords: siteConfig.seo.keywords,
  openGraph: {
    title: "Debby's Fragrance | Discover Your Signature Scent",
    description: "Authentic luxury perfumes, body oils, and bespoke signature fragrances delivered nationwide across Nigeria.",
    siteName: "Debby's Fragrance",
    locale: "en_NG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('debby_theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            })();
          `,
        }} />
      </head>
      <body className="bg-white text-zinc-900 font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-gold-500 selection:text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100">
        <AdminProvider>
          <ThemeProvider>
            <CartProvider>
              <WishlistProvider>
                <ReviewProvider>
                  <Navbar />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <CartDrawer />
                  <CartToast />
                  <BackToTop />
                </ReviewProvider>
              </WishlistProvider>
            </CartProvider>
          </ThemeProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
