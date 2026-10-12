"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ArrowRight, ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper text-ink flex items-center justify-center px-4 py-24 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="space-y-5">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-20 h-20 mx-auto flex items-center justify-center border border-gold-600/40 bg-white"
          >
            <Search className="w-8 h-8 text-gold-700" />
          </motion.div>

          <h1 className="font-serif text-7xl font-bold text-gold-700 leading-none">
            404
          </h1>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-ink">
              This scent has vanished
            </h2>
            <p className="text-sm text-ink-soft leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
              Let&apos;s guide you back to the collection.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="group w-full sm:w-auto bg-ink hover:bg-gold-700 text-paper text-xs font-semibold uppercase tracking-[0.22em] px-8 py-4 transition-colors flex items-center justify-center gap-2"
          >
            Return home
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/shop"
            className="group w-full sm:w-auto border border-ink/20 text-ink hover:border-gold-700 hover:text-gold-700 text-xs font-semibold uppercase tracking-[0.22em] px-8 py-4 transition-colors flex items-center justify-center gap-2"
          >
            Browse all fragrances
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}