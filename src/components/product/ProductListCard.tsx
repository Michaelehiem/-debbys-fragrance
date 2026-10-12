"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product, ProductSize } from "@/types";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { Star, ShoppingBag, Check, Eye } from "lucide-react";
import { formatNaira } from "@/lib/utils";

interface ProductListCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductListCard: React.FC<ProductListCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { overrides } = useAdmin();

  const override = overrides[product.id];
  const displayImage = override?.customImage || product.images[0];
  const displayName = override?.customName || product.name;

  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.sizes[0]);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const sizeToUse = override?.customPrice
      ? { ...selectedSize, price: override.customPrice }
      : selectedSize;

    addToCart(product, sizeToUse, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group bg-white border border-ink/10 transition-all duration-500 hover:border-gold-600/40 hover:shadow-editorial-sm flex flex-col sm:flex-row">
      {/* Image */}
      <div className="relative w-full sm:w-56 h-56 sm:h-auto shrink-0 overflow-hidden bg-[#efe7d8]">
        <img
          src={displayImage}
          alt={displayName}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-[1200ms] ease-out"
        />

        <div className="absolute top-4 left-4 flex flex-col items-start gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="bg-white/90 backdrop-blur-sm text-gold-800 font-semibold text-[9px] uppercase tracking-[0.18em] px-3 py-1 border border-gold-600/50">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-ink text-paper font-semibold text-[9px] uppercase tracking-[0.18em] px-3 py-1">
              New Arrival
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between gap-4">
        <div>
          <div className="flex justify-between items-baseline text-[10px] uppercase tracking-[0.18em] text-ink-soft/70">
            <span>{product.brand}</span>
            <span className="flex items-center gap-1 font-serif text-ink tracking-normal normal-case text-xs">
              <Star className="w-3 h-3 text-gold-500 fill-gold-500" />
              {product.rating} <span className="text-ink-soft/50">({product.reviewCount})</span>
            </span>
          </div>

          <Link href={`/product/${product.id}`} className="block mt-2">
            <h3 className="font-serif text-2xl font-bold text-ink group-hover:text-gold-700 transition-colors">
              {displayName}
            </h3>
          </Link>

          <p className="text-sm text-ink-soft/70 mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-4 border-t border-ink/10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.18em] text-ink-soft/60">Size</span>
            {product.sizes.map((s) => (
              <button
                key={s.size}
                onClick={() => setSelectedSize(s)}
                className={`text-[10px] px-2.5 py-1 border transition-all ${
                  selectedSize.size === s.size
                    ? "border-gold-600 bg-gold-600 text-paper font-semibold"
                    : "border-ink/15 text-ink-soft hover:border-ink"
                }`}
              >
                {s.size}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div>
              <span className="font-serif text-xl font-bold text-ink">
                {formatNaira(override?.customPrice ? override.customPrice : selectedSize.price)}
              </span>
              {selectedSize.originalPrice && !override?.customPrice && (
                <span className="text-xs text-ink-soft/50 line-through ml-2">
                  {formatNaira(selectedSize.originalPrice)}
                </span>
              )}
            </div>

            {onQuickView && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView(product);
                }}
                className="w-9 h-9 flex items-center justify-center border border-ink/15 text-ink-soft hover:text-ink hover:border-ink transition-all"
                aria-label="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleAddToCart}
              className={`px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] flex items-center gap-2 border transition-all duration-300 ${
                isAdded
                  ? "bg-[#2d4a3e] border-[#2d4a3e] text-white"
                  : "border-ink text-ink hover:bg-ink hover:text-paper"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Add to Bag
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};