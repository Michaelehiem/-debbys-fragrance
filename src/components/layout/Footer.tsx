"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, Lock, Instagram, Facebook, Twitter, Phone, Mail, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-300 border-t border-gold-500/20 font-sans pt-16 pb-8">
      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 border-b border-zinc-800/80 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 mb-3 border border-gold-500/30">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-semibold text-zinc-100">Nationwide Express Delivery</h4>
            <p className="text-xs text-zinc-400 mt-1">Fast, insured delivery to all states across Nigeria</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 mb-3 border border-gold-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-semibold text-zinc-100">100% Authentic Guarantee</h4>
            <p className="text-xs text-zinc-400 mt-1">Sourced directly from certified perfumers</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 mb-3 border border-gold-500/30">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-semibold text-zinc-100">Hassle-Free Returns</h4>
            <p className="text-xs text-zinc-400 mt-1">7-day return policy for unopened items</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 mb-3 border border-gold-500/30">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-semibold text-zinc-100">Encrypted Checkout</h4>
            <p className="text-xs text-zinc-400 mt-1">Bank-grade 256-bit SSL payment protection</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-widest text-gold-400">
              DEBBY'S
            </span>
            <span className="text-[10px] tracking-[0.25em] text-zinc-400 uppercase">
              Fragrance · Luxury House
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Debby's Fragrance is Nigeria's premier destination for rare luxury perfumes, artisanal perfume oils, and bespoke signature scents. Crafted to leave an unforgettable impression.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-900 rounded-full hover:text-gold-400 border border-zinc-800 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-900 rounded-full hover:text-gold-400 border border-zinc-800 transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-900 rounded-full hover:text-gold-400 border border-zinc-800 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif font-semibold text-zinc-100 uppercase text-xs tracking-widest mb-4 text-gold-400">
            Explore Collection
          </h4>
          <ul className="space-y-2.5 text-xs text-zinc-400">
            <li><Link href="/shop" className="hover:text-gold-400 transition-colors">All Perfumes</Link></li>
            <li><Link href="/shop?category=women" className="hover:text-gold-400 transition-colors">Women's Fragrances</Link></li>
            <li><Link href="/shop?category=men" className="hover:text-gold-400 transition-colors">Men's Cologne</Link></li>
            <li><Link href="/shop?category=unisex" className="hover:text-gold-400 transition-colors">Unisex Scents</Link></li>
            <li><Link href="/shop?family=oriental" className="hover:text-gold-400 transition-colors">Oud & Oriental Collection</Link></li>
            <li><Link href="/admin" className="hover:text-gold-300 text-gold-500 font-medium">⚙️ Admin Image Uploads</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-serif font-semibold text-zinc-100 uppercase text-xs tracking-widest mb-4 text-gold-400">
            Visit Our Boutique
          </h4>
          <ul className="space-y-3 text-xs text-zinc-400">
            <li className="flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
              <span>Shop K2, Phase 2 Market, Kubwa, Abuja, Nigeria</span>
            </li>
            <li className="flex items-center space-x-2.5">
              <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>+234 (0) 800 DEBBY SCENT</span>
            </li>
            <li className="flex items-center space-x-2.5">
              <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>concierge@debbysfragrance.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-serif font-semibold text-zinc-100 uppercase text-xs tracking-widest mb-4 text-gold-400">
            The Fragrance Club
          </h4>
          <p className="text-xs text-zinc-400 mb-3">
            Subscribe to receive private invitations to new scent launches, exclusive sampling events, and VIP offers.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-gold-500"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 space-y-2 sm:space-y-0">
        <p>© 2026 Debby's Fragrance Limited. All rights reserved.</p>
        <div className="flex space-x-4">
          <Link href="#" className="hover:text-zinc-300">Privacy Policy</Link>
          <Link href="#" className="hover:text-zinc-300">Terms of Service</Link>
          <Link href="#" className="hover:text-zinc-300">Shipping Info</Link>
        </div>
      </div>
    </footer>
  );
};
