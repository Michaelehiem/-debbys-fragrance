"use client";

import React, { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Product, GenderCategory, FragranceFamily } from "@/types";
import { formatNaira } from "@/lib/utils";
import {
  ShieldCheck, Plus, Trash2, X, Check, Upload, Save,
  ChevronDown, Package, Edit3, Image as ImageIcon, Star,
} from "lucide-react";
import Link from "next/link";
import { AdminGate } from "@/components/ui/AdminGate";

export default function AdminPage() {
  return (
    <AdminGate>
      <AdminPageContent />
    </AdminGate>
  );
}

type View = "list" | "add" | "edit";

function AdminPageContent() {
  const {
    allProducts, overrides, addProduct, deleteProduct,
    updateProduct, updateProductImage, resetProductOverride,
  } = useAdmin();

  const [view, setView] = useState<View>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [filterCategory, setFilterCategory] = useState<GenderCategory | "all">("all");

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const filteredProducts = filterCategory === "all"
    ? allProducts
    : allProducts.filter((p) => p.category === filterCategory);

  const selectedProduct = selectedId ? allProducts.find((p) => p.id === selectedId) : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-gold-500/40 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gold-400 font-semibold text-xs uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              <span>Debby&apos;s Fragrance Admin Portal</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-100">
              Product Manager
            </h1>
            <p className="text-xs text-zinc-400 max-w-xl">
              Add new perfumes, edit details, upload photos, set prices, and manage your entire catalogue.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link
              href="/shop"
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-4 py-2.5 rounded-lg border border-zinc-700 transition-all"
            >
              View Shop
            </Link>
          </div>
        </div>

        {/* Success */}
        {successMsg && (
          <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 p-4 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ── LIST VIEW ─────────────────────────────── */}
        {view === "list" && (
          <>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-gold-400" />
                <h2 className="font-serif text-xl font-bold">
                  All Products ({filteredProducts.length})
                </h2>
              </div>
              <div className="flex items-center space-x-3">
                {/* Category filter */}
                <div className="flex items-center border border-zinc-800 rounded-lg bg-zinc-900 p-1">
                  {(["all", "women", "men", "unisex"] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-all ${
                        filterCategory === cat
                          ? "bg-gold-500/20 text-gold-400"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {cat === "all" ? "All" : cat}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setView("add")}
                  className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 font-bold text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider flex items-center space-x-2 transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((prod) => {
                const ov = overrides[prod.id];
                const img = ov?.customImage || prod.images[0];
                const name = ov?.customName || prod.name;
                const price = ov?.customPrice || prod.sizes[0].price;

                return (
                  <div
                    key={prod.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all group"
                  >
                    <div className="aspect-[4/3] w-full bg-zinc-950 relative overflow-hidden">
                      <img
                        src={img}
                        alt={name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 flex flex-col space-y-1">
                        <span className="bg-zinc-950/80 backdrop-blur text-[9px] text-zinc-300 font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                          {prod.category}
                        </span>
                        <span className="bg-zinc-950/80 backdrop-blur text-[9px] text-zinc-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                          {prod.fragranceFamily}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-[10px] text-gold-500 font-semibold uppercase tracking-wider">
                          {prod.brand}
                        </p>
                        <h3 className="font-serif font-bold text-zinc-100 text-sm truncate">{name}</h3>
                        <p className="text-xs text-zinc-400 mt-0.5">{formatNaira(price)}</p>
                      </div>
                      <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                      <div className="flex items-center space-x-2 pt-1">
                        <button
                          onClick={() => {
                            setSelectedId(prod.id);
                            setView("edit");
                          }}
                          className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-[10px] font-bold px-3 py-2 rounded-lg uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${name}"? This cannot be undone.`)) {
                              deleteProduct(prod.id);
                              showSuccess(`Deleted "${name}"`);
                            }
                          }}
                          className="bg-rose-950/60 hover:bg-rose-900 text-rose-400 border border-rose-800 text-[10px] font-bold px-3 py-2 rounded-lg uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-20 text-center bg-zinc-900/40 rounded-2xl border border-zinc-800 space-y-4">
                <Package className="w-12 h-12 text-zinc-600 mx-auto" />
                <p className="text-zinc-400 text-sm">No products in this category yet.</p>
                <button
                  onClick={() => setView("add")}
                  className="bg-gold-600 hover:bg-gold-500 text-zinc-950 font-bold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider"
                >
                  Add First Product
                </button>
              </div>
            )}
          </>
        )}

        {/* ── ADD NEW PRODUCT ───────────────────────── */}
        {view === "add" && (
          <ProductForm
            mode="add"
            onCancel={() => setView("list")}
            onSave={(product) => {
              addProduct(product as Product);
              showSuccess(`"${product.name}" added to your catalogue!`);
              setView("list");
            }}
          />
        )}

        {/* ── EDIT PRODUCT ──────────────────────────── */}
        {view === "edit" && selectedProduct && (
          <ProductForm
            mode="edit"
            existing={selectedProduct}
            existingImage={overrides[selectedProduct.id]?.customImage}
            onCancel={() => { setView("list"); setSelectedId(null); }}
            onSave={(updates) => {
              updateProduct(selectedProduct.id, updates);
              showSuccess(`"${updates.name || selectedProduct.name}" updated!`);
              setView("list");
              setSelectedId(null);
            }}
            onUploadImage={(base64) => {
              updateProductImage(selectedProduct.id, base64);
              showSuccess(`Image updated for "${selectedProduct.name}"`);
            }}
            onResetImage={() => {
              resetProductOverride(selectedProduct.id);
              showSuccess(`Image restored to default for "${selectedProduct.name}"`);
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PRODUCT FORM — Used for both Add and Edit modes
   ═══════════════════════════════════════════════════════ */

interface ProductFormProps {
  mode: "add" | "edit";
  existing?: Product;
  existingImage?: string;
  onCancel: () => void;
  onSave: (data: Partial<Product> & { name?: string }) => void;
  onUploadImage?: (base64: string) => void;
  onResetImage?: () => void;
}

function ProductForm({
  mode, existing, existingImage, onCancel, onSave, onUploadImage, onResetImage,
}: ProductFormProps) {
  const [name, setName] = useState(existing?.name || "");
  const [brand, setBrand] = useState(existing?.brand || "");
  const [tagline, setTagline] = useState(existing?.tagline || "");
  const [description, setDescription] = useState(existing?.description || "");
  const [category, setCategory] = useState<GenderCategory>(existing?.category || "women");
  const [fragranceFamily, setFragranceFamily] = useState<FragranceFamily>(existing?.fragranceFamily || "floral");
  const [price30, setPrice30] = useState(existing?.sizes.find((s) => s.size === "30ml")?.price.toString() || "");
  const [price50, setPrice50] = useState(existing?.sizes.find((s) => s.size === "50ml")?.price.toString() || "");
  const [price100, setPrice100] = useState(existing?.sizes.find((s) => s.size === "100ml")?.price.toString() || "");
  const [stock, setStock] = useState(existing?.stock?.toString() || "20");
  const [topNotes, setTopNotes] = useState(existing?.topNotes.join(", ") || "");
  const [heartNotes, setHeartNotes] = useState(existing?.heartNotes.join(", ") || "");
  const [baseNotes, setBaseNotes] = useState(existing?.baseNotes.join(", ") || "");
  const [isBestSeller, setIsBestSeller] = useState(existing?.isBestSeller || false);
  const [isNewArrival, setIsNewArrival] = useState(existing?.isNewArrival || false);
  const [imageUrl, setImageUrl] = useState(existing?.images[0] || "");
  const [uploadedPreview, setUploadedPreview] = useState(existingImage || "");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be under 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setUploadedPreview(base64);
        if (mode === "edit" && onUploadImage) {
          onUploadImage(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { alert("Product name is required"); return; }
    if (!description.trim()) { alert("Description is required"); return; }

    const sizes: { size: "30ml" | "50ml" | "100ml"; price: number }[] = [];
    if (price30 && Number(price30) > 0) sizes.push({ size: "30ml", price: Number(price30) });
    if (price50 && Number(price50) > 0) sizes.push({ size: "50ml", price: Number(price50) });
    if (price100 && Number(price100) > 0) sizes.push({ size: "100ml", price: Number(price100) });
    if (sizes.length === 0) { alert("Enter at least one size/price"); return; }

    const finalImage = uploadedPreview || imageUrl || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800";

    const parseNotes = (s: string): string[] =>
      s.split(",").map((n) => n.trim()).filter(Boolean);

    if (mode === "add") {
      const product: Product = {
        id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: name.trim(),
        brand: brand.trim() || "Debby's Fragrance",
        tagline: tagline.trim() || "A luxurious fragrance",
        description: description.trim(),
        category,
        fragranceFamily,
        topNotes: parseNotes(topNotes),
        heartNotes: parseNotes(heartNotes),
        baseNotes: parseNotes(baseNotes),
        sizes,
        images: [finalImage],
        rating: 0,
        reviewCount: 0,
        stock: Number(stock) || 20,
        isBestSeller,
        isNewArrival: isNewArrival || true,
        isFeatured: false,
      };
      onSave(product);
    } else {
      onSave({
        name: name.trim(),
        brand: brand.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        category,
        fragranceFamily,
        topNotes: parseNotes(topNotes),
        heartNotes: parseNotes(heartNotes),
        baseNotes: parseNotes(baseNotes),
        sizes,
        images: [finalImage],
        stock: Number(stock) || 20,
        isBestSeller,
        isNewArrival,
      });
    }
  };

  const previewImage = uploadedPreview || imageUrl || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <h2 className="font-serif text-xl font-bold text-zinc-100">
          {mode === "add" ? "Add New Product" : `Edit: ${existing?.name}`}
        </h2>
        <button
          onClick={onCancel}
          className="text-zinc-400 hover:text-zinc-200 p-2 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Image */}
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-serif text-sm font-bold text-gold-400 flex items-center space-x-2">
              <ImageIcon className="w-4 h-4" />
              <span>Product Image</span>
            </h3>

            <div className="aspect-square w-full bg-zinc-950 rounded-xl overflow-hidden border-2 border-zinc-800">
              <img
                src={previewImage}
                alt="Preview"
                className="object-cover w-full h-full"
              />
            </div>

            <div className="space-y-3">
              <label className="cursor-pointer w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-lg flex items-center justify-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[10px] text-zinc-500 text-center">PNG, JPG, or WEBP up to 5MB</p>

              {mode === "edit" && onResetImage && uploadedPreview && (
                <button
                  type="button"
                  onClick={onResetImage}
                  className="w-full text-xs text-rose-400 hover:text-rose-300 underline"
                >
                  Restore Default Photo
                </button>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Badges</h3>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="w-4 h-4 accent-gold-500 rounded"
              />
              <span className="text-xs text-zinc-300">Best Seller</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="w-4 h-4 accent-gold-500 rounded"
              />
              <span className="text-xs text-zinc-300">New Arrival</span>
            </label>
          </div>
        </div>

        {/* Right: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-serif text-sm font-bold text-gold-400">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs text-zinc-400 block mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Midnight Velvet"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Brand</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Debby's Signature"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Seduction in the Dark"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GenderCategory)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-gold-500"
                >
                  <option value="women">Women</option>
                  <option value="men">Men</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Fragrance Family *</label>
                <select
                  value={fragranceFamily}
                  onChange={(e) => setFragranceFamily(e.target.value as FragranceFamily)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-gold-500"
                >
                  <option value="floral">Floral</option>
                  <option value="woody">Woody</option>
                  <option value="oriental">Oriental</option>
                  <option value="fresh">Fresh</option>
                  <option value="citrus">Citrus</option>
                  <option value="gourmand">Gourmand</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Stock Quantity</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  min="0"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-serif text-sm font-bold text-gold-400">Description *</h3>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the fragrance — its character, mood, and what makes it special..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-gold-500 leading-relaxed"
            />
          </div>

          {/* Pricing */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-serif text-sm font-bold text-gold-400">Pricing (₦ Naira)</h3>
            <p className="text-[11px] text-zinc-500">Enter price for each size you want to offer. Leave blank to skip that size.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">30ml Price</label>
                <input
                  type="number"
                  value={price30}
                  onChange={(e) => setPrice30(e.target.value)}
                  placeholder="e.g. 45000"
                  min="0"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">50ml Price</label>
                <input
                  type="number"
                  value={price50}
                  onChange={(e) => setPrice50(e.target.value)}
                  placeholder="e.g. 75000"
                  min="0"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">100ml Price</label>
                <input
                  type="number"
                  value={price100}
                  onChange={(e) => setPrice100(e.target.value)}
                  placeholder="e.g. 120000"
                  min="0"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          {/* Fragrance Notes */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-serif text-sm font-bold text-gold-400">Fragrance Notes</h3>
            <p className="text-[11px] text-zinc-500">Separate each note with a comma.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Top Notes</label>
                <input
                  type="text"
                  value={topNotes}
                  onChange={(e) => setTopNotes(e.target.value)}
                  placeholder="e.g. Bergamot, Pink Pepper"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Heart Notes</label>
                <input
                  type="text"
                  value={heartNotes}
                  onChange={(e) => setHeartNotes(e.target.value)}
                  placeholder="e.g. Jasmine, Rose"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Base Notes</label>
                <input
                  type="text"
                  value={baseNotes}
                  onChange={(e) => setBaseNotes(e.target.value)}
                  placeholder="e.g. Oud, Vanilla"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 font-bold text-xs px-8 py-3.5 rounded-xl uppercase tracking-widest flex items-center space-x-2 transition-all shadow-lg"
            >
              {mode === "add" ? <Plus className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{mode === "add" ? "Add Product to Store" : "Save Changes"}</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 font-bold text-xs px-6 py-3.5 rounded-xl uppercase tracking-wider transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
