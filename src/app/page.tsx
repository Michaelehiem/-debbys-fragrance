"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Product } from "@/types";
import { Sparkles, ArrowRight, ShieldCheck, Award, HeartHandshake, Instagram, Send, Check, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { useAdmin } from "@/context/AdminContext";

const MARQUEE_ITEMS = [
  "Amber Nectar", "Midnight Oud", "Rose Petal", "Santal Noir",
  "Bergamot Sky", "Tonka & Vanille", "Jasmine Élixir", "Bois de Cèdre",
];

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

  const categories = [
    {
      n: "01",
      title: "Women's Collection",
      tag: "For Her",
      desc: "Floral & Gourmand",
      img: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800",
      href: "/shop?category=women",
    },
    {
      n: "02",
      title: "Men's Collection",
      tag: "For Him",
      desc: "Woody & Aquatic",
      img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800",
      href: "/shop?category=men",
    },
    {
      n: "03",
      title: "Unisex & Oud",
      tag: "Universal",
      desc: "Amber & Spice",
      img: "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&q=80&w=800",
      href: "/shop?category=unisex",
    },
  ];

  const values = [
    {
      icon: Award,
      num: "I",
      title: "Handcrafted Formulations",
      text: "High-concentration perfume oils sourced from Grasse and Arabia for unmatched, long-lasting sillage.",
    },
    {
      icon: ShieldCheck,
      num: "II",
      title: "100% Genuine & Authentic",
      text: "Every bottle carries our hologram seal of authenticity and an absolute origin guarantee.",
    },
    {
      icon: HeartHandshake,
      num: "III",
      title: "Concierge Service",
      text: "Not sure which scent fits your aura? Our consultants craft personal recommendations for you.",
    },
  ];

  const instagram = [
    "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&q=80&w=500",
  ];

  return (
    <div className="font-sans pb-24">
      {/* ═══ 1. HERO — asymmetric editorial ═══ */}
      <section className="relative overflow-hidden">
        <div className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12 grid lg:grid-cols-12 gap-10 lg:gap-12 pt-14 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 lg:pb-0">
          {/* Text column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-eyebrow text-gold-700"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Artisanal Luxury Perfumery · {siteConfig.location.city}, Nigeria
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.12 }}
              className="mt-8 font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold leading-[0.98] tracking-[-0.01em] text-ink"
            >
              Discover your
              <br />
              <span className="italic text-gold-700">signature scent</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.24 }}
              className="mt-8 text-sm sm:text-base text-ink-soft max-w-lg leading-[1.9]"
            >
              A curated collection of rare olfactory masterpieces — from intoxicating
              midnight ambers to delicate rose nectar. Each bottle, a presence that
              enters the room before you speak.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.36 }}
              className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-5"
            >
              <Link
                href="/shop"
                className="group inline-flex items-center gap-3 bg-ink text-paper text-xs font-semibold uppercase tracking-[0.22em] px-9 py-4 transition-all duration-300 hover:bg-gold-700"
              >
                Explore the collection
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/about"
                className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-ink link-underline"
              >
                Our story
                <ArrowUpRight className="w-4 h-4 text-gold-700 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>
          </div>

          {/* Image column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[3/4] lg:aspect-[4/5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1000"
                alt="Debby's Fragrance atelier"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-ink/10" />
            </div>
            <div className="absolute -bottom-5 left-0 lg:-left-10 bg-white border border-ink/10 px-7 py-5 shadow-editorial-sm flex items-baseline gap-3">
              <span className="font-serif text-4xl font-bold text-gold-700">N{String(allProducts.length).padStart(2, "0")}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-ink-soft leading-relaxed">
                curated<br />compositions
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ Marquee ticker ═══ */}
      <div className="border-y border-ink/10 bg-paper-deep/40 overflow-hidden py-3.5">
        <div className="flex whitespace-nowrap animate-marquee w-max">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center">
              <span className="font-serif italic text-sm text-ink/50 mx-5">{item}</span>
              <span className="w-1.5 h-1.5 bg-gold-500/70 rotate-45" />
            </span>
          ))}
        </div>
      </div>

      {/* ═══ 2. SHOP BY COLLECTION — editorial index ═══ */}
      <ScrollReveal className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12 pt-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="section-num">N°01</span>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl font-bold text-ink">
              Shop by collection
            </h2>
          </div>
          <span className="hidden sm:block text-[11px] uppercase tracking-[0.2em] text-ink-soft/50">
            Three distinct temperaments
          </span>
        </div>

        <div className="border-t border-ink/10">
          {categories.map((cat) => (
            <Link
              key={cat.n}
              href={cat.href}
              className="group grid grid-cols-1 md:grid-cols-12 items-center gap-6 md:gap-10 py-8 md:py-10 border-b border-ink/10"
            >
              <div className="md:col-span-1 font-serif text-2xl text-gold-500/60">
                {cat.n}
              </div>

              <div className="md:col-span-5 md:pl-4">
                <span className="text-[10px] uppercase tracking-[0.24em] text-gold-700">{cat.tag}</span>
                <h3 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-ink group-hover:text-gold-700 transition-colors">
                  {cat.title}
                </h3>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-ink-soft/60">{cat.desc}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink link-underline">
                  Explore
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>

              <div className="md:col-span-6">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="w-full h-full object-cover scale-[1.02] group-hover:scale-105 transition-transform duration-[1200ms] ease-out"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </ScrollReveal>

      {/* ═══ 3. BEST SELLERS ═══ */}
      <ScrollReveal className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12 pt-28">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-ink/10 pb-6 mb-10">
          <div>
            <span className="section-num">N°02</span>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl font-bold text-ink">
              Most coveted
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink link-underline"
          >
            View all {allProducts.length}
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7">
          {bestSellers.slice(0, 4).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <ProductCard
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* ═══ 4. MANIFESTO — pull quote band ═══ */}
      <ScrollReveal className="mt-28">
        <section className="bg-ink text-paper py-24 sm:py-28 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center space-y-8">
            <div className="bg-brass-line h-px w-24 mx-auto" />
            <p className="font-serif italic text-2xl sm:text-4xl leading-snug text-paper/90 px-2">
              &ldquo;Perfume is not a cosmetic choice — it is an invisible armor,
              an intimate signature that enters the room before you speak and
              lingers long after you leave.&rdquo;
            </p>
            <p className="text-[10px] uppercase tracking-[0.32em] text-gold-400">
              The Debby&apos;s Fragrance Philosophy
            </p>
            <div className="bg-brass-line h-px w-24 mx-auto" />
          </div>
        </section>
      </ScrollReveal>

      {/* ═══ 5. VALUES ═══ */}
      <ScrollReveal className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12 pt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ink/10 border border-ink/10">
          {values.map(({ icon: Icon, num, title, text }) => (
            <motion.div
              key={num}
              whileHover={{ y: -4 }}
              className="bg-white p-8 sm:p-10 group"
            >
              <div className="flex items-center justify-between">
                <Icon className="w-7 h-7 text-gold-600" />
                <span className="font-serif text-3xl text-gold-500/40">{num}</span>
              </div>
              <h3 className="mt-6 font-serif text-xl font-bold text-ink group-hover:text-gold-700 transition-colors">
                {title}
              </h3>
              <p className="mt-3 text-sm text-ink-soft/70 leading-relaxed">
                {text}
              </p>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* ═══ 6. NEW ARRIVALS ═══ */}
      <ScrollReveal className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12 pt-28">
        <div className="flex items-end justify-between border-b border-ink/10 pb-6 mb-10">
          <div>
            <span className="section-num">N°03</span>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl font-bold text-ink">
              New arrivals
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7">
          {newArrivals.slice(0, 4).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <ProductCard
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* ═══ 7. INSTAGRAM RAIL ═══ */}
      <ScrollReveal className="mt-28">
        <div className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12 mb-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="section-num">N°04</span>
              <h2 className="mt-3 font-serif text-4xl sm:text-5xl font-bold text-ink">
                @debsfragrance
              </h2>
            </div>
            <p className="hidden sm:block text-[11px] uppercase tracking-[0.2em] text-ink-soft/50 max-w-xs text-right leading-relaxed">
              Join our community — tag us in your scents to be featured
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 px-5 sm:px-8 lg:px-12">
          {instagram.map((img, i) => (
            <a
              key={i}
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-paper-deep"
            >
              <img
                src={img}
                alt={`Instagram post ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-ink/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Instagram className="w-5 h-5 text-paper" />
              </div>
            </a>
          ))}
        </div>
      </ScrollReveal>

      {/* ═══ 8. NEWSLETTER — editorial band ═══ */}
      <ScrollReveal className="mt-28">
        <section className="max-w-4xl mx-auto px-5 sm:px-8 text-center space-y-8">
          <span className="section-num mx-auto" />
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-ink">
            Join the <span className="italic text-gold-700">fragrance club</span>
          </h2>
          <p className="text-sm text-ink-soft leading-relaxed max-w-lg mx-auto">
            Be the first to discover new arrivals and private invitation events.
            Members receive early access to limited editions.
          </p>

          {newsletterSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-md bg-[#e9f0e9] border border-[#7a9a80] p-5 text-xs font-medium text-[#2d4a3e] flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Welcome to the club — check your inbox to confirm.
            </motion.div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              <div className="flex border-b border-ink/25 focus-within:border-gold-600 transition-colors">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-transparent px-0 py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink flex items-center gap-2 shrink-0"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Subscribe</span>
                </button>
              </div>
            </form>
          )}

          <p className="text-[10px] uppercase tracking-[0.2em] text-ink-soft/50">
            No spam, ever. Unsubscribe anytime.
          </p>
        </section>
      </ScrollReveal>

      {/* Quick View Modal Trigger */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}