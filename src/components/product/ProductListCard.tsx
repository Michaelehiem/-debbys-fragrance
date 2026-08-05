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
    <div className="group bg-white border border-zinc-200 hover:border-gold-500/50 rounded-xl overflow-hidden transition-all duration-300 flex flex-col sm:flex-row hover:shadow-xl dark:bg-zinc-900/60 dark:border-zinc-800/80 dark:hover:shadow-gold-950/20">
      {/* Image */}
      <div className="relative w-full sm:w-48 h-48 sm:h-auto overflow-hidden bg-zinc-100 flex-shrink-0 dark:bg-zinc-950">
        <img
          src={displayImage}
          alt={displayName}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1 z-10">
          {product.isBestSeller && (
            <span className="bg-gradient-to-r from-gold-600 to-gold-400 text-zinc-950 font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-zinc-800 text-zinc-100 font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow">
              New
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-4 font-sans">
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs text-gold-500 font-medium tracking-wide uppercase">
            <span>{product.brand}</span>
            <div className="flex items-center space-x-1 text-zinc-400">
              <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
              <span>{product.rating}</span>
              <span className="text-zinc-500">({product.reviewCount})</span>
            </div>
          </div>

          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-serif text-lg font-bold text-zinc-900 group-hover:text-gold-600 transition-colors dark:text-zinc-100 dark:group-hover:text-gold-300">
              {displayName}
            </h3>
          </Link>

          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed dark:text-zinc-400">
            {product.description}
          </p>
        </div>

        {/* Bottom: Sizes + Price + CTA */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800/60">
          {/* Size chips */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] text-zinc-500 mr-1">Size:</span>
            {product.sizes.map((s) => (
              <button
                key={s.size}
                onClick={() => setSelectedSize(s)}
                className={`text-[10px] px-2.5 py-1 rounded border transition-all ${
                  selectedSize.size === s.size
                    ? "bg-gold-500/20 border-gold-500 text-gold-700 font-bold dark:text-gold-300"
                    : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700"
                }`}
              >
                {s.size}
              </button>
            ))}
          </div>

          {/* Price + Actions */}
          <div className="flex items-center space-x-3">
            <div>
              <span className="text-lg font-bold text-gold-600 font-serif dark:text-gold-400">
                {formatNaira(
                  override?.customPrice ? override.customPrice : selectedSize.price
                )}
              </span>
              {selectedSize.originalPrice && !override?.customPrice && (
                <span className="text-xs text-zinc-500 line-through ml-2">
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
                className="p-1 bg-white border border-zinc-200 rounded-lg text-zinc-500 hover:text-gold-600 hover:border-gold-500/50 transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-gold-400"
                aria-label="Quick View"
              >
                <Eye className="w-3 h-3" />
              </button>
            )}

            <button
              onClick={handleAddToCart}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all ${
                isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 shadow-md shadow-gold-950/40"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-2.5 h-2.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-2.5 h-2.5" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
