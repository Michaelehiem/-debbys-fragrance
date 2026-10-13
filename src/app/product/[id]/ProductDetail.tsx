"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { useReviews } from "@/context/ReviewContext";
import { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";
import { ImageZoom } from "@/components/ui/ImageZoom";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { absoluteUrl } from "@/lib/site";
import { formatNaira } from "@/lib/utils";
import { Star, ShoppingBag, ShieldCheck, Truck, Check, Share2, ChevronRight, Facebook, Twitter, Link as LinkIcon, MessageCircle, ArrowRight } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const { addToCart } = useCart();
  const { overrides, allProducts } = useAdmin();
  const { getProductReviews, addReview, getAverageRating } = useReviews();

  const product = allProducts.find((p) => p.id === productId) || allProducts[0];

  const override = overrides[product.id];
  const displayImage = override?.customImage || product.images[0];
  const displayName = override?.customName || product.name;

  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [activeImage, setActiveImage] = useState(displayImage);
  const [isAdded, setIsAdded] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Review states
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const productReviews = getProductReviews(product.id);
  const avgUserRating = getAverageRating(product.id);

  useEffect(() => {
    setActiveImage(displayImage);
    setSelectedSize(product.sizes[0]);
    setIsAdded(false);
    setShareOpen(false);
    setCopied(false);
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    addReview(product.id, {
      userName: reviewName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      verified: false,
    });
    setReviewSubmitted(true);
    setReviewName("");
    setReviewRating(5);
    setReviewComment("");
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  const related = allProducts.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.fragranceFamily === product.fragranceFamily)
  ).slice(0, 4);

  const productUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      <div className="min-h-screen bg-paper text-ink py-10 sm:py-14 font-sans">
        <div className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12 space-y-16">
          <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: displayName,
            description: product.description,
            brand: { "@type": "Brand", name: product.brand },
            sku: product.id,
            category: product.fragranceFamily,
            image: product.images.map((src) =>
              src.startsWith("http") ? src : absoluteUrl(src)
            ),
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "NGN",
              lowPrice: Math.min(...product.sizes.map((s) => s.price)),
              highPrice: Math.max(...product.sizes.map((s) => s.price)),
              offerCount: product.sizes.length,
              availability:
                product.stock > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              url: absoluteUrl(`/product/${product.id}`),
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.reviewCount,
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl("/shop") },
              {
                "@type": "ListItem",
                position: 3,
                name: displayName,
                item: absoluteUrl(`/product/${product.id}`),
              },
            ],
          },
        ]}
      />

      {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-ink-soft/60">
            <Link href="/" className="hover:text-gold-700 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-ink-soft/30" />
            <Link href="/shop" className="hover:text-gold-700 transition-colors">Shop</Link>
            <ChevronRight className="w-3 h-3 text-ink-soft/30" />
            <span className="text-gold-700 font-semibold">{displayName}</span>
          </nav>

          {/* Main Product Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Gallery */}
            <ScrollReveal className="space-y-5 lg:sticky lg:top-32">
              <div className="aspect-square w-full overflow-hidden bg-[#efe7d8] border border-ink/10 relative">
                <ImageZoom
                  src={activeImage || displayImage}
                  alt={displayName}
                  className="w-full h-full"
                />
              </div>

              {/* Thumbnail Selector */}
              <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => setActiveImage(displayImage)}
                  className={`w-20 h-20 overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImage === displayImage ? "border-gold-600" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={displayImage} alt="Main" className="object-cover w-full h-full" />
                </button>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeImage === img ? "border-gold-600" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            </ScrollReveal>

            {/* Product Info */}
            <ScrollReveal delay={0.1} className="space-y-7">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.2em] text-gold-700">
                  <span>{product.brand} · <span className="text-ink-soft/60">{product.fragranceFamily}</span></span>
                  <div className="flex items-center gap-1.5 font-serif text-ink tracking-normal normal-case text-sm">
                    <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
                    <span className="font-bold text-ink">{product.rating}</span>
                    <span className="text-ink-soft/50">({product.reviewCount} reviews)</span>
                  </div>
                </div>

                <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-bold text-ink leading-[1.05]">
                  {displayName}
                </h1>
                <p className="mt-3 italic text-lg text-gold-700">&ldquo;{product.tagline}&rdquo;</p>

                <div className="mt-6 flex items-baseline gap-4">
                  <span className="font-serif text-4xl font-bold text-ink">
                    {formatNaira(override?.customPrice ? override.customPrice : selectedSize.price)}
                  </span>
                  {selectedSize.originalPrice && !override?.customPrice && (
                    <span className="text-base text-ink-soft/50 line-through">
                      {formatNaira(selectedSize.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-ink-soft/85 leading-[1.9] border-y border-ink/10 py-5">
                {product.description}
              </p>

              {/* Size Picker */}
              <div className="space-y-3">
                <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-soft/70 block">
                  Select Bottle Volume
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {product.sizes.map((s) => (
                    <button
                      key={s.size}
                      onClick={() => setSelectedSize(s)}
                      className={`py-4 px-4 border text-left transition-all ${
                        selectedSize.size === s.size
                          ? "border-gold-600 bg-gold-600 text-paper"
                          : "border-ink/15 bg-white text-ink-soft hover:border-ink"
                      }`}
                    >
                      <div className="font-serif text-lg font-bold">{s.size}</div>
                      <div className={`text-xs mt-1 ${selectedSize.size === s.size ? "text-paper/80" : "text-gold-700"}`}>
                        {formatNaira(s.price)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* CTAs + Share */}
              <div className="space-y-5 pt-2">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className={`w-full py-5 text-xs font-semibold uppercase tracking-[0.24em] flex items-center justify-center gap-3 transition-all duration-300 ${
                    isAdded
                      ? "bg-[#2d4a3e] text-white"
                      : "bg-ink text-paper hover:bg-gold-700"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      Added To Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      Add To Bag · {formatNaira(selectedSize.price)}
                    </>
                  )}
                </motion.button>

                {/* Share Buttons */}
                <div className="relative">
                  <button
                    onClick={() => setShareOpen(!shareOpen)}
                    className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-ink-soft/70 hover:text-gold-700 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share this fragrance
                  </button>

                  <AnimatePresence>
                    {shareOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="flex items-center gap-2 mt-3"
                      >
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 flex items-center justify-center bg-white border border-ink/15 text-ink-soft hover:text-[#1877f2] hover:border-[#1877f2]/50 transition-all"
                          aria-label="Share on Facebook"
                        >
                          <Facebook className="w-4 h-4" />
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${displayName} from Debby's Fragrance!`)}&url=${encodeURIComponent(productUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 flex items-center justify-center bg-white border border-ink/15 text-ink-soft hover:text-sky-600 hover:border-sky-600/50 transition-all"
                          aria-label="Share on Twitter"
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`Check out ${displayName} from Debby's Fragrance! ${productUrl}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 flex items-center justify-center bg-white border border-ink/15 text-ink-soft hover:text-[#25d366] hover:border-[#25d366]/50 transition-all"
                          aria-label="Share on WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <button
                          onClick={handleCopyLink}
                          className="w-9 h-9 flex items-center justify-center bg-white border border-ink/15 text-ink-soft hover:text-gold-700 hover:border-gold-600/50 transition-all"
                          aria-label="Copy link"
                        >
                          {copied ? <Check className="w-4 h-4 text-[#2d4a3e]" /> : <LinkIcon className="w-4 h-4" />}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Fragrance Notes Breakdown */}
              <div className="border border-ink/10 bg-white p-6 sm:p-7">
                <h3 className="font-serif text-lg font-bold text-ink uppercase tracking-[0.12em]">
                  Olfactory notes
                </h3>
                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-px bg-ink/10 border border-ink/10">
                  <div className="bg-white p-4">
                    <span className="text-gold-700 font-semibold uppercase text-[9px] tracking-[0.2em] block mb-1.5">Top · 0–15 min</span>
                    <p className="text-sm text-ink-soft/85 leading-relaxed">{product.topNotes.join(", ")}</p>
                  </div>
                  <div className="bg-white p-4">
                    <span className="text-gold-700 font-semibold uppercase text-[9px] tracking-[0.2em] block mb-1.5">Heart · 2–4 hr</span>
                    <p className="text-sm text-ink-soft/85 leading-relaxed">{product.heartNotes.join(", ")}</p>
                  </div>
                  <div className="bg-white p-4">
                    <span className="text-gold-700 font-semibold uppercase text-[9px] tracking-[0.2em] block mb-1.5">Base · 6–24 hr</span>
                    <p className="text-sm text-ink-soft/85 leading-relaxed">{product.baseNotes.join(", ")}</p>
                  </div>
                </div>
              </div>

              {/* Delivery & Authenticity Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-ink-soft">
                <div className="flex items-center gap-3 border border-ink/10 bg-white px-5 py-4">
                  <Truck className="w-5 h-5 text-gold-600 flex-shrink-0" />
                  Nationwide delivery in 1&ndash;3 business days
                </div>
                <div className="flex items-center gap-3 border border-ink/10 bg-white px-5 py-4">
                  <ShieldCheck className="w-5 h-5 text-gold-600 flex-shrink-0" />
                  Certified authentic, hologram sealed
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* You May Also Like */}
          {related.length > 0 && (
            <ScrollReveal className="space-y-8 pt-14 border-t border-ink/10">
              <div className="flex items-end justify-between">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
                  You may also like
                </h2>
                <Link href="/shop" className="group hidden sm:inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink link-underline">
                  Shop all
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7">
                {related.map((relProduct) => (
                  <ProductCard key={relProduct.id} product={relProduct} />
                ))}
              </div>
            </ScrollReveal>
          )}

          {/* ── CUSTOMER REVIEWS SECTION ─────────────────── */}
          <ScrollReveal className="space-y-8 pt-14 border-t border-ink/10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
                  Customer reviews
                </h2>
                <p className="text-sm text-ink-soft mt-2">
                  {productReviews.length > 0
                    ? `${productReviews.length} review${productReviews.length !== 1 ? "s" : ""} · Average ${avgUserRating}/5`
                    : "No reviews yet. Be the first to share your experience!"}
                </p>
              </div>
              {avgUserRating > 0 && (
                <div className="flex items-center gap-3 bg-white border border-gold-600/40 px-5 py-3">
                  <Star className="w-5 h-5 text-gold-500 fill-gold-500" />
                  <span className="font-serif text-2xl font-bold text-gold-700">{avgUserRating}</span>
                  <span className="text-xs text-ink-soft/60">/ 5</span>
                </div>
              )}
            </div>

            {/* Existing Reviews */}
            {productReviews.length > 0 && (
              <div className="space-y-4">
                {[...productReviews].reverse().map((review) => (
                  <div
                    key={review.id}
                    className="bg-white border border-ink/10 p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold-500/15 border border-gold-600/40 text-gold-700 flex items-center justify-center font-serif font-bold">
                          {review.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ink">{review.userName}</p>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${s <= review.rating ? "text-gold-500 fill-gold-500" : "text-ink/15"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.14em] text-ink-soft/50">
                        {new Date(review.date).toLocaleDateString("en-NG", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-ink-soft/85 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Review Form */}
            <div className="bg-white border border-ink/10 p-6 sm:p-8 space-y-6">
              <h3 className="font-serif text-2xl font-bold text-ink">
                Write a review
              </h3>

              {reviewSubmitted ? (
                <div className="border border-[#7a9a80] bg-[#e9f0e9] p-4 text-xs font-medium text-[#2d4a3e] flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Thank you! Your review has been submitted.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.18em] text-ink-soft/70 block mb-2">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:outline-none focus:border-gold-600 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.18em] text-ink-soft/70 block mb-2">Your Rating *</label>
                      <div className="flex items-center gap-1 pt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setReviewRating(s)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-6 h-6 ${s <= reviewRating ? "text-gold-500 fill-gold-500" : "text-ink/20"}`}
                            />
                          </button>
                        ))}
                        <span className="text-xs text-ink-soft/60 ml-2">{reviewRating}/5</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.18em] text-ink-soft/70 block mb-2">Your Review *</label>
                    <textarea
                      rows={4}
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="How does it smell, how long does it last, where do you wear it?"
                      className="w-full border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:outline-none focus:border-gold-600 transition-colors leading-relaxed"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-ink hover:bg-gold-700 text-paper text-xs font-semibold uppercase tracking-[0.2em] px-8 py-4 transition-colors"
                  >
                    <Star className="w-4 h-4" />
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>
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
  product: Product;
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
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-paper/95 backdrop-blur-md border-t border-ink/10 p-4 shadow-[0_-12px_30px_-15px_rgba(27,23,18,0.4)]"
        >
          <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-ink-soft truncate">{override?.customName || product.name}</p>
              <p className="font-serif text-lg font-bold text-gold-700">
                {formatNaira(override?.customPrice ? override.customPrice : selectedSize.price)}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onAddToCart}
              className={`px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] flex items-center gap-2 transition-colors flex-shrink-0 ${
                isAdded ? "bg-[#2d4a3e] text-white" : "bg-ink text-paper"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Add to Bag
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}