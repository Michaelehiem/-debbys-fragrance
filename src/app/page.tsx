"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Product } from "@/types";
import { Sparkles, ArrowRight, ShieldCheck, Award, HeartHandshake, Instagram, Send, Check } from "lucide-react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { useAdmin } from "@/context/AdminContext";

export default function HomePage() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const { allProducts } = useAdmin();

  const bestSellers = allProducts.filter((p) => p.isBestSeller);
  const newArrivals = allProducts.filter((p) => p.isNewArrival);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSubmitted(false), 4000);
    }
  };

  return (
    <div className="space-y-20 sm:space-y-28 pb-20 font-sans">
      {/* 1. Hero Section — clean, light, airy */}
      <section className="relative overflow-hidden bg-champagne dark:bg-zinc-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.12),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center pt-24 pb-20 sm:pt-32 sm:pb-28 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 text-gold-700 text-xs font-semibold uppercase tracking-[0.2em]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Artisanal Luxury Perfumery · {siteConfig.location.city}, Nigeria</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.05]"
          >
            Discover Your
            <br />
            <span className="italic text-gold-600">Signature Scent</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-sm sm:text-base text-zinc-500 max-w-xl mx-auto leading-relaxed"
          >
            A curated collection of rare olfactory masterpieces. From intoxicating midnight ambers to delicate rose nectar — find a scent that defines your presence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Link
              href="/shop"
              className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs px-9 py-4 rounded-full uppercase tracking-widest flex items-center justify-center space-x-2 transition-all"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/about"
              className="w-full sm:w-auto bg-transparent border border-zinc-300 hover:border-zinc-900 text-zinc-800 font-semibold text-xs px-9 py-4 rounded-full uppercase tracking-widest transition-all"
            >
              Our Story
            </Link>
          </motion.div>
        </div>
        <div className="h-px bg-zinc-200 dark:bg-zinc-200" />
      </section>

      {/* 2. Shop by Category — editorial, light */}
      <ScrollReveal className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
            Curated Collections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            Shop By Gender & Style
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          <Link
            href="/shop?category=women"
            className="group block"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-100">
              <img
                src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800"
                alt="Women Fragrances"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="pt-5 text-center space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">For Her</span>
              <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Women&apos;s Collection
              </h3>
              <p className="text-xs text-zinc-500 flex items-center justify-center space-x-1 transition-colors group-hover:text-gold-600">
                <span>Floral & Gourmand</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>
          </Link>

          <Link
            href="/shop?category=men"
            className="group block"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-100">
              <img
                src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800"
                alt="Men Fragrances"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="pt-5 text-center space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">For Him</span>
              <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Men&apos;s Collection
              </h3>
              <p className="text-xs text-zinc-500 flex items-center justify-center space-x-1 transition-colors group-hover:text-gold-600">
                <span>Woody & Aquatic</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>
          </Link>

          <Link
            href="/shop?category=unisex"
            className="group block"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-100">
              <img
                src="https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&q=80&w=800"
                alt="Unisex Fragrances"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="pt-5 text-center space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">Universal</span>
              <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Unisex & Oud Collection
              </h3>
              <p className="text-xs text-zinc-500 flex items-center justify-center space-x-1 transition-colors group-hover:text-gold-600">
                <span>Amber & Spice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>
          </Link>
        </div>
      </ScrollReveal>

      {/* 3. Best Sellers */}
      <ScrollReveal className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-zinc-200 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
              Most Coveted
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs text-zinc-500 hover:text-zinc-900 flex items-center space-x-1 mt-2 sm:mt-0 font-medium transition-colors dark:hover:text-zinc-100"
          >
            <span>View All Products ({allProducts.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {bestSellers.slice(0, 4).map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 0.1}>
              <ProductCard
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>

      {/* 4. Brand Value Highlight — light, minimal */}
      <ScrollReveal className="bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          <motion.div
            whileHover={{ y: -4 }}
            className="text-center space-y-4"
          >
            <div className="w-14 h-14 mx-auto rounded-full border border-gold-500/40 text-gold-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-100">Handcrafted Formulations</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">
              High-concentration perfume oils sourced from Grasse, France and Arabia for unmatched long-lasting sillage.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="text-center space-y-4"
          >
            <div className="w-14 h-14 mx-auto rounded-full border border-gold-500/40 text-gold-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-100">100% Genuine & Authentic</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">
              Every bottle carries our hologram seal of authenticity and origin guarantee.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="text-center space-y-4"
          >
            <div className="w-14 h-14 mx-auto rounded-full border border-gold-500/40 text-gold-600 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-100">Concierge Service</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">
              Not sure which scent fits your aura? Chat with our fragrance consultants for personalized recommendations.
            </p>
          </motion.div>
        </div>
      </ScrollReveal>

      {/* 5. New Arrivals Grid */}
      <ScrollReveal className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 space-y-10">
        <div className="flex justify-between items-end border-b border-zinc-200 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
              Fresh Off The Press
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
              New Arrivals
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {newArrivals.slice(0, 4).map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 0.1}>
              <ProductCard
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>

      {/* 6. Instagram / Social Feed Section */}
      <ScrollReveal className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
            Follow Our Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            @debsfragrance
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Join our community of fragrance lovers. Tag us in your scents for a chance to be featured.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&q=80&w=400",
          ].map((img, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="aspect-square rounded-2xl overflow-hidden bg-zinc-100 relative group cursor-pointer"
            >
              <img
                src={img}
                alt={`Instagram post ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Instagram className="w-6 h-6 text-white" />
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* 7. Newsletter Section */}
      <ScrollReveal className="bg-champagne dark:bg-zinc-100">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">
            Stay In The Know
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900">
            Join The Fragrance Club
          </h2>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Be the first to discover new arrivals and private invitation events. Members receive early access to limited editions.
          </p>

          {newsletterSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border border-emerald-300 text-emerald-700 p-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 max-w-md mx-auto"
            >
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Welcome to the club! Check your inbox for a confirmation.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 bg-white border border-zinc-300 rounded-full px-5 py-3 text-sm text-zinc-900 focus:outline-none focus:border-gold-500"
              />
              <button
                type="submit"
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs px-7 py-3 rounded-full uppercase tracking-wider flex items-center justify-center space-x-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Subscribe</span>
              </button>
            </form>
          )}

          <p className="text-[10px] text-zinc-400">
            No spam, ever. Unsubscribe anytime. Read our Privacy Policy.
          </p>
        </div>
      </ScrollReveal>

      {/* Quick View Modal Trigger */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
