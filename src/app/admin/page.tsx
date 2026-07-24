"use client";

import React, { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { INITIAL_PRODUCTS } from "@/data/products";
import { formatNaira } from "@/lib/utils";
import { Upload, RefreshCw, Check, Image as ImageIcon, Sparkles, ShieldCheck, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { AdminGate } from "@/components/ui/AdminGate";

export default function AdminPage() {
  return (
    <AdminGate>
      <AdminPageContent />
    </AdminGate>
  );
}

function AdminPageContent() {
  const { overrides, updateProductImage, updateProductDetails, resetProductOverride, resetAllOverrides } = useAdmin();
  const [selectedProductId, setSelectedProductId] = useState<string>(INITIAL_PRODUCTS[0].id);
  const [customPriceInput, setCustomPriceInput] = useState<string>("");
  const [customNameInput, setCustomNameInput] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const selectedProduct = INITIAL_PRODUCTS.find((p) => p.id === selectedProductId) || INITIAL_PRODUCTS[0];
  const currentOverride = overrides[selectedProductId];
  const displayImage = currentOverride?.customImage || selectedProduct.images[0];

  // Handle File Upload (Convert Image file to Base64 data URL)
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
        updateProductImage(selectedProductId, base64);
        setSuccessMsg(`Successfully uploaded new image for ${selectedProduct.name}!`);
        setTimeout(() => setSuccessMsg(""), 4000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = customPriceInput ? parseFloat(customPriceInput) : undefined;
    const nameStr = customNameInput.trim() || undefined;

    updateProductDetails(selectedProductId, nameStr, priceNum);
    setSuccessMsg(`Updated details for ${selectedProduct.name}`);
    setCustomPriceInput("");
    setCustomNameInput("");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-gold-500/40 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gold-400 font-semibold text-xs uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              <span>Debby's Fragrance Admin Portal</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-100">
              Product & Image Upload Manager
            </h1>
            <p className="text-xs text-zinc-400 max-w-xl">
              Upload your own perfume photos, change prices in Naira (₦), and customize product titles live on the website.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link
              href="/shop"
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-4 py-2.5 rounded-lg border border-zinc-700 transition-all flex items-center space-x-2"
            >
              <span>View Shop Page</span>
            </Link>
            <button
              onClick={() => {
                if (confirm("Reset all uploaded images and custom prices to default?")) {
                  resetAllOverrides();
                  alert("All overrides reset.");
                }
              }}
              className="bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold px-4 py-2.5 rounded-lg transition-all flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 p-4 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Product Selector List */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h2 className="font-serif text-lg font-bold text-gold-300">Select Perfume to Edit</h2>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {INITIAL_PRODUCTS.map((prod) => {
                const isSelected = prod.id === selectedProductId;
                const hasCustom = overrides[prod.id]?.customImage;

                return (
                  <button
                    key={prod.id}
                    onClick={() => {
                      setSelectedProductId(prod.id);
                      setCustomNameInput("");
                      setCustomPriceInput("");
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center space-x-3 ${
                      isSelected
                        ? "bg-gold-500/10 border-gold-500 text-gold-300"
                        : "bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-300"
                    }`}
                  >
                    <div className="w-10 h-10 rounded bg-zinc-900 overflow-hidden relative flex-shrink-0 border border-zinc-800">
                      <img
                        src={overrides[prod.id]?.customImage || prod.images[0]}
                        alt={prod.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{overrides[prod.id]?.customName || prod.name}</p>
                      <p className="text-[10px] text-zinc-400">
                        {formatNaira(overrides[prod.id]?.customPrice || prod.sizes[0].price)}
                      </p>
                    </div>
                    {hasCustom && (
                      <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-bold">
                        Uploaded
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Upload Image & Edit Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Upload Box */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-lg font-bold text-zinc-100">
                    Upload Custom Photo for "{overrides[selectedProduct.id]?.customName || selectedProduct.name}"
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Select a JPEG, PNG, or WebP image from your computer to replace this fragrance photo.
                  </p>
                </div>
                {currentOverride?.customImage && (
                  <button
                    onClick={() => resetProductOverride(selectedProductId)}
                    className="text-xs text-rose-400 hover:text-rose-300 underline"
                  >
                    Restore Default Photo
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Live Preview Frame */}
                <div className="relative aspect-square w-full max-w-xs mx-auto bg-zinc-950 rounded-xl overflow-hidden border-2 border-gold-500/40 shadow-xl group">
                  <img
                    src={displayImage}
                    alt={selectedProduct.name}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-zinc-950/90 backdrop-blur px-3 py-1.5 rounded-lg text-center">
                    <span className="text-[10px] text-gold-400 font-semibold uppercase tracking-widest">
                      Live Store Preview
                    </span>
                  </div>
                </div>

                {/* Upload Action */}
                <div className="space-y-4 text-center md:text-left">
                  <div className="border-2 border-dashed border-zinc-700 hover:border-gold-500 rounded-2xl p-6 transition-colors bg-zinc-950/50 flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-200">
                        Click below to choose image file
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-1">PNG, JPG, or WEBP up to 5MB</p>
                    </div>

                    <label className="cursor-pointer bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 font-bold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-lg">
                      <span>Choose Image File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Details Form */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-serif text-lg font-bold text-zinc-100">
                Update Price or Product Name
              </h3>
              <form onSubmit={handleSaveDetails} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Custom Product Name</label>
                  <input
                    type="text"
                    placeholder={selectedProduct.name}
                    value={customNameInput}
                    onChange={(e) => setCustomNameInput(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Custom Price (in ₦ Naira)</label>
                  <input
                    type="number"
                    placeholder={selectedProduct.sizes[0].price.toString()}
                    value={customPriceInput}
                    onChange={(e) => setCustomPriceInput(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 font-bold text-xs px-6 py-2.5 rounded-xl transition-all"
                  >
                    Save Name & Price Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
