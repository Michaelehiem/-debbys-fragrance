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

  return (
    <div className="group relative bg-white border border-ink/10 transition-all duration-500 flex flex-col justify-between hover:border-gold-600/40 hover:shadow-editorial-sm">
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#efe7d8]">
        <img
          src={displayImage}
          alt={displayName}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-[1200ms] ease-out"
        />

        {/* Badges */}
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
          {override?.customImage && (
            <span className="bg-[#2d4a3e] text-white font-semibold text-[9px] uppercase tracking-[0.18em] px-3 py-1">
              Custom
            </span>
          )}
        </div>

        {/* Quick View — slides up on hover */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onQuickView(product);
            }}
            className="absolute bottom-0 left-0 right-0 z-10 py-3 bg-ink/85 backdrop-blur-sm text-paper text-[10px] uppercase tracking-[0.24em] font-medium flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
            aria-label={`Quick view ${displayName}`}
          >
            <Eye className="w-3.5 h-3.5 text-gold-400" />
            Quick View
          </button>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="flex justify-between items-baseline text-[10px] uppercase tracking-[0.18em] text-ink-soft/70">
            <span>{product.brand}</span>
            <Rating value={product.rating} />
          </div>

          <Link href={`/product/${product.id}`} className="block mt-2">
            <h3 className="font-serif text-lg font-bold text-ink leading-snug group-hover:text-gold-700 transition-colors line-clamp-1">
              {displayName}
            </h3>
          </Link>

          <p className="text-xs text-ink-soft/70 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Size + Price + Add */}
        <div className="space-y-3.5 pt-4 border-t border-ink/10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.18em] text-ink-soft/60">Size</span>
            <div className="flex gap-1.5">
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
          </div>

          <div className="flex items-center justify-between">
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

            <button
              onClick={handleAddToCart}
              className={`px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] flex items-center gap-2 border transition-all duration-300 ${
                isAdded
                  ? "bg-[#2d4a3e] border-[#2d4a3e] text-white"
                  : "border-ink text-ink hover:bg-ink hover:text-paper"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3 h-3" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3 h-3" />
                  Add
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};