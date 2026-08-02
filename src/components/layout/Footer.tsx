"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, Lock, Instagram, Facebook, Twitter, Phone, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.15v-3.44a4.85 4.85 0 01-2-.68V6.69h2z" />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-50 text-zinc-600 border-t border-gold-500/20 font-sans pt-16 pb-8 dark:bg-zinc-950 dark:text-zinc-300">
      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 border-b border-zinc-200 pb-12 dark:border-zinc-800/80">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 mb-3 border border-gold-500/30">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-semibold text-zinc-900 dark:text-zinc-100">Nationwide Express Delivery</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Fast, insured delivery to all states across Nigeria</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 mb-3 border border-gold-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-semibold text-zinc-900 dark:text-zinc-100">100% Authentic Guarantee</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Sourced directly from certified perfumers</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 mb-3 border border-gold-500/30">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-semibold text-zinc-900 dark:text-zinc-100">Hassle-Free Returns</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">7-day return policy for unopened items</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 mb-3 border border-gold-500/30">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-semibold text-zinc-900 dark:text-zinc-100">Encrypted Checkout</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Bank-grade 256-bit SSL payment protection</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-widest text-gold-400">
              DEBBY&apos;S
            </span>
            <span className="text-[10px] tracking-[0.25em] text-zinc-400 uppercase">
              Fragrance · Luxury House
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Debby&apos;s Fragrance is Nigeria&apos;s premier destination for rare luxury perfumes, artisanal perfume oils, and bespoke signature scents. Crafted to leave an unforgettable impression.
          </p>
          <div className="flex space-x-4 pt-2">
            {siteConfig.socials.instagram && (
              <a href={siteConfig.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-100 rounded-full hover:text-gold-500 border border-zinc-200 transition-colors dark:bg-zinc-900 dark:hover:text-gold-400 dark:border-zinc-800">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {siteConfig.socials.facebook && (
              <a href={siteConfig.socials.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-100 rounded-full hover:text-gold-500 border border-zinc-200 transition-colors dark:bg-zinc-900 dark:hover:text-gold-400 dark:border-zinc-800">
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {siteConfig.socials.tiktok && (
              <a href={siteConfig.socials.tiktok} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-100 rounded-full hover:text-gold-500 border border-zinc-200 transition-colors dark:bg-zinc-900 dark:hover:text-gold-400 dark:border-zinc-800">
                <TikTokIcon className="w-4 h-4" />
              </a>
            )}
            {siteConfig.socials.whatsapp && (
              <a href={siteConfig.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-100 rounded-full hover:text-gold-500 border border-zinc-200 transition-colors dark:bg-zinc-900 dark:hover:text-gold-400 dark:border-zinc-800">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            )}
            {siteConfig.socials.twitter && (
              <a href={siteConfig.socials.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-100 rounded-full hover:text-gold-500 border border-zinc-200 transition-colors dark:bg-zinc-900 dark:hover:text-gold-400 dark:border-zinc-800">
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif font-semibold text-zinc-100 uppercase text-xs tracking-widest mb-4 text-gold-400">
            Explore Collection
          </h4>
          <ul className="space-y-2.5 text-xs text-zinc-500 dark:text-zinc-400">
            <li><Link href="/shop" className="hover:text-gold-500 transition-colors dark:hover:text-gold-400">All Perfumes</Link></li>
            <li><Link href="/shop?category=women" className="hover:text-gold-500 transition-colors dark:hover:text-gold-400">Women&apos;s Fragrances</Link></li>
            <li><Link href="/shop?category=men" className="hover:text-gold-500 transition-colors dark:hover:text-gold-400">Men&apos;s Cologne</Link></li>
            <li><Link href="/shop?category=unisex" className="hover:text-gold-500 transition-colors dark:hover:text-gold-400">Unisex Scents</Link></li>
            <li><Link href="/shop?family=oriental" className="hover:text-gold-500 transition-colors dark:hover:text-gold-400">Oud & Oriental Collection</Link></li>
            <li><Link href="/admin" className="hover:text-gold-500 text-gold-600 font-medium dark:hover:text-gold-300">⚙️ Admin Image Uploads</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-serif font-semibold text-zinc-100 uppercase text-xs tracking-widest mb-4 text-gold-400">
            Visit Our Boutique
          </h4>
          <ul className="space-y-3 text-xs text-zinc-500 dark:text-zinc-400">
            <li className="flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
              <span>{siteConfig.location.shopAddress}</span>
            </li>
            <li className="flex items-center space-x-2.5">
              <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>{siteConfig.contact.phone}</span>
            </li>
            <li className="flex items-center space-x-2.5">
              <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>{siteConfig.contact.email}</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-serif font-semibold text-zinc-100 uppercase text-xs tracking-widest mb-4 text-gold-400">
            The Fragrance Club
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
            Subscribe to receive private invitations to new scent launches, exclusive sampling events, and VIP offers.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full bg-white border border-zinc-300 rounded px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-gold-500 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 font-bold text-xs py-2 rounded uppercase tracking-wider transition-all"
            >
              Join VIP List
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-zinc-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 space-y-2 sm:space-y-0 dark:border-zinc-900 dark:text-zinc-500">
        <p>© 2026 Debby&apos;s Fragrance Limited. All rights reserved.</p>
        <div className="flex space-x-4">
          <Link href="#" className="hover:text-zinc-700 dark:hover:text-zinc-300">Privacy Policy</Link>
          <Link href="#" className="hover:text-zinc-700 dark:hover:text-zinc-300">Terms of Service</Link>
          <Link href="#" className="hover:text-zinc-700 dark:hover:text-zinc-300">Shipping Info</Link>
        </div>
      </div>
    </footer>
  );
};
