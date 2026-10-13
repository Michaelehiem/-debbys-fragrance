"use client";

import React from "react";
import Link from "next/link";
import { Award, Compass, HeartHandshake, MapPin, Phone, Mail, Instagram, ArrowRight, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      num: "I",
      title: "Uncompromising Quality",
      text: "We work exclusively with certified master perfumers and ethically sourced raw ingredients to ensure extraordinary longevity and purity.",
    },
    {
      icon: Compass,
      num: "II",
      title: "Scent Curation",
      text: "Every fragrance is rigorously evaluated for sillage, projection, and balance across the climate conditions of West Africa.",
    },
    {
      icon: HeartHandshake,
      num: "III",
      title: "Client Devotion",
      text: "Our clients are family. From hand-sealed gift boxes to dedicated scent consultations, every interaction is memorable.",
    },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink font-sans pb-24">
      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center py-20 sm:py-28">
          <span className="eyebrow justify-center">Our heritage &amp; philosophy</span>
          <h1 className="mt-6 font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink leading-[1.05]">
            Crafting unforgettable
            <br />
            <span className="script block text-rose-600 leading-[1.1] text-[2.25rem] sm:text-5xl lg:text-6xl">olfactory memories</span>
          </h1>
          <p className="mt-7 text-sm sm:text-base text-ink-soft max-w-2xl mx-auto leading-[1.9]">
            Founded with a passion for rare botanicals, precious woods, and golden ambers, {siteConfig.businessName} has grown into {siteConfig.location.state}&apos;s premier destination for bespoke perfume luxury.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center py-20 sm:py-24">
        <div className="md:order-2 space-y-4">
          <span className="section-num">Founded in {siteConfig.location.city}</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink leading-tight">
            Born out of a passion for scent architecture
          </h2>
          <p className="text-sm sm:text-base text-ink-soft leading-[1.9]">
            {siteConfig.businessName} started in {siteConfig.location.city} with a simple vision: to bring authentic, high-concentration perfume oils and masterfully blended niche fragrances to discerning fragrance lovers across Nigeria.
          </p>
          <p className="text-sm sm:text-base text-ink-soft/80 leading-[1.9]">
            We believe perfume is not merely a cosmetic choice — it is an invisible armor, an intimate signature that enters the room before you speak and stays long after you leave.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-5">
            <Link
              href="/shop"
              className="group inline-flex items-center justify-center gap-3 bg-ink hover:bg-gold-700 text-paper text-xs font-semibold uppercase tracking-[0.22em] px-9 py-4 transition-colors"
            >
              Explore our collection
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-ink/20 text-ink hover:border-gold-700 hover:text-gold-700 text-xs font-semibold uppercase tracking-[0.22em] px-9 py-4 transition-colors"
            >
              <Instagram className="w-4 h-4" />
              Follow along
            </a>
          </div>
        </div>

        <div className="md:order-1 relative">
          <div className="aspect-[4/5] overflow-hidden border border-ink/10">
            <img
              src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=900"
              alt="Debby Fragrance creation"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-ink/5" />
          </div>
          <div className="absolute -bottom-6 -right-4 sm:right-8 bg-gold-600 text-paper px-8 py-6">
            <p className="font-serif italic text-xl">Est. {new Date().getFullYear() - 1}</p>
            <p className="text-[10px] uppercase tracking-[0.24em] mt-1 text-paper/80">A Nigerian atelier</p>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center space-y-4 mb-12">
          <span className="section-num mx-auto" />
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-ink">
            What sets us apart
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ink/10 border border-ink/10">
          {values.map(({ icon: Icon, num, title, text }) => (
            <div key={num} className="bg-white p-8 sm:p-10 group">
              <div className="flex items-center justify-between">
                <Icon className="w-7 h-7 text-gold-600" />
                <span className="font-serif text-3xl text-gold-500/40">{num}</span>
              </div>
              <h3 className="mt-6 font-serif text-2xl font-bold text-ink group-hover:text-gold-700 transition-colors">
                {title}
              </h3>
              <p className="mt-3 text-sm text-ink-soft/70 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="mt-24 bg-ink text-paper py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-400 inline-flex items-center gap-2">
            Visit or connect
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-paper leading-tight">
            Experience {siteConfig.businessName} in person
          </h2>
          <p className="text-sm sm:text-base text-paper/60 max-w-xl mx-auto leading-relaxed">
            Visit our boutique in {siteConfig.location.city} for personalized scent consultations, or reach out to us directly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-xs text-paper/80">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-gold-400" />
              {siteConfig.location.shopAddress}
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-gold-400" />
              {siteConfig.contact.phone}
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-gold-400" />
              {siteConfig.contact.email}
            </div>
          </div>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-ink text-xs font-semibold uppercase tracking-[0.22em] px-10 py-4 transition-all duration-300"
          >
            Get in touch
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}