"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Award, Compass, HeartHandshake } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans space-y-24 pb-20">
      {/* Hero Header */}
      <section className="relative py-24 bg-zinc-900/60 border-b border-gold-500/20 text-center px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-400">
            Our Heritage & Philosophy
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-zinc-100">
            Crafting Unforgettable Olfactory Memories
          </h1>
          <p className="text-sm text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Founded with a passion for rare botanicals, precious woods, and golden ambers, Debby's Fragrance has grown into Nigeria's premier destination for bespoke perfume luxury.
          </p>
        </div>
      </section>

      {/* Story Sections */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <span className="text-xs text-gold-400 font-bold uppercase tracking-widest">
            The Beginnings
          </span>
          <h2 className="font-serif text-3xl font-bold text-zinc-100">
            Born out of a Passion for Scent Architecture
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Debby's Fragrance started in Kubwa, Abuja with a simple vision: to bring authentic, high-concentration perfume oils and masterfully blended niche fragrances to discerning fragrance lovers across Nigeria.
          </p>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            We believe that perfume is not merely a cosmetic choice — it is an invisible armor, an intimate signature that enters the room before you speak and stays long after you leave.
          </p>
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs text-gold-400 font-bold uppercase tracking-widest">Our Guiding Pillars</span>
          <h2 className="font-serif text-3xl font-bold text-zinc-100">What Sets Debby's Apart</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl space-y-3">
            <Award className="w-8 h-8 text-gold-400" />
            <h3 className="font-serif text-xl font-bold text-zinc-100">Uncompromising Quality</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We work exclusively with certified master perfumers and ethically sourced raw ingredients to ensure extraordinary longevity and purity.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl space-y-3">
            <Compass className="w-8 h-8 text-gold-400" />
            <h3 className="font-serif text-xl font-bold text-zinc-100">Scent Curation</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every fragrance in our collection is rigorously evaluated for scent trail (sillage), evolution, and balance across climate conditions in West Africa.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl space-y-3">
            <HeartHandshake className="w-8 h-8 text-gold-400" />
            <h3 className="font-serif text-xl font-bold text-zinc-100">Client Devotion</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Our clients are family. From our hand-sealed gift boxes to our dedicated scent consultations, we ensure every interaction is memorable.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
