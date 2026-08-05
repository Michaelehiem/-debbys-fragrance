"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductListCard } from "@/components/product/ProductListCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { Product, GenderCategory, FragranceFamily } from "@/types";
import { formatNaira } from "@/lib/utils";
import { Grid, List, SlidersHorizontal, Search, RotateCcw } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center dark:bg-zinc-950">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ShopPageContent />
    </Suspense>
  );
}

function ShopPageContent() {
  const searchParams = useSearchParams();
  const { allProducts } = useAdmin();

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Read initial filter values from URL query params
  const initialCategory = (searchParams.get("category") as GenderCategory | "all") || "all";
  const initialFamily = (searchParams.get("family") as FragranceFamily | "all") || "all";

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<GenderCategory | "all">(initialCategory);
  const [selectedFamily, setSelectedFamily] = useState<FragranceFamily | "all">(initialFamily);
  const [maxPrice, setMaxPrice] = useState<number>(200000);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating" | "newest">("featured");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
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
  }, [allProducts, selectedCategory, selectedFamily, maxPrice, sortBy, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedFamily("all");
    setMaxPrice(200000);
    setSortBy("featured");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 py-12 px-5 sm:px-6 lg:px-8 font-sans dark:bg-zinc-950 dark:text-zinc-100">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-zinc-200 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 dark:border-zinc-800">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
              The Perfume Boutique
            </h1>
            <p className="text-xs text-zinc-500 mt-1 dark:text-zinc-400">
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
                className="w-full bg-white border border-zinc-300 rounded-lg px-3.5 py-2 text-xs text-zinc-900 focus:outline-none focus:border-gold-500 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-3" />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-700 focus:outline-none focus:border-gold-500 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">New Arrivals</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-zinc-300 rounded-lg bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded ${viewMode === "grid" ? "bg-gold-500/20 text-gold-600 dark:text-gold-400" : "text-zinc-400"}`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded ${viewMode === "list" ? "bg-gold-500/20 text-gold-600 dark:text-gold-400" : "text-zinc-400"}`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid & Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div
            className={`space-y-6 bg-white p-6 rounded-2xl border border-zinc-200 h-fit shadow-sm dark:bg-zinc-900/60 dark:border-zinc-800/80 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
              <div className="flex items-center space-x-2 text-gold-600 font-serif font-bold text-sm dark:text-gold-400">
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
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block dark:text-zinc-400">
                Category
              </label>
              <div className="space-y-1 text-xs">
                {(["all", "women", "men", "unisex"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg capitalize transition-colors ${
                      selectedCategory === cat
                        ? "bg-gold-500/20 text-gold-700 font-bold border border-gold-500/30 dark:text-gold-300"
                        : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {cat === "all" ? "All Categories" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Fragrance Family */}
            <div className="space-y-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block dark:text-zinc-400">
                Fragrance Family
              </label>
              <div className="space-y-1 text-xs">
                {(["all", "floral", "woody", "oriental", "fresh", "citrus", "gourmand"] as const).map((fam) => (
                  <button
                    key={fam}
                    onClick={() => setSelectedFamily(fam)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg capitalize transition-colors ${
                      selectedFamily === fam
                        ? "bg-gold-500/20 text-gold-700 font-bold border border-gold-500/30 dark:text-gold-300"
                        : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {fam === "all" ? "All Families" : fam}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Max Price
                </label>
                <span className="text-gold-600 font-bold dark:text-gold-400">{formatNaira(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={30000}
                max={200000}
                step={5000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-gold-500 bg-zinc-200 h-1.5 rounded-lg dark:bg-zinc-800"
              />
            </div>
          </div>

          {/* Product Grid / List Display */}
          <div className="lg:col-span-3">
            {/* Mobile Filters Toggle */}
            <div className="lg:hidden flex items-center justify-between mb-5">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center space-x-2 bg-white border border-zinc-300 text-zinc-700 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
              </button>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {filteredProducts.length} item{filteredProducts.length === 1 ? "" : "s"}
              </span>
            </div>
            {filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 lg:grid-cols-3 gap-6"
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
              <div className="py-24 text-center bg-zinc-50/60 rounded-2xl border border-zinc-200 space-y-4 dark:bg-zinc-900/40 dark:border-zinc-800">
                <p className="text-zinc-500 text-sm dark:text-zinc-400">No perfumes match your selected filters.</p>
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
