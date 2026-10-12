"use client";

import React from "react";
import Link from "next/link";
import { Truck, ShieldCheck, RotateCcw, Lock, Instagram, Facebook, Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.15v-3.44a4.85 4.85 0 01-2-.68V6.69h2z" />
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const trustItems = [
  { icon: Truck, title: "Nationwide Delivery", text: "Insured delivery across Nigeria" },
  { icon: ShieldCheck, title: "100% Authentic", text: "Sourced from certified perfumers" },
  { icon: RotateCcw, title: "Easy Returns", text: "7-day return policy, unopened" },
  { icon: Lock, title: "Secure Checkout", text: "Order safely via WhatsApp" },
];

export const Footer: React.FC = () => {
  const socials = [
    { href: siteConfig.socials.instagram, icon: Instagram, label: "Instagram" },
    { href: siteConfig.socials.facebook, icon: Facebook, label: "Facebook" },
    { href: siteConfig.socials.tiktok, icon: TikTokIcon, label: "TikTok" },
    { href: siteConfig.socials.whatsapp, icon: WhatsAppIcon, label: "WhatsApp" },
  ].filter((s) => s.href);

  return (
    <footer className="bg-ink text-paper/70 font-sans">
      {/* Trust Strip */}
      <div className="border-b border-paper/10">
        <div className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12 py-14 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {trustItems.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col items-start gap-3">
              <Icon className="w-5 h-5 text-gold-400" />
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-paper">{title}</h4>
                <p className="text-xs mt-1 text-paper/50 leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Columns */}
      <div className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 py-16">
        {/* Brand */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex flex-col">
            <span className="font-serif text-3xl font-bold tracking-[0.24em] text-paper pl-[0.24em]">
              DEBBY&apos;S
            </span>
            <span className="text-[10px] tracking-[0.5em] text-gold-400 uppercase pl-[0.5em]">
              Fragrance
            </span>
          </div>
          <p className="text-sm leading-relaxed max-w-sm text-paper/60">
            {siteConfig.businessName} is Nigeria&apos;s destination for authentic luxury perfumes, artisanal perfume oils, and bespoke signature scents.
          </p>
          <div className="flex gap-2.5 pt-1">
            {socials.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 flex items-center justify-center border border-paper/15 text-paper/70 hover:text-ink hover:bg-gold-400 hover:border-gold-400 transition-all duration-300"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Explore */}
        <div className="lg:col-span-2">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400 mb-5">
            Explore
          </h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/shop" className="link-underline hover:text-paper transition-colors">All Perfumes</Link></li>
            <li><Link href="/shop?category=women" className="link-underline hover:text-paper transition-colors">Women&apos;s</Link></li>
            <li><Link href="/shop?category=men" className="link-underline hover:text-paper transition-colors">Men&apos;s</Link></li>
            <li><Link href="/shop?category=unisex" className="link-underline hover:text-paper transition-colors">Unisex</Link></li>
            <li><Link href="/shop?family=oriental" className="link-underline hover:text-paper transition-colors">Oud &amp; Oriental</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="lg:col-span-2">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400 mb-5">
            Boutique
          </h4>
          <ul className="space-y-3.5 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
              <span>{siteConfig.location.shopAddress}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>{siteConfig.contact.phone}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span className="break-all">{siteConfig.contact.email}</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="lg:col-span-3">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400 mb-5">
            The Fragrance Club
          </h4>
          <p className="text-sm mb-4 text-paper/60 leading-relaxed">
            New scent launches and private offers, delivered rarely and beautifully.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-transparent border-b border-paper/25 px-0 py-2 text-sm text-paper placeholder:text-paper/40 focus:outline-none focus:border-gold-400 transition-colors"
            />
            <button
              type="submit"
              className="w-full border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-ink text-[11px] font-semibold py-3 uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2"
            >
              Join The Liste
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-paper/10">
        <div className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] tracking-wide text-paper/40">
          <p>© 2026 {siteConfig.businessName}. Atelier of fine scent.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-gold-400 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-gold-400 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-gold-400 transition-colors">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
