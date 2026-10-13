"use client";

import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Product, GenderCategory, FragranceFamily, BottleSize } from "@/types";
import { formatNaira } from "@/lib/utils";
import { Plus, Trash2, X, Check, Upload, Save, Package, Edit3, Image as ImageIcon } from "lucide-react";

type View = "list" | "add" | "edit";

const STANDARD_SIZES: BottleSize[] = ["5ml", "10ml", "25ml", "30ml", "50ml", "100ml"];

export function AdminProducts() {
  const { allProducts, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [view, setView] = useState<View>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [filterCategory, setFilterCategory] = useState<GenderCategory | "all">("all");

  const show = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const filtered =
    filterCategory === "all"
      ? allProducts
      : allProducts.filter((p) => p.category === filterCategory);
  const selected = selectedId ? allProducts.find((p) => p.id === selectedId) : null;

  const inputClass =
    "w-full border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink focus:border-gold-500 focus:outline-none";

  return (
    <div className="space-y-6">
      {message && (
        <div className="flex items-center gap-2 border border-emerald-500/40 bg-emerald-50 p-4 text-xs font-semibold text-emerald-700">
          <Check className="h-4 w-4" />
          <span>{message}</span>
        </div>
      )}

      {view === "list" && (
        <>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-ink">
              <Package className="h-5 w-5 text-gold-600" />
              All products ({filtered.length})
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-ink/15 bg-white p-1">
                {(["all", "women", "men", "unisex"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      filterCategory === cat
                        ? "bg-gold-500/20 text-gold-700"
                        : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {cat === "all" ? "All" : cat}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setView("add")}
                className="flex items-center gap-2 bg-ink px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-gold-700"
              >
                <Plus className="h-4 w-4" />
                <span>Add new</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {filtered.map((prod) => (
              <div key={prod.id} className="group overflow-hidden border border-ink/10 bg-white">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-deep">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-2 top-2 flex flex-col gap-1">
                    <span className="bg-ink/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-paper backdrop-blur">
                      {prod.category}
                    </span>
                    <span className="bg-ink/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-paper/80 backdrop-blur">
                      {prod.fragranceFamily}
                    </span>
                  </div>
                  <span className="absolute right-2 top-2 bg-ink/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-paper backdrop-blur">
                    {prod.stock} in stock
                  </span>
                </div>
                <div className="space-y-2.5 p-3">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-gold-600">
                      {prod.brand}
                    </p>
                    <h3 className="truncate font-serif text-sm font-bold text-ink">{prod.name}</h3>
                    <p className="mt-0.5 text-xs text-ink-soft">
                      from {formatNaira(Math.min(...prod.sizes.map((s) => s.price)))}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        setSelectedId(prod.id);
                        setView("edit");
                      }}
                      className="flex flex-1 items-center justify-center gap-1.5 border border-ink/15 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-ink-soft transition-colors hover:bg-paper"
                    >
                      <Edit3 className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm(`Delete "${prod.name}"? This cannot be undone.`)) return;
                        const ok = await deleteProduct(prod.id);
                        show(ok ? `Deleted "${prod.name}"` : "Could not delete product");
                      }}
                      className="flex items-center justify-center gap-1.5 border border-rose-200 bg-rose-50 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-rose-600 transition-colors hover:bg-rose-100"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="space-y-4 border border-ink/10 bg-paper/50 py-20 text-center">
              <Package className="mx-auto h-12 w-12 text-ink/20" />
              <p className="text-sm text-ink-soft">No products in this category yet.</p>
              <button
                onClick={() => setView("add")}
                className="bg-ink px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-paper hover:bg-gold-700"
              >
                Add first product
              </button>
            </div>
          )}
        </>
      )}

      {view === "add" && (
        <ProductForm
          mode="add"
          onCancel={() => setView("list")}
          onSave={async (product) => {
            const ok = await addProduct(product as Product);
            show(ok ? `"${product.name}" added to your catalogue` : "Could not add product");
            setView("list");
          }}
        />
      )}

      {view === "edit" && selected && (
        <ProductForm
          mode="edit"
          existing={selected}
          onCancel={() => {
            setView("list");
            setSelectedId(null);
          }}
          onSave={async (updates) => {
            const ok = await updateProduct(selected.id, updates);
            show(ok ? `"${selected.name}" updated` : "Could not save changes");
            setView("list");
            setSelectedId(null);
          }}
        />
      )}
    </div>
  );

  function ProductForm({
    mode,
    existing,
    onCancel,
    onSave,
  }: {
    mode: "add" | "edit";
    existing?: Product;
    onCancel: () => void;
    onSave: (data: Partial<Product> & { name?: string }) => void | Promise<void>;
  }) {
    const [name, setName] = useState(existing?.name || "");
    const [brand, setBrand] = useState(existing?.brand || "");
    const [tagline, setTagline] = useState(existing?.tagline || "");
    const [description, setDescription] = useState(existing?.description || "");
    const [category, setCategory] = useState<GenderCategory>(existing?.category || "women");
    const [fragranceFamily, setFragranceFamily] = useState<FragranceFamily>(
      existing?.fragranceFamily || "floral"
    );
    const [sizeEnabled, setSizeEnabled] = useState<Record<string, boolean>>(() => {
      const init: Record<string, boolean> = {};
      STANDARD_SIZES.forEach((s) => {
        init[s] = Boolean(existing?.sizes.find((x) => x.size === s));
      });
      return init;
    });
    const [sizePrices, setSizePrices] = useState<Record<string, string>>(() => {
      const init: Record<string, string> = {};
      STANDARD_SIZES.forEach((s) => {
        const found = existing?.sizes.find((x) => x.size === s);
        init[s] = found ? found.price.toString() : "";
      });
      return init;
    });
    const [stock, setStock] = useState(existing?.stock?.toString() || "20");
    const [topNotes, setTopNotes] = useState(existing?.topNotes.join(", ") || "");
    const [heartNotes, setHeartNotes] = useState(existing?.heartNotes.join(", ") || "");
    const [baseNotes, setBaseNotes] = useState(existing?.baseNotes.join(", ") || "");
    const [isBestSeller, setIsBestSeller] = useState(existing?.isBestSeller || false);
    const [isNewArrival, setIsNewArrival] = useState(existing?.isNewArrival || false);
    const [isFeatured, setIsFeatured] = useState(existing?.isFeatured || false);
    const [imageUrl, setImageUrl] = useState(existing?.images[0] || "");
    const [uploadedPreview, setUploadedPreview] = useState("");
    const [saving, setSaving] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be under 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setUploadedPreview(reader.result as string);
      reader.readAsDataURL(file);
    };

    const parseNotes = (s: string) => s.split(",").map((n) => n.trim()).filter(Boolean);

    const toggleSize = (size: BottleSize, on: boolean) =>
      setSizeEnabled((prev) => ({ ...prev, [size]: on }));

    const setAllSizes = (on: boolean) =>
      setSizeEnabled((prev) => {
        const next = { ...prev };
        STANDARD_SIZES.forEach((s) => (next[s] = on));
        return next;
      });

    const submit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim()) return alert("Product name is required");
      if (!description.trim()) return alert("Description is required");

      const sizes: { size: BottleSize; price: number }[] = [];
      STANDARD_SIZES.forEach((s) => {
        if (sizeEnabled[s] && Number(sizePrices[s]) > 0) {
          sizes.push({ size: s, price: Number(sizePrices[s]) });
        }
      });
      if (sizes.length === 0)
        return alert("Select at least one bottle size and enter its price");

      const finalImage =
        uploadedPreview ||
        imageUrl ||
        existing?.images[0] ||
        "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800";

      setSaving(true);
      try {
        if (mode === "add") {
          await onSave({
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
            isFeatured,
          });
        } else {
          await onSave({
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
            isFeatured,
          });
        }
      } finally {
        setSaving(false);
      }
    };

    const preview =
      uploadedPreview ||
      imageUrl ||
      existing?.images[0] ||
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400";

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-ink/10 pb-4">
          <h2 className="font-serif text-xl font-bold text-ink">
            {mode === "add" ? "Add new product" : `Edit: ${existing?.name}`}
          </h2>
          <button onClick={onCancel} className="p-2 text-ink-soft hover:text-ink" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="space-y-4 border border-ink/10 bg-white p-6">
              <h3 className="flex items-center gap-2 font-serif text-sm font-bold text-gold-700">
                <ImageIcon className="h-4 w-4" /> Product image
              </h3>
              <div className="aspect-square w-full overflow-hidden border border-ink/10 bg-paper-deep">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
              </div>
              <label className="flex w-full cursor-pointer items-center justify-center gap-2 bg-ink py-2.5 text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-gold-700">
                <Upload className="h-4 w-4" />
                <span>Upload photo</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              <div>
                <label className="mb-1 block text-xs text-ink-soft">…or paste an image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://…"
                  className={inputClass}
                />
              </div>
              <p className="text-center text-[10px] text-ink-soft/60">PNG, JPG or WEBP up to 5MB</p>
            </div>

            <div className="space-y-3 border border-ink/10 bg-white p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">Badges</h3>
              {[
                ["Best Seller", isBestSeller, setIsBestSeller] as const,
                ["New Arrival", isNewArrival, setIsNewArrival] as const,
                ["Featured", isFeatured, setIsFeatured] as const,
              ].map(([label, value, setter]) => (
                <label key={label} className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setter(e.target.checked)}
                    className="h-4 w-4 accent-gold-500"
                  />
                  <span className="text-xs text-ink-soft">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <div className="space-y-4 border border-ink/10 bg-white p-6">
              <h3 className="font-serif text-sm font-bold text-gold-700">Basic information</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs text-ink-soft">Product name *</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="e.g. Midnight Velvet" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-ink-soft">Brand</label>
                  <input value={brand} onChange={(e) => setBrand(e.target.value)} className={inputClass} placeholder="e.g. Debby's Signature" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-ink-soft">Tagline</label>
                  <input value={tagline} onChange={(e) => setTagline(e.target.value)} className={inputClass} placeholder="e.g. Seduction in the dark" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-ink-soft">Category *</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value as GenderCategory)} className={inputClass}>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-ink-soft">Fragrance family *</label>
                  <select value={fragranceFamily} onChange={(e) => setFragranceFamily(e.target.value as FragranceFamily)} className={inputClass}>
                    <option value="floral">Floral</option>
                    <option value="woody">Woody</option>
                    <option value="oriental">Oriental</option>
                    <option value="fresh">Fresh</option>
                    <option value="citrus">Citrus</option>
                    <option value="gourmand">Gourmand</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-ink-soft">Stock quantity</label>
                  <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>

            <div className="space-y-4 border border-ink/10 bg-white p-6">
              <h3 className="font-serif text-sm font-bold text-gold-700">Description *</h3>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the fragrance — its character, mood, and what makes it special…"
                className={`${inputClass} leading-relaxed`}
              />
            </div>

            <div className="space-y-4 border border-ink/10 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-sm font-bold text-gold-700">Bottle sizes &amp; pricing (₦)</h3>
                  <p className="mt-1 text-[11px] text-ink-soft/70">Tick the sizes this product comes in, then set a price for each.</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button type="button" onClick={() => setAllSizes(true)} className="border border-ink/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-soft hover:bg-paper">All</button>
                  <button type="button" onClick={() => setAllSizes(false)} className="border border-ink/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-soft hover:bg-paper">Clear</button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {STANDARD_SIZES.map((s) => {
                  const on = sizeEnabled[s];
                  return (
                    <div key={s} className={`border p-3 transition-colors ${on ? "border-gold-500 bg-gold-500/5" : "border-ink/10"}`}>
                      <label className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" checked={on} onChange={(e) => toggleSize(s, e.target.checked)} className="h-4 w-4 accent-gold-500" />
                        <span className="font-serif text-sm font-bold text-ink">{s}</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={sizePrices[s]}
                        disabled={!on}
                        onChange={(e) => setSizePrices((prev) => ({ ...prev, [s]: e.target.value }))}
                        placeholder="Price"
                        className={`${inputClass} mt-2 disabled:cursor-not-allowed disabled:opacity-50`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 border border-ink/10 bg-white p-6">
              <h3 className="font-serif text-sm font-bold text-gold-700">Fragrance notes</h3>
              <p className="text-[11px] text-ink-soft/70">Separate each note with a comma.</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs text-ink-soft">Top notes</label>
                  <input value={topNotes} onChange={(e) => setTopNotes(e.target.value)} className={inputClass} placeholder="Bergamot, Pink Pepper" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-ink-soft">Heart notes</label>
                  <input value={heartNotes} onChange={(e) => setHeartNotes(e.target.value)} className={inputClass} placeholder="Jasmine, Rose" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-ink-soft">Base notes</label>
                  <input value={baseNotes} onChange={(e) => setBaseNotes(e.target.value)} className={inputClass} placeholder="Oud, Vanilla" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-ink px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-paper transition-colors hover:bg-gold-700 disabled:opacity-60"
              >
                {mode === "add" ? <Plus className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                <span>{saving ? "Saving…" : mode === "add" ? "Add product" : "Save changes"}</span>
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="border border-ink/15 bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-soft hover:bg-paper"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
