"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="space-y-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-20 h-20 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto"
          >
            <Search className="w-8 h-8 text-gold-400" />
          </motion.div>

          <h1 className="font-serif text-6xl font-bold text-gold-400">404</h1>
          <p className="font-serif text-xl font-bold text-zinc-100">
            This Scent Has Vanished
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s guide you back to our collection.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 hover:brightness-110 text-zinc-950 font-bold text-xs px-8 py-4 rounded-xl uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-xl shadow-gold-950/50"
          >
            <span>Return Home</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-xs px-8 py-4 rounded-xl uppercase tracking-widest transition-all backdrop-blur-md"
          >
            Browse All Fragrances
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
