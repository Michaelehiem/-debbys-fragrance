"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product, ProductSize } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAdmin } from "@/context/AdminContext";
import { Heart, Star, ShoppingBag, Check, Eye } from "lucide-react";
import { formatNaira } from "@/lib/utils";

interface ProductListCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductListCard: React.FC<ProductListCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
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

  const isLiked = isInWishlist(product.id);

  return (
    <div className="group bg-zinc-900/60 border border-zinc-800/80 hover:border-gold-500/50 rounded-xl overflow-hidden transition-all duration-300 flex flex-col sm:flex-row hover:shadow-xl hover:shadow-gold-950/20">
      {/* Image */}
      <div className="relative w-full sm:w-48 h-48 sm:h-auto overflow-hidden bg-zinc-950 flex-shrink-0">
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
            <span className="bg-zinc-100 text-zinc-950 font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow">
              New
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow z-10 ${
            isLiked
              ? "bg-rose-600 text-white"
              : "bg-zinc-900/70 text-zinc-300 hover:text-rose-400 hover:bg-zinc-900"
          }`}
          aria-label="Wishlist"
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between space-y-3 font-sans">
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
            <h3 className="font-serif text-lg font-bold text-zinc-100 group-hover:text-gold-300 transition-colors">
              {displayName}
            </h3>
          </Link>

          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Bottom: Sizes + Price + CTA */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-3 border-t border-zinc-800/60">
          {/* Size chips */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] text-zinc-500 mr-1">Size:</span>
            {product.sizes.map((s) => (
              <button
                key={s.size}
                onClick={() => setSelectedSize(s)}
                className={`text-[10px] px-2 py-0.5 rounded border transition-all ${
                  selectedSize.size === s.size
                    ? "bg-gold-500/20 border-gold-500 text-gold-300 font-bold"
                    : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                {s.size}
              </button>
            ))}
          </div>

          {/* Price + Actions */}
          <div className="flex items-center space-x-3">
            <div>
              <span className="text-lg font-bold text-gold-400 font-serif">
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
                className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-gold-400 hover:border-gold-500/50 transition-all"
                aria-label="Quick View"
              >
                <Eye className="w-4 h-4" />
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
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
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
