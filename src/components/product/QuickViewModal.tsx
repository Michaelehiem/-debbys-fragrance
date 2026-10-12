"use client";

import React, { useState, useEffect } from "react";
import { Product, ProductSize } from "@/types";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { X, Star, ShoppingBag, Check } from "lucide-react";
import { formatNaira } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  return (
    <AnimatePresence>
      {product && [
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
          onClick={onClose}
        />,
        <motion.div
          key="card"
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[51] overflow-y-auto flex items-center justify-center p-4 pointer-events-none"
        >
          <QuickViewModalContent key={product.id} product={product} onClose={onClose} />
        </motion.div>,
      ]}
    </AnimatePresence>
  );
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
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white shadow-editorial pointer-events-auto"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-ink text-paper hover:bg-gold-600 transition-colors"
        aria-label="Close quick view"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Gallery */}
        <div className="p-6 sm:p-8 bg-[#f1eadb] flex flex-col">
          <div className="aspect-square w-full overflow-hidden bg-white">
            <img
              src={selectedImage || displayImage}
              alt={displayName}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="flex gap-2 mt-5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedImage(displayImage)}
              className={`w-16 h-16 overflow-hidden border-2 flex-shrink-0 transition-all ${
                selectedImage === displayImage ? "border-gold-600" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={displayImage} alt="Main" className="object-cover w-full h-full" />
            </button>
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 overflow-hidden border-2 flex-shrink-0 transition-all ${
                  selectedImage === img ? "border-gold-600" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Thumb ${idx}`} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-baseline text-[10px] uppercase tracking-[0.2em] text-gold-700">
              <span>{product.brand}</span>
              <span className="flex items-center gap-1 font-serif text-ink tracking-normal normal-case text-sm">
                <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
                {product.rating} <span className="text-ink-soft/50">({product.reviewCount})</span>
              </span>
            </div>

            <h2 className="font-serif text-3xl font-bold text-ink mt-2 leading-tight">
              {displayName}
            </h2>
            <p className="text-sm italic text-gold-700 mt-1">&ldquo;{product.tagline}&rdquo;</p>

            <div className="mt-4">
              <span className="font-serif text-3xl font-bold text-ink">
                {formatNaira(override?.customPrice ? override.customPrice : selectedSize.price)}
              </span>
            </div>

            <p className="text-sm text-ink-soft/80 leading-relaxed mt-4">
              {product.description}
            </p>

            {/* Fragrance Notes */}
            <div className="mt-6 grid grid-cols-3 gap-px bg-ink/10 border border-ink/10 text-xs">
              {[
                ["Top", product.topNotes],
                ["Heart", product.heartNotes],
                ["Base", product.baseNotes],
              ].map(([label, notes]) => (
                <div key={label as string} className="bg-white p-3.5">
                  <span className="text-gold-700 font-semibold uppercase text-[9px] tracking-[0.18em] block mb-1">
                    {label}
                  </span>
                  <span className="text-ink-soft/80">{(notes as string[]).join(", ")}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-5 pt-6 border-t border-ink/10">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-ink-soft/70 block mb-2">
                Select Bottle Size
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    onClick={() => setSelectedSize(s)}
                    className={`py-3 text-xs font-semibold border transition-all ${
                      selectedSize.size === s.size
                        ? "border-gold-600 bg-gold-600 text-paper"
                        : "border-ink/15 text-ink-soft hover:border-ink"
                    }`}
                  >
                    <div>{s.size}</div>
                    <div className={`text-[10px] font-normal mt-0.5 ${selectedSize.size === s.size ? "text-paper/80" : "text-ink-soft/60"}`}>
                      {formatNaira(s.price)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-4 text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-center gap-2 border transition-all duration-300 ${
                isAdded
                  ? "bg-[#2d4a3e] border-[#2d4a3e] text-white"
                  : "bg-ink border-ink text-paper hover:bg-gold-700 hover:border-gold-700"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  Added to Bag
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Add to Bag · {formatNaira(selectedSize.price)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}