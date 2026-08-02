"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useTheme } from "@/context/ThemeContext";
import {
  ShoppingBag,
  Heart,
  Sun,
  Moon,
  Search,
  Menu,
  X,
  User,
  ShieldCheck,
} from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { INITIAL_PRODUCTS } from "@/data/products";
import { useAdmin } from "@/context/AdminContext";
import { formatNaira } from "@/lib/utils";

export const Navbar: React.FC = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const { allProducts } = useAdmin();
  const { wishlist } = useWishlist();
  const { theme, toggleTheme } = useTheme();
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

  const filteredSearch = searchQuery.trim()
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.fragranceFamily.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gold-500/20 text-zinc-900 transition-colors duration-300 dark:bg-zinc-950/95 dark:text-zinc-100">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 text-white text-xs py-1.5 px-4 text-center font-bold tracking-wider uppercase">
        Free Delivery on orders over ₦350,000 | 100% Authentic Guaranteed
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gold-400 hover:text-gold-300 transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex flex-col items-center">
              <span className="font-serif text-2xl sm:text-3xl tracking-widest font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-200 group-hover:scale-105 transition-transform duration-300">
                DEBBY&apos;S
              </span>
              <span className="text-[9px] tracking-[0.3em] text-gold-400 font-sans uppercase -mt-1">
                Fragrance · Luxury Perfumery
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 font-sans text-sm tracking-wide font-medium">
            <Link href="/" className="text-zinc-700 hover:text-gold-500 transition-colors py-1 dark:text-zinc-200 dark:hover:text-gold-400">
              Home
            </Link>

            <Link href="/shop" className="text-zinc-700 hover:text-gold-500 transition-colors py-1 dark:text-zinc-200 dark:hover:text-gold-400">
              Shop All
            </Link>

            <Link href="/shop?category=women" className="text-zinc-700 hover:text-gold-500 transition-colors py-1 dark:text-zinc-200 dark:hover:text-gold-400">
              Women
            </Link>

            <Link href="/shop?category=men" className="text-zinc-700 hover:text-gold-500 transition-colors py-1 dark:text-zinc-200 dark:hover:text-gold-400">
              Men
            </Link>

            <Link href="/shop?category=unisex" className="text-zinc-700 hover:text-gold-500 transition-colors py-1 dark:text-zinc-200 dark:hover:text-gold-400">
              Unisex
            </Link>

            <Link href="/about" className="text-zinc-700 hover:text-gold-500 transition-colors py-1 dark:text-zinc-200 dark:hover:text-gold-400">
              Our Story
            </Link>

            <Link href="/contact" className="text-zinc-700 hover:text-gold-500 transition-colors py-1 dark:text-zinc-200 dark:hover:text-gold-400">
              Contact
            </Link>

            <Link
              href="/admin"
              className="flex items-center space-x-1 text-gold-400 hover:text-gold-300 border border-gold-500/30 px-2.5 py-1 rounded-full text-xs transition-all hover:border-gold-400"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Toggle */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-zinc-500 hover:text-gold-500 transition-colors dark:text-zinc-300 dark:hover:text-gold-400"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Search Dropdown Modal */}
              {searchOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-gold-500/30 rounded-xl shadow-2xl p-4 z-50 animate-fade-in dark:bg-zinc-900">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search perfumes, notes, brands..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-gold-500 dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-100"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Results */}
                  {searchQuery && (
                    <div className="mt-3 max-h-64 overflow-y-auto space-y-2 divide-y divide-zinc-800">
                      {filteredSearch.length > 0 ? (
                        filteredSearch.map((product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.id}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center space-x-3 pt-2 group"
                          >
                            <div className="relative w-10 h-10 rounded overflow-hidden bg-zinc-800 flex-shrink-0">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="object-cover w-full h-full group-hover:scale-110 transition-transform"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-zinc-100 group-hover:text-gold-400 truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-gold-500">
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
              className="p-2 text-zinc-500 hover:text-gold-500 transition-colors dark:text-zinc-300 dark:hover:text-gold-400"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-gold-400" />
              ) : (
                <Moon className="w-5 h-5 text-zinc-600" />
              )}
            </button>

            {/* Wishlist Icon */}
            <Link
              href="/account"
              className="p-2 text-zinc-500 hover:text-gold-500 transition-colors relative dark:text-zinc-300 dark:hover:text-gold-400"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-rose-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* User Account */}
            <Link
              href="/account"
              className="p-2 text-zinc-500 hover:text-gold-500 transition-colors hidden sm:block dark:text-zinc-300 dark:hover:text-gold-400"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Icon with bounce */}
            <motion.button
              animate={cartControls}
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-zinc-100 bg-gold-600/20 hover:bg-gold-500/30 border border-gold-500/40 rounded-full transition-colors flex items-center space-x-1.5 px-3"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-gold-400" />
              <span className="text-xs font-bold text-gold-300">{totalItems}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gold-500/20 px-6 py-6 space-y-4 font-sans animate-fade-in dark:bg-zinc-950">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-lg font-medium text-zinc-800 hover:text-gold-500 dark:text-zinc-100 dark:hover:text-gold-400"
          >
            Home
          </Link>
          <Link
            href="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-lg font-medium text-zinc-800 hover:text-gold-500 dark:text-zinc-100 dark:hover:text-gold-400"
          >
            Shop All Fragrances
          </Link>
          <Link
            href="/shop?category=women"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-500 hover:text-gold-500 pl-2 dark:text-zinc-400 dark:hover:text-gold-400"
          >
            · Women&apos;s Collection
          </Link>
          <Link
            href="/shop?category=men"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-500 hover:text-gold-500 pl-2 dark:text-zinc-400 dark:hover:text-gold-400"
          >
            · Men&apos;s Collection
          </Link>
          <Link
            href="/shop?category=unisex"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-500 hover:text-gold-500 pl-2 dark:text-zinc-400 dark:hover:text-gold-400"
          >
            · Unisex Collection
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-lg font-medium text-zinc-800 hover:text-gold-500 dark:text-zinc-100 dark:hover:text-gold-400"
          >
            Our Story
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-lg font-medium text-zinc-800 hover:text-gold-500 dark:text-zinc-100 dark:hover:text-gold-400"
          >
            Contact & FAQ
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 text-gold-400 font-semibold"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Panel</span>
          </Link>
        </div>
      )}
    </header>
  );
};
