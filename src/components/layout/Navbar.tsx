"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCustomer } from "@/context/CustomerAuthContext";
import { ShoppingBag, Search, Menu, X, ArrowRight, User } from "lucide-react";
import { DigitalClock } from "@/components/ui/DigitalClock";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";
import { formatNaira } from "@/lib/utils";
import { siteConfig } from "@/config/site";

const LEFT_LINKS = [
  { href: "/shop?category=women", label: "Women" },
  { href: "/shop?category=men", label: "Men" },
  { href: "/shop?category=unisex", label: "Unisex" },
];

const RIGHT_LINKS = [
  { href: "/shop", label: "Shop All" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

const ALL_LINKS = [
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
  const { customer } = useCustomer();
  const { allProducts } = useAdmin();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const cartControls = useAnimation();
  const prevTotalItems = useRef(totalItems);

  useEffect(() => {
    if (totalItems > prevTotalItems.current) {
      cartControls.start({
        scale: [1, 1.3, 0.9, 1.1, 1],
        transition: { duration: 0.5, ease: "easeInOut" },
      });
    }
    prevTotalItems.current = totalItems;
  }, [totalItems, cartControls]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const navLinkClass =
    "text-[11px] uppercase tracking-[0.18em] font-medium text-ink-soft hover:text-ink transition-colors";

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-paper/90 backdrop-blur-md border-b border-ink/10"
          : "bg-paper border-b border-transparent"
      }`}
    >
      {/* Announcement Bar */}
      <div className="relative bg-ink text-paper/80 text-[10px] uppercase tracking-[0.24em] py-2 px-4 text-center overflow-hidden">
        <span>
          Complimentary nationwide delivery over ₦350,000
          <span className="mx-3 text-gold-400">·</span>
          Certified authentic, always
        </span>
        <DigitalClock className="hidden md:inline-flex absolute right-6 top-1/2 -translate-y-1/2 text-paper/70" />
      </div>

      <div className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-[4.5rem] lg:h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden flex-1">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-ink hover:text-gold-600 transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Desktop Left Nav */}
          <nav className="hidden lg:flex items-center gap-9 flex-1">
            {LEFT_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className={`${navLinkClass} link-underline`}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Wordmark */}
          <Link href="/" className="flex flex-col items-center group px-2">
            <span className="font-serif text-xl sm:text-2xl tracking-[0.28em] font-bold text-ink pl-[0.28em]">
              DEBBY&apos;S
            </span>
            <span className="text-[8px] tracking-[0.5em] text-gold-700 uppercase pl-[0.5em] -mt-0.5">
              Fragrance
            </span>
          </Link>

          {/* Desktop Right Nav + Actions */}
          <div className="flex items-center gap-9 flex-1 justify-end">
            <nav className="hidden lg:flex items-center gap-9">
              {RIGHT_LINKS.map((link) => (
                <Link key={link.label} href={link.href} className={`${navLinkClass} link-underline`}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Search Toggle */}
              <div className="relative">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 text-ink hover:text-gold-600 transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-[18px] h-[18px]" />
                </button>

                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-4 w-[22rem] sm:w-96 bg-paper border border-ink/10 shadow-editorial p-4 z-50"
                    >
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search perfumes, notes, brands..."
                          value={searchQuery}
                          onChange={(e) => handleSearchChange(e.target.value)}
                          className="w-full bg-paper-deep/60 border border-ink/10 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-gold-500 transition-colors"
                          autoFocus
                        />
                        <Search className="absolute right-3 top-3.5 w-4 h-4 text-ink-soft/50" />
                      </div>

                      {searchQuery && (
                        <div className="mt-3 max-h-72 overflow-y-auto divide-y divide-ink/5">
                          {filteredSearch.length > 0 ? (
                            filteredSearch.map((product) => (
                              <Link
                                key={product.id}
                                href={`/product/${product.id}`}
                                onClick={() => {
                                  setSearchOpen(false);
                                  setSearchQuery("");
                                }}
                                className="flex items-center space-x-3 py-3 group"
                              >
                                <div className="relative w-12 h-12 overflow-hidden bg-paper-deep flex-shrink-0">
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-ink truncate group-hover:text-gold-700 transition-colors">
                                    {product.name}
                                  </p>
                                  <p className="text-xs text-gold-600 font-serif">
                                    {formatNaira(product.sizes[0].price)}
                                  </p>
                                </div>
                              </Link>
                            ))
                          ) : (
                            <p className="text-xs text-ink-soft/60 text-center py-6">
                              No fragrances found matching &ldquo;{searchQuery}&rdquo;
                            </p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Account */}
              <Link
                href="/account"
                className="relative p-2 text-ink hover:text-gold-600 transition-colors"
                aria-label={customer ? "Your account" : "Sign in"}
              >
                <User className="w-[18px] h-[18px]" />
                {customer && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-gold-600" />
                )}
              </Link>

              {/* Cart Icon */}
              <motion.button
                animate={cartControls}
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-ink hover:text-gold-600 transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-[18px] h-[18px]" />
                {totalItems > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-gold-600 text-paper text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </motion.button>

              {/* Mobile spacer to balance menu button */}
              <span className="lg:hidden w-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden bg-paper border-b border-ink/10"
          >
            <div className="px-6 py-8 space-y-1">
              {ALL_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3.5 border-b border-ink/5 font-serif text-2xl text-ink hover:text-gold-600 transition-colors"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 text-gold-500" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
