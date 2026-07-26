"use client";

import React, { useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useAdmin } from "@/context/AdminContext";
import { ProductCard } from "@/components/product/ProductCard";
import { User, Heart, Package, Settings, Lock } from "lucide-react";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "wishlist" | "orders">("wishlist");
  const { wishlist } = useWishlist();
  const { allProducts } = useAdmin();

  const savedProducts = allProducts.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Banner */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-16 h-16 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-400 flex items-center justify-center font-bold text-xl">
            ME
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h1 className="font-serif text-2xl font-bold text-zinc-100">Welcome Back, Valued Client</h1>
            <p className="text-xs text-zinc-400">client@debbysfragrance.com · Member of Fragrance VIP Club</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-800 text-xs font-semibold uppercase tracking-wider space-x-6">
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`pb-3 transition-all flex items-center space-x-2 ${
              activeTab === "wishlist"
                ? "border-b-2 border-gold-500 text-gold-400"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Wishlist ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 transition-all flex items-center space-x-2 ${
              activeTab === "orders"
                ? "border-b-2 border-gold-500 text-gold-400"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 transition-all flex items-center space-x-2 ${
              activeTab === "profile"
                ? "border-b-2 border-gold-500 text-gold-400"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Account Settings</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "wishlist" && (
          <div>
            {savedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {savedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-zinc-900/40 rounded-2xl border border-zinc-800 space-y-3">
                <Heart className="w-10 h-10 text-zinc-600 mx-auto" />
                <p className="text-xs text-zinc-400">Your wishlist is currently empty.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between text-xs">
              <div>
                <span className="text-gold-400 font-bold">#DF-2026-884</span>
                <p className="text-zinc-400">Placed on July 20, 2026 · 2 Items</p>
              </div>
              <span className="bg-emerald-950 text-emerald-400 px-3 py-1 rounded-full font-bold">
                Delivered
              </span>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-xl space-y-4 text-xs">
            <h3 className="font-serif text-lg font-bold text-zinc-100">Personal Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-zinc-400 mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue="Michael Ehiem"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue="michael@alphatnx.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-zinc-100"
                />
              </div>
              <button className="bg-gold-600 hover:bg-gold-500 text-zinc-950 font-bold px-6 py-2.5 rounded-xl uppercase tracking-wider">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
