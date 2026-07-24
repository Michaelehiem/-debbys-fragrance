"use client";

import React, { useState, useMemo } from "react";
import { INITIAL_PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductListCard } from "@/components/product/ProductListCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { Product, GenderCategory, FragranceFamily } from "@/types";
import { formatNaira } from "@/lib/utils";
import { Filter, Grid, List, SlidersHorizontal, Search, RotateCcw } from "lucide-react";

export default function ShopPage() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<GenderCategory | "all">("all");
  const [selectedFamily, setSelectedFamily] = useState<FragranceFamily | "all">("all");
  const [maxPrice, setMaxPrice] = useState<number>(200000);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating" | "newest">("featured");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((product) => {
      // Category Filter
      if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
      // Family Filter
      if (selectedFamily !== "all" && product.fragranceFamily !== selectedFamily) return false;
      // Price Filter
      if (product.sizes[0].price > maxPrice) return false;
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchBrand = product.brand.toLowerCase().includes(q);
        const matchFamily = product.fragranceFamily.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchFamily) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.sizes[0].price - b.sizes[0].price;
      if (sortBy === "price-desc") return b.sizes[0].price - a.sizes[0].price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest") return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [selectedCategory, selectedFamily, maxPrice, sortBy, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedFamily("all");
    setMaxPrice(200000);
    setSortBy("featured");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-zinc-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-100">
              The Perfume Boutique
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Showing {filteredProducts.length} luxury formulations available in Nigeria
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search scent notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-gold-500"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-3" />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-gold-500"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">New Arrivals</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-zinc-800 rounded-lg bg-zinc-900 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded ${viewMode === "grid" ? "bg-gold-500/20 text-gold-400" : "text-zinc-400"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded ${viewMode === "list" ? "bg-gold-500/20 text-gold-400" : "text-zinc-400"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid & Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="space-y-6 bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800/80 h-fit">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2 text-gold-400 font-serif font-bold text-sm">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filter Collection</span>
              </div>
              <button
                onClick={resetFilters}
                className="text-[11px] text-zinc-500 hover:text-gold-400 flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Gender Category */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                Category
              </label>
              <div className="space-y-1 text-xs">
                {(["all", "women", "men", "unisex"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg capitalize transition-colors ${
                      selectedCategory === cat
                        ? "bg-gold-500/20 text-gold-300 font-bold border border-gold-500/30"
                        : "text-zinc-400 hover:bg-zinc-800"
                    }`}
                  >
                    {cat === "all" ? "All Categories" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Fragrance Family */}
            <div className="space-y-2 pt-4 border-t border-zinc-800">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                Fragrance Family
              </label>
              <div className="space-y-1 text-xs">
                {(["all", "floral", "woody", "oriental", "fresh", "citrus", "gourmand"] as const).map((fam) => (
                  <button
                    key={fam}
                    onClick={() => setSelectedFamily(fam)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg capitalize transition-colors ${
                      selectedFamily === fam
                        ? "bg-gold-500/20 text-gold-300 font-bold border border-gold-500/30"
                        : "text-zinc-400 hover:bg-zinc-800"
                    }`}
                  >
                    {fam === "all" ? "All Families" : fam}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold uppercase tracking-wider text-zinc-400">
                  Max Price
                </label>
                <span className="text-gold-400 font-bold">{formatNaira(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={30000}
                max={200000}
                step={5000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-gold-500 bg-zinc-800 h-1.5 rounded-lg"
              />
            </div>
          </div>

          {/* Product Grid / List Display */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filteredProducts.map((product) =>
                  viewMode === "grid" ? (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  ) : (
                    <ProductListCard
                      key={product.id}
                      product={product}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  )
                )}
              </div>
            ) : (
              <div className="py-24 text-center bg-zinc-900/40 rounded-2xl border border-zinc-800 space-y-4">
                <p className="text-zinc-400 text-sm">No perfumes match your selected filters.</p>
                <button
                  onClick={resetFilters}
                  className="bg-gold-600 hover:bg-gold-500 text-zinc-950 font-bold text-xs px-6 py-2.5 rounded-lg uppercase tracking-wider"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
