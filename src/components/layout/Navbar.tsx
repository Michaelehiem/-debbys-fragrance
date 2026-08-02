"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import {
  ShoppingBag,
  Sun,
  Moon,
  Search,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";
import { formatNaira } from "@/lib/utils";
import { siteConfig } from "@/config/site";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop All" },
  { href: "/shop?category=women", label: "Women" },
  { href: "/shop?category=men", label: "Men" },
  { href: "/shop?category=unisex", label: "Unisex" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export const Navbar: React.FC = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const { allProducts } = useAdmin();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartControls = useAnimation();
  const prevTotalItems = useRef(totalItems);

  useEffect(() => {
    if (totalItems > prevTotalItems.current) {
      cartControls.start({
        scale: [1, 1.3, 0.9, 1.1, 1],
        rotate: [0, -8, 8, -4, 0],
        transition: { duration: 0.5, ease: "easeInOut" },
      });
    }
    prevTotalItems.current = totalItems;
  }, [totalItems, cartControls]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    // Hidden admin access — typing the exact keyword reveals the admin login.
    // Any other query behaves as a normal product search.
    if (value.trim().toLowerCase() === siteConfig.adminAccessKeyword) {
      localStorage.setItem("debby_admin_access", "true");
      setSearchOpen(false);
      setSearchQuery("");
      router.push("/admin");
    }
  };

  const filteredSearch = searchQuery.trim()
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.fragranceFamily.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-100 text-zinc-900 transition-colors duration-300 dark:bg-zinc-950/95 dark:border-zinc-800 dark:text-zinc-100">
      {/* Announcement Bar */}
      <div className="bg-gold-500/10 text-gold-700 dark:text-gold-300 text-xs py-1.5 px-4 text-center font-medium tracking-wide">
        Free Delivery on orders over ₦350,000 · 100% Authentic Guaranteed
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-500 hover:text-zinc-900 transition-colors dark:text-zinc-300 dark:hover:text-zinc-100"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo */}
          <Link href="/" className="flex flex-col items-center lg:items-start group">
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.2em] font-bold text-zinc-900 transition-colors dark:text-zinc-100">
              DEBBY&apos;S
            </span>
            <span className="text-[9px] tracking-[0.35em] text-zinc-400 uppercase -mt-1">
              Fragrance
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-zinc-600 hover:text-zinc-900 transition-colors py-1 dark:text-zinc-300 dark:hover:text-zinc-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Toggle */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-zinc-500 hover:text-zinc-900 transition-colors dark:text-zinc-300 dark:hover:text-zinc-100"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Search Dropdown Modal */}
              {searchOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-zinc-100 rounded-2xl shadow-xl p-4 z-50 animate-fade-in dark:bg-zinc-900 dark:border-zinc-800">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search perfumes, notes, brands..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-gold-500 dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-100"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                        aria-label="Clear search"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Results */}
                  {searchQuery && (
                    <div className="mt-3 max-h-64 overflow-y-auto space-y-2 divide-y divide-zinc-100 dark:divide-zinc-800">
                      {filteredSearch.length > 0 ? (
                        filteredSearch.map((product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.id}`}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center space-x-3 pt-2 group"
                          >
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0 dark:bg-zinc-800">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="object-cover w-full h-full group-hover:scale-110 transition-transform"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-zinc-800 group-hover:text-gold-600 truncate dark:text-zinc-100 dark:group-hover:text-gold-300">
                                {product.name}
                              </p>
                              <p className="text-xs text-gold-600 dark:text-gold-400">
                                {formatNaira(product.sizes[0].price)}
                              </p>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <p className="text-xs text-zinc-400 text-center py-4">
                          No fragrances found matching &ldquo;{searchQuery}&rdquo;
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-zinc-500 hover:text-zinc-900 transition-colors dark:text-zinc-300 dark:hover:text-zinc-100"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Cart Icon */}
            <motion.button
              animate={cartControls}
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-zinc-900 hover:text-gold-600 transition-colors dark:text-zinc-100 dark:hover:text-gold-300"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gold-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-zinc-100 px-6 py-6 space-y-4 animate-fade-in dark:bg-zinc-950 dark:border-zinc-800">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-zinc-700 hover:text-gold-600 transition-colors dark:text-zinc-200 dark:hover:text-gold-300"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between pt-2 text-sm font-semibold text-gold-600 dark:text-gold-400"
          >
            <span>Browse All Fragrances</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </header>
  );
};
