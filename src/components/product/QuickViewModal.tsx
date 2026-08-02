"use client";

import React, { useState } from "react";
import { Product, ProductSize } from "@/types";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { X, Star, ShoppingBag, Check, ShieldCheck, Heart } from "lucide-react";
import { formatNaira } from "@/lib/utils";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  if (!product) return null;
  return <QuickViewModalContent key={product.id} product={product} onClose={onClose} />;
};

function QuickViewModalContent({ product, onClose }: QuickViewModalProps & { product: Product }) {
  const { addToCart } = useCart();
  const { overrides } = useAdmin();

  const override = overrides[product.id];
  const displayImage = override?.customImage || product.images[0];
  const displayName = override?.customName || product.name;
  const displayPrice = override?.customPrice || product.sizes[0].price;

  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.sizes[0]);
  const [selectedImage, setSelectedImage] = useState<string>(displayImage);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    const sizeToUse = override?.customPrice
      ? { ...selectedSize, price: override.customPrice }
      : selectedSize;

    addToCart(product, sizeToUse, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity dark:bg-zinc-950/80"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white border border-gold-500/30 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl z-10 animate-fade-in text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/10 text-zinc-500 hover:text-zinc-900 hover:bg-black/20 transition-colors dark:bg-zinc-950/60 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-950"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Gallery */}
          <div className="p-6 bg-zinc-50 flex flex-col justify-between dark:bg-zinc-950">
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-zinc-100 relative dark:bg-zinc-900">
              <img
                src={selectedImage || displayImage}
                alt={displayName}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Thumbnail selector */}
            <div className="flex space-x-2 mt-4 overflow-x-auto">
              <button
                onClick={() => setSelectedImage(displayImage)}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === displayImage ? "border-gold-500" : "border-zinc-800"
                }`}
              >
                <img src={displayImage} alt="Main" className="object-cover w-full h-full" />
              </button>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === img ? "border-gold-500" : "border-zinc-800"
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Details */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs text-gold-600 uppercase font-semibold dark:text-gold-400">
                <span>{product.brand}</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                  <span>
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <h2 className="font-serif text-2xl font-bold text-zinc-900 mt-1 dark:text-zinc-100">
                {displayName}
              </h2>
              <p className="text-xs italic text-gold-600 mt-0.5 dark:text-gold-300">&ldquo;{product.tagline}&rdquo;</p>

              <div className="mt-3">
                <span className="text-2xl font-bold font-serif text-gold-600 dark:text-gold-400">
                  {formatNaira(
                    override?.customPrice ? override.customPrice : selectedSize.price
                  )}
                </span>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed mt-3 dark:text-zinc-300">
                {product.description}
              </p>

              {/* Fragrance Notes */}
              <div className="mt-4 p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2 text-xs dark:bg-zinc-950/80 dark:border-zinc-800">
                <h4 className="font-semibold text-gold-600 uppercase text-[10px] tracking-wider dark:text-gold-400">
                  Fragrance Pyramid
                </h4>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-zinc-500 font-medium block">Top Notes</span>
                    <span className="text-zinc-600 dark:text-zinc-300">{product.topNotes.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-medium block">Heart Notes</span>
                    <span className="text-zinc-600 dark:text-zinc-300">{product.heartNotes.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-medium block">Base Notes</span>
                    <span className="text-zinc-600 dark:text-zinc-300">{product.baseNotes.join(", ")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Size & CTA */}
            <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div>
                <label className="text-xs text-zinc-500 block mb-1.5 font-medium dark:text-zinc-400">
                  Select Bottle Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s.size}
                      onClick={() => setSelectedSize(s)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        selectedSize.size === s.size
                          ? "bg-gold-500/20 border-gold-500 text-gold-700 dark:text-gold-300"
                          : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-700"
                      }`}
                    >
                      <div>{s.size}</div>
                      <div className="text-[10px] font-normal text-zinc-500 dark:text-zinc-400">
                        {formatNaira(s.price)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center space-x-2 transition-all ${
                  isAdded
                    ? "bg-emerald-600 text-white"
                    : "bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 hover:brightness-110 text-zinc-950 shadow-lg shadow-gold-950/40"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Shopping Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag · {formatNaira(selectedSize.price)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
