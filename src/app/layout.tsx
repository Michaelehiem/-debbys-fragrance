import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AdminProvider } from "@/context/AdminContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { BackToTop } from "@/components/ui/BackToTop";

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
  title: "Debby's Fragrance | Discover Your Signature Scent in Nigeria",
  description: "Debby's Fragrance is Nigeria's premier luxury perfume boutique offering authentic designer perfumes, oud oils, and artisanal fragrances. Located in Abuja, delivering nationwide.",
  keywords: ["Perfumes in Nigeria", "Fragrance shop Abuja", "Debby's Fragrance", "Buy Perfumes online Nigeria", "Luxury fragrances", "Designer perfumes"],
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
    <html lang="en" className={`${playfair.variable} ${inter.variable} dark`}>
      <body className="bg-zinc-950 text-zinc-100 font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-gold-500 selection:text-zinc-950">
        <AdminProvider>
          <ThemeProvider>
            <CartProvider>
              <WishlistProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <CartDrawer />
                <BackToTop />
              </WishlistProvider>
            </CartProvider>
          </ThemeProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
