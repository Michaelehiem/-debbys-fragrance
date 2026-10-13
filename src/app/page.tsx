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
import { formatNaira } from "@/lib/utils";

const MARQUEE_ITEMS = [
  "Amber Nectar", "Midnight Oud", "Rose Petal", "Santal Noir",
  "Bergamot Sky", "Tonka & Vanille", "Jasmine Élixir", "Bois de Cèdre",
];

export default function HomePage() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const { allProducts } = useAdmin();

  const newArrivals = allProducts.filter((p) => p.isNewArrival);
  const deals = allProducts.filter((p) =>
    p.sizes.some((s) => s.originalPrice && s.originalPrice > s.price)
  );

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSubmitted(false), 4000);
    }
  };

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
    "https://images.pexels.com/photos/28664165/pexels-photo-28664165.jpeg?auto=compress&cs=tinysrgb&w=500",
    "https://images.pexels.com/photos/19055592/pexels-photo-19055592.jpeg?auto=compress&cs=tinysrgb&w=500",
    "https://images.pexels.com/photos/8624586/pexels-photo-8624586.jpeg?auto=compress&cs=tinysrgb&w=500",
    "https://images.pexels.com/photos/21574949/pexels-photo-21574949.jpeg?auto=compress&cs=tinysrgb&w=500",
    "https://images.pexels.com/photos/264819/pexels-photo-264819.jpeg?auto=compress&cs=tinysrgb&w=500",
    "https://images.pexels.com/photos/32817141/pexels-photo-32817141.jpeg?auto=compress&cs=tinysrgb&w=500",
  ];

  return (
    <div className="relative isolate font-sans pb-24">
      {/* Soft background wallpaper */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-[0.08]"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/8624586/pexels-photo-8624586.jpeg?auto=compress&cs=tinysrgb&w=1600)",
        }}
      />
      {/* ═══ 1. HERO — asymmetric editorial ═══ */}
      <section className="relative overflow-hidden">
        <div className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12 grid lg:grid-cols-12 gap-10 lg:gap-12 pt-14 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 lg:pb-0">
          {/* Text column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-eyebrow text-rose-600"
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
              <span className="script block text-rose-600 leading-[1.05] text-[3rem] sm:text-6xl lg:text-7xl xl:text-[4.75rem]">
                signature scent
              </span>
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
                className="group inline-flex items-center gap-3 rounded-full bg-ink text-paper text-xs font-semibold uppercase tracking-[0.22em] px-9 py-4 transition-all duration-300 hover:bg-rose-700"
              >
                Explore the collection
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/about"
                className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-ink link-underline"
              >
                Our story
                <ArrowUpRight className="w-4 h-4 text-rose-600 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
            <div className="relative aspect-[3/4] lg:aspect-[4/5] overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1000"
                alt="Debby's Fragrance atelier"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-rose-200" />
            </div>
            <div className="absolute -bottom-5 left-0 lg:-left-10 rounded-2xl bg-white border border-ink/10 px-7 py-5 shadow-soft flex items-baseline gap-3">
              <span className="font-serif text-4xl font-bold text-rose-700">N{String(allProducts.length).padStart(2, "0")}</span>
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
              <span className="w-1.5 h-1.5 bg-rose-400/80 rotate-45" />
            </span>
          ))}
        </div>
      </div>

      {/* ═══ 1. NEW ARRIVALS — the latest ═══ */}
      <ScrollReveal className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12 pt-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-ink/10 pb-6 mb-10">
          <div>
            <span className="section-num">N°01</span>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl font-bold text-ink">
              New arrivals
            </h2>
            <p className="mt-3 text-sm text-ink-soft/70 max-w-md leading-relaxed">
              Freshly bottled — the newest scents to join the atelier.
            </p>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink link-underline"
          >
            Shop all new
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
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
              <ProductCard product={product} onQuickView={(p) => setQuickViewProduct(p)} />
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* ═══ 2. TOP DEALS — discounted favourites ═══ */}
      <ScrollReveal className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12 pt-28">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-ink/10 pb-6 mb-10">
          <div>
            <span className="section-num">N°02</span>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl font-bold text-ink">
              Top deals
            </h2>
            <p className="mt-3 text-sm text-ink-soft/70 max-w-md leading-relaxed">
              Limited-time prices on our most loved compositions.
            </p>
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
          {(deals.length ? deals : allProducts.filter((p) => p.isBestSeller)).slice(0, 4).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <ProductCard product={product} onQuickView={(p) => setQuickViewProduct(p)} />
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* ═══ DISCOUNT — offer band ═══ */}
      <ScrollReveal className="mt-28">
        <section className="relative overflow-hidden border-y border-ink/10 bg-ink text-paper">
          <img
            src="https://images.pexels.com/photos/37127787/pexels-photo-37127787.jpeg?auto=compress&cs=tinysrgb&w=1400"
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/95 to-ink/70" />
          <div className="relative z-10 max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20 grid gap-10 md:grid-cols-[1.5fr_1fr] md:items-center">
            <div>
              <span className="text-[11px] font-medium uppercase tracking-[0.26em] text-rose-300">
                Limited-time offer
              </span>
              <h2 className="mt-4 font-serif text-4xl sm:text-5xl font-bold leading-[1.05]">
                Save up to <span className="script text-rose-300 text-[1.35em] leading-none">25%</span> on selected scents
              </h2>
              <p className="mt-5 text-sm text-paper/70 max-w-md leading-relaxed">
                Our deal edit brings you signature favourites at their best price.
                Complimentary nationwide delivery on orders over ₦350,000.
              </p>
              <Link
                href="/shop"
                className="mt-9 inline-flex items-center gap-3 rounded-full bg-rose-600 text-white text-xs font-semibold uppercase tracking-[0.22em] px-8 py-4 transition-colors duration-300 hover:bg-rose-700"
              >
                Shop the deals
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {deals[0] && (
              <div className="justify-self-end w-full max-w-[19rem] overflow-hidden rounded-2xl bg-paper text-ink border border-ink/10 shadow-editorial">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={deals[0].images[0]}
                    alt={deals[0].name}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-rose-600 text-white text-[9px] font-semibold uppercase tracking-[0.18em] px-2.5 py-1">
                    Deal of the week
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-ink-soft/70">
                    {deals[0].brand}
                  </p>
                  <h3 className="mt-1.5 font-serif text-xl font-bold text-ink">
                    {deals[0].name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-serif text-lg font-bold text-rose-700">
                      {formatNaira(deals[0].sizes[0].price)}
                    </span>
                    {deals[0].sizes[0].originalPrice && (
                      <span className="text-[11px] text-ink-soft/50 line-through">
                        {formatNaira(deals[0].sizes[0].originalPrice as number)}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/product/${deals[0].id}`}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink text-paper px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 hover:bg-rose-700"
                  >
                    Shop now
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </ScrollReveal>

      {/* ═══ 4. MANIFESTO — pull quote band ═══ */}
      <ScrollReveal className="mt-28">
        <section className="bg-ink text-paper py-24 sm:py-28 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center space-y-8">
            <div className="bg-rose-line h-px w-24 mx-auto" />
            <p className="font-serif italic text-2xl sm:text-4xl leading-snug text-paper/90 px-2">
              &ldquo;Perfume is not a cosmetic choice — it is an invisible armor,
              an intimate signature that enters the room before you speak and
              lingers long after you leave.&rdquo;
            </p>
            <p className="text-[10px] uppercase tracking-[0.32em] text-rose-300">
              The Debby&apos;s Fragrance Philosophy
            </p>
            <div className="bg-rose-line h-px w-24 mx-auto" />
          </div>
        </section>
      </ScrollReveal>

      {/* ═══ 5. VALUES ═══ */}
      <ScrollReveal className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12 pt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px overflow-hidden rounded-2xl bg-ink/10 border border-ink/10">
          {values.map(({ icon: Icon, num, title, text }) => (
            <motion.div
              key={num}
              whileHover={{ y: -4 }}
              className="bg-white p-8 sm:p-10 group"
            >
              <div className="flex items-center justify-between">
                <Icon className="w-7 h-7 text-rose-600" />
                <span className="font-serif text-3xl text-rose-400/50">{num}</span>
              </div>
              <h3 className="mt-6 font-serif text-xl font-bold text-ink group-hover:text-rose-700 transition-colors">
                {title}
              </h3>
              <p className="mt-3 text-sm text-ink-soft/70 leading-relaxed">
                {text}
              </p>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* ═══ 7. INSTAGRAM RAIL ═══ */}
      <ScrollReveal className="mt-28">
        <div className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12 mb-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="section-num">N°03</span>
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
            Join the <span className="script text-rose-600 text-[1.15em] leading-none">fragrance club</span>
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
              <div className="flex border-b border-ink/25 focus-within:border-rose-400 transition-colors">
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