"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product, ProductSize } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAdmin } from "@/context/AdminContext";
import { Heart, Eye, Star, ShoppingBag, Check } from "lucide-react";
import { formatNaira } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
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

  const isLiked = isInWishlist(product.id);

  return (
    <div className="group relative bg-white border border-zinc-200 hover:border-gold-500/50 rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-xl dark:bg-zinc-900/80 dark:border-zinc-800/80 dark:hover:shadow-gold-950/20">
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950">
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
          {override?.customImage && (
            <span className="bg-emerald-600 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow">
              Custom Upload
            </span>
          )}
        </div>

        {/* Action Overlay */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 z-10">
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow ${
              isLiked
                ? "bg-rose-600 text-white"
                : "bg-white/70 text-zinc-500 hover:text-rose-500 hover:bg-zinc-100 dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:text-rose-400 dark:hover:bg-zinc-900"
            }`}
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>

          {/* Quick View Button */}
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              className="p-2 rounded-full bg-white/70 text-zinc-500 hover:text-gold-600 hover:bg-zinc-100 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 shadow dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:text-gold-400 dark:hover:bg-zinc-900"
              aria-label="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 font-sans">
        <div>
          <div className="flex justify-between items-center text-xs text-gold-500 font-medium tracking-wide uppercase">
            <span>{product.brand}</span>
            <div className="flex items-center space-x-1 text-zinc-400">
              <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          <Link href={`/product/${product.id}`} className="block mt-1">
            <h3 className="font-serif text-base font-bold text-zinc-900 group-hover:text-gold-600 transition-colors line-clamp-1 dark:text-zinc-100 dark:group-hover:text-gold-300">
              {displayName}
            </h3>
          </Link>

          <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed dark:text-zinc-400">
            {product.description}
          </p>
        </div>

        {/* Size Selection */}
        <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800/60">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Select Size:</span>
            <div className="flex space-x-1">
              {product.sizes.map((s) => (
                <button
                  key={s.size}
                  onClick={() => setSelectedSize(s)}
                  className={`text-[10px] px-2 py-0.5 rounded border transition-all ${
                    selectedSize.size === s.size
                      ? "bg-gold-500/20 border-gold-500 text-gold-700 font-bold dark:text-gold-300"
                      : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700"
                  }`}
                >
                  {s.size}
                </button>
              ))}
            </div>
          </div>

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-base font-bold text-gold-600 font-serif dark:text-gold-400">
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

            <button
              onClick={handleAddToCart}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all ${
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
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
