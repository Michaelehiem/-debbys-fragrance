"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductListCard } from "@/components/product/ProductListCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { Product, GenderCategory, FragranceFamily } from "@/types";
import { formatNaira } from "@/lib/utils";
import { Grid, List, SlidersHorizontal, Search, RotateCcw, ArrowUpRight } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="w-8 h-8 border border-gold-600 border-t-transparent rounded-full animate-spin" />
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

  // Keep filters in sync with the URL so nav links (Women / Men / Unisex) apply immediately,
  // including when navigating between categories while already on /shop.
  useEffect(() => {
    setSelectedCategory((searchParams.get("category") as GenderCategory | "all") || "all");
    setSelectedFamily((searchParams.get("family") as FragranceFamily | "all") || "all");
  }, [searchParams]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating" | "newest">("featured");
  const [searchQuery, setSearchQuery] = useState("");

  const lowestPrice = (p: Product) =>
    p.sizes.length ? Math.min(...p.sizes.map((s) => s.price)) : 0;

  // Auto-fit the price slider to the live catalogue so newly added products are never hidden.
  const priceCeiling = useMemo(() => {
    const prices = allProducts.flatMap((p) => p.sizes.map((s) => s.price)).filter((n) => n > 0);
    const max = prices.length ? Math.max(...prices) : 200000;
    return Math.max(50000, Math.ceil(max / 5000) * 5000);
  }, [allProducts]);

  const sliderMax = maxPrice ?? priceCeiling;

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Category Filter
      if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
      // Family Filter
      if (selectedFamily !== "all" && product.fragranceFamily !== selectedFamily) return false;
      // Price Filter
      if (maxPrice !== null && lowestPrice(product) > maxPrice) return false;
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
      if (sortBy === "price-asc") return lowestPrice(a) - lowestPrice(b);
      if (sortBy === "price-desc") return lowestPrice(b) - lowestPrice(a);
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest") return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProducts, selectedCategory, selectedFamily, maxPrice, sortBy, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedFamily("all");
    setMaxPrice(null);
    setSortBy("featured");
    setSearchQuery("");
  };

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "women", label: "Women" },
    { value: "men", label: "Men" },
    { value: "unisex", label: "Unisex" },
  ] as const;

  const families = [
    { value: "all", label: "All Families" },
    { value: "floral", label: "Floral" },
    { value: "woody", label: "Woody" },
    { value: "oriental", label: "Oriental / Oud" },
    { value: "fresh", label: "Fresh" },
    { value: "citrus", label: "Citrus" },
    { value: "gourmand", label: "Gourmand" },
  ] as const;

  return (
    <div className="min-h-screen bg-paper text-ink py-12 sm:py-16 font-sans">
      <div className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12 space-y-10">
        {/* Header */}
        <div className="border-b border-ink/10 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <span className="section-num">The Edit</span>
            <h1 className="mt-3 font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink">
              The Perfume Boutique
            </h1>
            <p className="text-sm text-ink-soft mt-3">
              {filteredProducts.length} luxury {filteredProducts.length === 1 ? "formulation" : "formulations"} · nationwide delivery
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
                className="w-full bg-white border border-ink/15 px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/40 focus:outline-none focus:border-gold-600 transition-colors"
              />
              <Search className="w-4 h-4 text-ink-soft/50 absolute right-3 top-3" />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-white border border-ink/15 px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-gold-600 transition-colors cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">New Arrivals</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-ink/15 bg-white p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"}`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"}`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid & Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 xl:gap-14">
          {/* Filter Sidebar */}
          <aside
            className={`h-fit bg-white border border-ink/10 p-7 lg:block ${
              showFilters ? "block" : "hidden"
            }`}
          >
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <div className="flex items-center gap-2 text-gold-700 font-serif font-bold text-base">
                <SlidersHorizontal className="w-4 h-4" />
                Filter Collection
              </div>
              <button
                onClick={resetFilters}
                className="text-[10px] uppercase tracking-[0.18em] text-ink-soft/60 hover:text-gold-700 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Gender Category */}
            <div className="py-6 border-b border-ink/10">
              <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-soft/70 block mb-4">
                Category
              </label>
              <div className="space-y-1 text-sm">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`w-full text-left px-4 py-2.5 flex items-baseline justify-between gap-3 transition-all ${
                      selectedCategory === cat.value
                        ? "bg-ink text-paper font-medium"
                        : "text-ink-soft hover:bg-paper-deep/60 hover:text-ink"
                    }`}
                  >
                    <span>{cat.label}</span>
                    {selectedCategory === cat.value && <ArrowUpRight className="w-3.5 h-3.5 text-gold-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Fragrance Family */}
            <div className="py-6 border-b border-ink/10">
              <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-soft/70 block mb-4">
                Fragrance Family
              </label>
              <div className="space-y-1 text-sm">
                {families.map((fam) => (
                  <button
                    key={fam.value}
                    onClick={() => setSelectedFamily(fam.value)}
                    className={`w-full text-left px-4 py-2.5 flex items-baseline justify-between gap-3 transition-all ${
                      selectedFamily === fam.value
                        ? "bg-ink text-paper font-medium"
                        : "text-ink-soft hover:bg-paper-deep/60 hover:text-ink"
                    }`}
                  >
                    <span>{fam.label}</span>
                    {selectedFamily === fam.value && <ArrowUpRight className="w-3.5 h-3.5 text-gold-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="py-6">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-soft/70">
                  Max Price
                </label>
                <span className="font-serif font-bold text-gold-700 text-base">
                  {maxPrice === null ? "Any" : formatNaira(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min={30000}
                max={priceCeiling}
                step={5000}
                value={sliderMax}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-gold-600 bg-paper-deep h-1 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-ink-soft/50 mt-2">
                <span>₦30k</span>
                <span>{formatNaira(priceCeiling)}</span>
              </div>
            </div>
          </aside>

          {/* Product Grid / List Display */}
          <div className="lg:col-span-3">
            {/* Mobile Filters Toggle */}
            <div className="lg:hidden flex items-center justify-between mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 bg-white border border-ink/15 text-ink text-xs font-semibold uppercase tracking-[0.18em] px-5 py-3 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
              <span className="text-xs text-ink-soft/60">
                {filteredProducts.length} item{filteredProducts.length === 1 ? "" : "s"}
              </span>
            </div>

            {filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-7"
                    : "space-y-5"
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
              <div className="py-24 text-center bg-white/60 border border-ink/10 space-y-5">
                <p className="text-ink-soft text-sm">No perfumes match your selected filters.</p>
                <button
                  onClick={resetFilters}
                  className="inline-block bg-ink hover:bg-gold-700 text-paper text-xs font-semibold px-8 py-3.5 uppercase tracking-[0.2em] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}