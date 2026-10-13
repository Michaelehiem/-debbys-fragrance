"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product, ProductSize } from "@/types";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { Eye, ShoppingBag, Check } from "lucide-react";
import { Rating } from "@/components/ui/Rating";
import { formatNaira } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { overrides } = useAdmin();

  // Check if Admin uploaded a custom image or details for this product!
  const override = overrides[product.id];
  const displayImage = override?.customImage || product.images[0];
  const displayName = override?.customName || product.name;
  const displayPrice = override?.customPrice || product.sizes[0].price;

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

  const activePrice = override?.customPrice ? override.customPrice : selectedSize.price;
  const showOriginal = selectedSize.originalPrice && !override?.customPrice;

  return (
    <article className="group relative flex h-full flex-col bg-white border border-ink/10 transition-all duration-500 hover:border-gold-600/40 hover:shadow-editorial-sm">
      {/* Image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#efe7d8]">
        <Link
          href={`/product/${product.id}`}
          aria-label={`View ${displayName}`}
          className="absolute inset-0 z-0 block"
        >
          <img
            src={displayImage}
            alt={displayName}
            loading="lazy"
            className="object-cover w-full h-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1.5">
          {product.isBestSeller && (
            <span className="bg-white/90 backdrop-blur-sm text-gold-800 font-semibold text-[9px] uppercase tracking-[0.18em] px-2.5 py-1 border border-gold-600/50">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-ink text-paper font-semibold text-[9px] uppercase tracking-[0.18em] px-2.5 py-1">
              New Arrival
            </span>
          )}
          {override?.customImage && (
            <span className="bg-[#2d4a3e] text-white font-semibold text-[9px] uppercase tracking-[0.18em] px-2.5 py-1">
              Custom
            </span>
          )}
        </div>

        {/* Quick View — slides up on hover (desktop) */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-0 left-0 right-0 z-10 py-2.5 bg-ink/85 backdrop-blur-sm text-paper text-[10px] uppercase tracking-[0.24em] font-medium flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 focus-visible:translate-y-0"
            aria-label={`Quick view ${displayName}`}
          >
            <Eye className="w-3.5 h-3.5 text-gold-400" />
            Quick View
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.16em] text-ink-soft/70">
          <span className="truncate">{product.brand}</span>
          <Rating value={product.rating} />
        </div>

        <Link href={`/product/${product.id}`} className="mt-2">
          <h3 className="font-serif text-base sm:text-lg font-semibold text-ink leading-snug line-clamp-1 group-hover:text-gold-700 transition-colors">
            {displayName}
          </h3>
        </Link>

        <p className="mt-1.5 text-[11px] sm:text-xs text-ink-soft/70 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Size selector — quiet segmented control */}
        <div
          role="group"
          aria-label="Choose size"
          className="mt-4 flex flex-wrap gap-1.5"
        >
          {product.sizes.map((s) => {
            const active = selectedSize.size === s.size;
            return (
              <button
                key={s.size}
                type="button"
                onClick={() => setSelectedSize(s)}
                aria-pressed={active}
                className={`text-[10px] font-medium tabular-nums px-2.5 py-1 transition-colors duration-200 ${
                  active
                    ? "bg-ink text-paper"
                    : "bg-paper-deep/70 text-ink-soft hover:bg-paper-deep"
                }`}
              >
                {s.size}
              </button>
            );
          })}
        </div>

        {/* Price + Add — pinned to the bottom for even cards */}
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div className="flex items-baseline gap-2 leading-none">
            <span className="font-serif text-lg sm:text-xl font-bold text-ink">
              {formatNaira(activePrice)}
            </span>
            {showOriginal && (
              <span className="text-[11px] text-ink-soft/50 line-through">
                {formatNaira(selectedSize.originalPrice as number)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            aria-label={isAdded ? `${displayName} added to cart` : `Add ${displayName} to cart`}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 ${
              isAdded
                ? "bg-[#2d4a3e] text-white"
                : "bg-ink text-paper hover:bg-gold-700"
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
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
