"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { INITIAL_PRODUCTS } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAdmin } from "@/context/AdminContext";
import { ProductCard } from "@/components/product/ProductCard";
import { ImageZoom } from "@/components/ui/ImageZoom";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { formatNaira } from "@/lib/utils";
import { Star, ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, Check, Share2, ChevronRight, Facebook, Twitter, Link as LinkIcon, MessageCircle } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const product = INITIAL_PRODUCTS.find((p) => p.id === productId) || INITIAL_PRODUCTS[0];

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { overrides } = useAdmin();

  const override = overrides[product.id];
  const displayImage = override?.customImage || product.images[0];
  const displayName = override?.customName || product.name;

  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [activeImage, setActiveImage] = useState(displayImage);
  const [isAdded, setIsAdded] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setActiveImage(displayImage);
    setSelectedSize(product.sizes[0]);
    setIsAdded(false);
    setShareOpen(false);
    setCopied(false);
    window.scrollTo(0, 0);
  }, [productId]);

  const handleAddToCart = () => {
    const sizeToUse = override?.customPrice
      ? { ...selectedSize, price: override.customPrice }
      : selectedSize;

    addToCart(product, sizeToUse, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const related = INITIAL_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.fragranceFamily === product.fragranceFamily)
  ).slice(0, 4);

  const productUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: displayName,
            description: product.description,
            brand: { "@type": "Brand", name: product.brand },
            image: product.images,
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "NGN",
              lowPrice: product.sizes[0].price,
              highPrice: product.sizes[product.sizes.length - 1].price,
              availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.reviewCount,
            },
          }),
        }}
      />

      <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 font-sans space-y-16">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-xs text-zinc-400">
            <Link href="/" className="hover:text-gold-400">Home</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <Link href="/shop" className="hover:text-gold-400">Shop</Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-gold-400 font-semibold">{displayName}</span>
          </nav>

          {/* Main Product Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Gallery */}
            <ScrollReveal className="space-y-4">
              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-zinc-900 border border-gold-500/30 relative shadow-2xl">
                <ImageZoom
                  src={activeImage || displayImage}
                  alt={displayName}
                  className="w-full h-full"
                />
              </div>

              {/* Thumbnail Selector */}
              <div className="flex space-x-3 overflow-x-auto pb-2">
                <button
                  onClick={() => setActiveImage(displayImage)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImage === displayImage ? "border-gold-500" : "border-zinc-800 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={displayImage} alt="Main" className="object-cover w-full h-full" />
                </button>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImage === img ? "border-gold-500" : "border-zinc-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            </ScrollReveal>

            {/* Product Info */}
            <ScrollReveal delay={0.15} className="space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs text-gold-400 uppercase font-semibold tracking-widest">
                  <span>{product.brand} · {product.fragranceFamily}</span>
                  <div className="flex items-center space-x-1 text-zinc-400">
                    <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                    <span className="font-bold text-zinc-100">{product.rating}</span>
                    <span>({product.reviewCount} customer reviews)</span>
                  </div>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-100 mt-2">
                  {displayName}
                </h1>
                <p className="text-sm italic text-gold-300 mt-1">&quot;{product.tagline}&quot;</p>

                <div className="mt-4 flex items-baseline space-x-3">
                  <span className="text-3xl font-bold font-serif text-gold-400">
                    {formatNaira(
                      override?.customPrice ? override.customPrice : selectedSize.price
                    )}
                  </span>
                  {selectedSize.originalPrice && !override?.customPrice && (
                    <span className="text-sm text-zinc-500 line-through">
                      {formatNaira(selectedSize.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-b border-zinc-800 py-4">
                {product.description}
              </p>

              {/* Size Picker */}
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                  Select Bottle Volume
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {product.sizes.map((s) => (
                    <button
                      key={s.size}
                      onClick={() => setSelectedSize(s)}
                      className={`py-3 px-4 rounded-xl border text-left transition-all ${
                        selectedSize.size === s.size
                          ? "bg-gold-500/20 border-gold-500 text-gold-300 font-bold"
                          : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      <div className="text-sm">{s.size}</div>
                      <div className="text-xs text-gold-400 font-semibold">{formatNaira(s.price)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* CTAs + Share */}
              <div className="space-y-3 pt-2">
                <div className="flex space-x-4">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddToCart}
                    className={`flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center space-x-2 transition-all ${
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 hover:brightness-110 text-zinc-950 shadow-xl shadow-gold-950/40"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added To Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add To Bag · {formatNaira(selectedSize.price)}</span>
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-4 rounded-xl border transition-all ${
                      isInWishlist(product.id)
                        ? "bg-rose-600 text-white border-rose-600"
                        : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-rose-400"
                    }`}
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </motion.button>
                </div>

                {/* Share Buttons */}
                <div className="relative">
                  <button
                    onClick={() => setShareOpen(!shareOpen)}
                    className="flex items-center space-x-2 text-xs text-zinc-400 hover:text-gold-400 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share this fragrance</span>
                  </button>

                  <AnimatePresence>
                    {shareOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="flex items-center space-x-2 mt-2"
                      >
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-blue-400 hover:border-blue-500/50 transition-all"
                          aria-label="Share on Facebook"
                        >
                          <Facebook className="w-4 h-4" />
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${displayName} from Debby's Fragrance!`)}&url=${encodeURIComponent(productUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-sky-400 hover:border-sky-500/50 transition-all"
                          aria-label="Share on Twitter"
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`Check out ${displayName} from Debby's Fragrance! ${productUrl}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all"
                          aria-label="Share on WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <button
                          onClick={handleCopyLink}
                          className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-gold-400 hover:border-gold-500/50 transition-all"
                          aria-label="Copy link"
                        >
                          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <LinkIcon className="w-4 h-4" />}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Fragrance Notes Breakdown */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-serif text-base font-bold text-gold-400 uppercase tracking-wider">
                  Olfactory Notes Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                    <span className="text-gold-400 font-bold uppercase text-[10px] block mb-1">Top Notes (0-15 mins)</span>
                    <p className="text-zinc-300">{product.topNotes.join(", ")}</p>
                  </div>

                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                    <span className="text-gold-400 font-bold uppercase text-[10px] block mb-1">Heart Notes (2-4 hrs)</span>
                    <p className="text-zinc-300">{product.heartNotes.join(", ")}</p>
                  </div>

                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                    <span className="text-gold-400 font-bold uppercase text-[10px] block mb-1">Base Notes (6-24 hrs)</span>
                    <p className="text-zinc-300">{product.baseNotes.join(", ")}</p>
                  </div>
                </div>
              </div>

              {/* Delivery & Authenticity Highlights */}
              <div className="grid grid-cols-2 gap-4 text-xs text-zinc-400">
                <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <Truck className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <span>Fast Nationwide Delivery in Nigeria</span>
                </div>
                <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <ShieldCheck className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <span>100% Certified Authentic Product</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* You May Also Like */}
          {related.length > 0 && (
            <ScrollReveal className="space-y-6 pt-12 border-t border-zinc-800">
              <h2 className="font-serif text-2xl font-bold text-zinc-100">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((relProduct) => (
                  <ProductCard key={relProduct.id} product={relProduct} />
                ))}
              </div>
            </ScrollReveal>
          )}
        </div>

        {/* Sticky Mobile Add-to-Cart Bar */}
        <StickyMobileBar
          product={product}
          selectedSize={selectedSize}
          isAdded={isAdded}
          onAddToCart={handleAddToCart}
          override={override}
        />
      </div>
    </>
  );
}

function StickyMobileBar({
  product,
  selectedSize,
  isAdded,
  onAddToCart,
  override,
}: {
  product: (typeof INITIAL_PRODUCTS)[0];
  selectedSize: { size: string; price: number; originalPrice?: number };
  isAdded: boolean;
  onAddToCart: () => void;
  override?: { customPrice?: number; customImage?: string; customName?: string };
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-zinc-950/95 backdrop-blur-md border-t border-gold-500/30 p-4 shadow-2xl"
        >
          <div className="max-w-lg mx-auto flex items-center justify-between space-x-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-400 truncate">{override?.customName || product.name}</p>
              <p className="text-base font-bold font-serif text-gold-400">
                {formatNaira(override?.customPrice ? override.customPrice : selectedSize.price)}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onAddToCart}
              className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all flex-shrink-0 ${
                isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 text-zinc-950 shadow-lg"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
