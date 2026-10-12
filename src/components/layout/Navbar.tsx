"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCustomer } from "@/context/CustomerAuthContext";
import { ShoppingBag, Search, Menu, X, ArrowRight, User, Phone, Instagram } from "lucide-react";
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

const EASE = [0.22, 1, 0.36, 1] as const;

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
  const searchRef = useRef<HTMLDivElement>(null);

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

  // Escape closes any open overlay.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Click anywhere outside the search panel dismisses it.
  useEffect(() => {
    if (!searchOpen) return;
    const onDown = (e: PointerEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [searchOpen]);

  // Lock page scroll while the mobile drawer is open.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileMenuOpen]);

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

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-paper/90 backdrop-blur-md border-b border-ink/10 shadow-editorial-sm"
          : "bg-paper border-b border-transparent"
      }`}
    >
      {/* Announcement Bar — sliding ticker */}
      <div className="relative bg-ink text-paper/80 text-[10px] uppercase tracking-[0.24em] py-2 overflow-hidden">
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {[0, 1].map((k) => (
            <span key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
              {[0, 1, 2].map((j) => (
                <React.Fragment key={j}>
                  <span className="mx-6">Complimentary nationwide delivery over ₦350,000</span>
                  <span className="text-gold-400">·</span>
                  <span className="mx-6">Certified authentic, always</span>
                  <span className="text-gold-400">·</span>
                </React.Fragment>
              ))}
            </span>
          ))}
        </div>
        <DigitalClock className="hidden md:inline-flex absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-ink via-ink to-transparent pl-8 text-paper/70" />
      </div>

      <div className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-[4.5rem] lg:h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden flex-1">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-ink hover:text-gold-600 transition-colors"
              aria-label="Open navigation"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-5 h-5" />
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
          <Link
            href="/"
            className="group relative flex flex-col items-center px-3"
            aria-label="Debby's Fragrance — home"
          >
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="font-serif text-xl sm:text-[1.65rem] font-bold tracking-[0.28em] text-ink pl-[0.28em] leading-none transition-colors duration-500 group-hover:text-gold-700"
            >
              DEBBY&apos;S
            </motion.span>
            <span className="mt-1.5 flex items-center gap-2">
              <span className="h-px w-3 bg-gold-500/0 transition-all duration-500 group-hover:w-6 group-hover:bg-gold-500/60" />
              <span className="text-[8px] uppercase tracking-[0.5em] text-gold-700 pl-[0.5em]">
                Fragrance
              </span>
              <span className="h-px w-3 bg-gold-500/0 transition-all duration-500 group-hover:w-6 group-hover:bg-gold-500/60" />
            </span>
            <span className="pointer-events-none absolute -bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-gold-gradient transition-all duration-500 group-hover:w-[70%]" />
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
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 text-ink hover:text-gold-600 transition-colors"
                  aria-label="Search"
                  aria-expanded={searchOpen}
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
                      className="fixed left-4 right-4 top-[6.5rem] w-auto sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-4 sm:w-96 bg-paper border border-ink/10 shadow-editorial p-4 z-50"
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
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop — click to dismiss */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
              onClick={closeMenu}
              aria-hidden="true"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 34, stiffness: 320 }}
              className="relative flex h-full w-[86%] max-w-sm flex-col bg-paper border-r border-ink/10 shadow-editorial"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
            >
              <div className="flex items-center justify-between px-6 h-[4.5rem] border-b border-ink/10 flex-shrink-0">
                <span className="font-serif text-lg font-bold tracking-[0.26em] text-ink pl-[0.26em]">
                  DEBBY&apos;S
                </span>
                <button
                  onClick={closeMenu}
                  className="p-2 -mr-2 text-ink-soft hover:text-ink transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-6 py-6">
                {ALL_LINKS.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + i * 0.05, duration: 0.4, ease: EASE }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className="group flex items-baseline gap-4 py-4 border-b border-ink/10"
                    >
                      <span className="font-serif text-[11px] tabular-nums text-gold-600">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 font-serif text-3xl text-ink transition-colors group-hover:text-gold-700">
                        {link.label}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 -translate-x-1 text-gold-500 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link
                    href="/account"
                    onClick={closeMenu}
                    className="mt-6 flex items-center justify-center gap-2 border border-ink/20 py-3.5 text-[11px] uppercase tracking-[0.2em] text-ink hover:border-gold-600 hover:text-gold-700 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    {customer ? "My Account" : "Sign In"}
                  </Link>
                </motion.div>
              </nav>

              <div className="flex-shrink-0 border-t border-ink/10 bg-paper-deep/50 px-6 py-6">
                <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-ink-soft/60">
                  Concierge
                </p>
                <a
                  href={siteConfig.socials.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-sm text-ink hover:text-gold-700 transition-colors"
                >
                  <Phone className="w-4 h-4 text-gold-600" />
                  {siteConfig.contact.phone}
                </a>
                <a
                  href={siteConfig.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 flex items-center gap-3 text-sm text-ink hover:text-gold-700 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-gold-600" />
                  Follow on Instagram
                </a>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
