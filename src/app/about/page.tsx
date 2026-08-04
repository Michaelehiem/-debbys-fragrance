"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Award, Compass, HeartHandshake, MapPin, Phone, Mail, Instagram, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans space-y-24 pb-20 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Hero Header */}
      <section className="relative py-24 bg-zinc-50/60 border-b border-gold-500/20 text-center px-4 overflow-hidden dark:bg-zinc-900/60">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-400">
            Our Heritage & Philosophy
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100">
            Crafting Unforgettable Olfactory Memories
          </h1>
          <p className="text-sm text-zinc-600 max-w-2xl mx-auto leading-relaxed dark:text-zinc-300">
            Founded with a passion for rare botanicals, precious woods, and golden ambers, {siteConfig.businessName} has grown into {siteConfig.location.state}&apos;s premier destination for bespoke perfume luxury.
          </p>
        </div>
      </section>

      {/* Story Sections */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <span className="text-xs text-gold-600 font-bold uppercase tracking-widest dark:text-gold-400">
            The Beginnings
          </span>
          <h2 className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Born out of a Passion for Scent Architecture
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed dark:text-zinc-300">
            {siteConfig.businessName} started in {siteConfig.location.city} with a simple vision: to bring authentic, high-concentration perfume oils and masterfully blended niche fragrances to discerning fragrance lovers across Nigeria.
          </p>
          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
            We believe that perfume is not merely a cosmetic choice — it is an invisible armor, an intimate signature that enters the room before you speak and stays long after you leave.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link
              href="/shop"
              className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 font-bold text-xs px-6 py-3 rounded-xl uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg"
            >
              <span>Explore Our Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-xs px-6 py-3 rounded-xl uppercase tracking-wider flex items-center justify-center space-x-2 transition-all dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              <Instagram className="w-4 h-4" />
              <span>Follow on Instagram</span>
            </a>
          </div>
        </div>

        <div className="aspect-square rounded-2xl overflow-hidden border border-gold-500/30 relative shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800"
            alt="Debby Fragrance Creation"
            className="object-cover w-full h-full"
          />
        </div>
      </section>

      {/* Values Grid */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs text-gold-600 font-bold uppercase tracking-widest dark:text-gold-400">Our Guiding Pillars</span>
          <h2 className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-100">What Sets {siteConfig.businessName} Apart</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-zinc-200 p-8 rounded-2xl space-y-3 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
            <Award className="w-8 h-8 text-gold-600 dark:text-gold-400" />
            <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-100">Uncompromising Quality</h3>
            <p className="text-xs text-zinc-500 leading-relaxed dark:text-zinc-400">
              We work exclusively with certified master perfumers and ethically sourced raw ingredients to ensure extraordinary longevity and purity.
            </p>
          </div>

          <div className="bg-white border border-zinc-200 p-8 rounded-2xl space-y-3 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
            <Compass className="w-8 h-8 text-gold-600 dark:text-gold-400" />
            <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-100">Scent Curation</h3>
            <p className="text-xs text-zinc-500 leading-relaxed dark:text-zinc-400">
              Every fragrance in our collection is rigorously evaluated for scent trail (sillage), evolution, and balance across climate conditions in West Africa.
            </p>
          </div>

          <div className="bg-white border border-zinc-200 p-8 rounded-2xl space-y-3 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
            <HeartHandshake className="w-8 h-8 text-gold-600 dark:text-gold-400" />
            <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-100">Client Devotion</h3>
            <p className="text-xs text-zinc-500 leading-relaxed dark:text-zinc-400">
              Our clients are family. From our hand-sealed gift boxes to our dedicated scent consultations, we ensure every interaction is memorable.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-zinc-50 border-y border-gold-500/20 py-16 dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-400">
            Visit or Connect
          </span>
          <h2 className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Experience {siteConfig.businessName} in Person
          </h2>
          <p className="text-sm text-zinc-500 max-w-xl mx-auto dark:text-zinc-400">
            Come visit our boutique in {siteConfig.location.city} for personalized scent consultations, or reach out to us directly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-zinc-700 dark:text-zinc-300">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gold-400" />
              <span>{siteConfig.location.shopAddress}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gold-400" />
              <span>{siteConfig.contact.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gold-400" />
              <span>{siteConfig.contact.email}</span>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-block bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 font-bold text-xs px-8 py-3.5 rounded-xl uppercase tracking-widest transition-all shadow-lg"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
