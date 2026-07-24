"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INITIAL_PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Product } from "@/types";
import { Sparkles, ArrowRight, ShieldCheck, Award, HeartHandshake, Instagram, Send, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const bestSellers = INITIAL_PRODUCTS.filter((p) => p.isBestSeller);
  const newArrivals = INITIAL_PRODUCTS.filter((p) => p.isNewArrival);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSubmitted(false), 4000);
    }
  };

  return (
    <div className="space-y-24 pb-20 font-sans">
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-zinc-950 text-zinc-100">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1920"
            alt="Debby's Fragrance Luxury Banner"
            className="w-full h-full object-cover object-center opacity-30 scale-105"
            style={{ animation: "pulse 12s ease-in-out infinite" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-6 pt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-gold-500/10 border border-gold-500/30 px-4 py-1.5 rounded-full text-gold-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Artisanal Luxury Perfumery · Abuja, Nigeria</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-gold-200 to-gold-400 leading-tight"
          >
            Discover Your Signature Scent
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed"
          >
            Immerse yourself in our curated collection of rare olfactory masterpieces. From intoxicating midnight ambers to delicate rose nectar, find a scent that defines your presence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/shop"
              className="w-full sm:w-auto bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 hover:brightness-110 text-zinc-950 font-bold text-xs px-8 py-4 rounded-xl uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-xl shadow-gold-950/50"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/about"
              className="w-full sm:w-auto bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-xs px-8 py-4 rounded-xl uppercase tracking-widest transition-all backdrop-blur-md"
            >
              Our Story & Heritage
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Shop by Category */}
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-400">
            Curated Collections
          </span>
          <h2 className="font-serif text-3xl font-bold text-zinc-100">
            Shop By Gender & Style
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/shop?category=women"
            className="group relative h-80 rounded-2xl overflow-hidden border border-zinc-800 hover:border-gold-500/50 transition-all shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800"
              alt="Women Fragrances"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 space-y-1">
              <span className="text-xs text-gold-400 uppercase tracking-wider font-semibold">For Her</span>
              <h3 className="font-serif text-2xl font-bold text-zinc-100">Women&apos;s Collection</h3>
              <p className="text-xs text-zinc-400 group-hover:text-gold-300 flex items-center space-x-1 transition-colors">
                <span>Explore Floral & Gourmand</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>
          </Link>

          <Link
            href="/shop?category=men"
            className="group relative h-80 rounded-2xl overflow-hidden border border-zinc-800 hover:border-gold-500/50 transition-all shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800"
              alt="Men Fragrances"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 space-y-1">
              <span className="text-xs text-gold-400 uppercase tracking-wider font-semibold">For Him</span>
              <h3 className="font-serif text-2xl font-bold text-zinc-100">Men&apos;s Collection</h3>
              <p className="text-xs text-zinc-400 group-hover:text-gold-300 flex items-center space-x-1 transition-colors">
                <span>Explore Woody & Aquatic</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>
          </Link>

          <Link
            href="/shop?category=unisex"
            className="group relative h-80 rounded-2xl overflow-hidden border border-zinc-800 hover:border-gold-500/50 transition-all shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&q=80&w=800"
              alt="Unisex Fragrances"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 space-y-1">
              <span className="text-xs text-gold-400 uppercase tracking-wider font-semibold">Universal</span>
              <h3 className="font-serif text-2xl font-bold text-zinc-100">Unisex & Oud Collection</h3>
              <p className="text-xs text-zinc-400 group-hover:text-gold-300 flex items-center space-x-1 transition-colors">
                <span>Explore Amber & Spice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>
          </Link>
        </div>
      </ScrollReveal>

      {/* 3. Best Sellers */}
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-zinc-800 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-400">
              Most Coveted
            </span>
            <h2 className="font-serif text-3xl font-bold text-zinc-100 mt-1">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs text-gold-400 hover:text-gold-300 flex items-center space-x-1 mt-2 sm:mt-0 font-medium"
          >
            <span>View All Products ({INITIAL_PRODUCTS.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* 4. Brand Value Highlight */}
      <ScrollReveal className="bg-zinc-900 border-y border-gold-500/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <motion.div
            whileHover={{ y: -4 }}
            className="space-y-3 p-6 rounded-2xl bg-zinc-950/50 border border-zinc-800 hover:border-gold-500/30 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-zinc-100">Handcrafted Formulations</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every bottle is formulated using high-concentration perfume oils sourced from Grasse, France and Arabia for unmatched 24-hour sillage.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="space-y-3 p-6 rounded-2xl bg-zinc-950/50 border border-zinc-800 hover:border-gold-500/30 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-zinc-100">100% Genuine & Authentic</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We stand against counterfeit scents. Every bottle comes with our hologram seal of authenticity and origin guarantee.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="space-y-3 p-6 rounded-2xl bg-zinc-950/50 border border-zinc-800 hover:border-gold-500/30 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 mx-auto">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-zinc-100">Concierge Service</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Unsure which scent fits your aura? Chat with our fragrance consultants in Abuja for personalized recommendations.
            </p>
          </motion.div>
        </div>
      </ScrollReveal>

      {/* 5. New Arrivals Grid */}
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-400">
              Fresh Off The Press
            </span>
            <h2 className="font-serif text-3xl font-bold text-zinc-100 mt-1">
              New Arrivals
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-400">
            Follow Our Journey
          </span>
          <h2 className="font-serif text-3xl font-bold text-zinc-100">
            @debbysfragrance
          </h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Join our community of fragrance lovers. Tag us in your scents for a chance to be featured.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&q=80&w=400",
          ].map((img, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="aspect-square rounded-xl overflow-hidden border border-zinc-800 hover:border-gold-500/50 transition-colors relative group cursor-pointer"
            >
              <img
                src={img}
                alt={`Instagram post ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Instagram className="w-6 h-6 text-gold-400" />
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* 7. Newsletter Section */}
      <ScrollReveal className="bg-zinc-900 border-y border-gold-500/20 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-400">
            Stay In The Know
          </span>
          <h2 className="font-serif text-3xl font-bold text-zinc-100">
            Join The Fragrance Club
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Be the first to discover new arrivals, exclusive offers, and private invitation events. VIP members receive early access to limited editions.
          </p>

          {newsletterSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 p-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 max-w-md mx-auto"
            >
              <Check className="w-4 h-4 text-emerald-400" />
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
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-gold-500"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 font-bold text-xs px-6 py-3 rounded-xl uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>Subscribe</span>
              </button>
            </form>
          )}

          <p className="text-[10px] text-zinc-500">
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
