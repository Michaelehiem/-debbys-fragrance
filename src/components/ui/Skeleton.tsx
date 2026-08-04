"use client";

import React from "react";

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-square w-full bg-zinc-800" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-3 bg-zinc-800 rounded w-20" />
          <div className="h-3 bg-zinc-800 rounded w-8" />
        </div>
        <div className="h-4 bg-zinc-800 rounded w-3/4" />
        <div className="space-y-1">
          <div className="h-2.5 bg-zinc-800 rounded w-full" />
          <div className="h-2.5 bg-zinc-800 rounded w-2/3" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60">
          <div className="flex space-x-1">
            <div className="h-6 bg-zinc-800 rounded w-10" />
            <div className="h-6 bg-zinc-800 rounded w-10" />
            <div className="h-6 bg-zinc-800 rounded w-10" />
          </div>
          <div className="h-8 bg-zinc-800 rounded w-16" />
        </div>
      </div>
    </div>
  );
};

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-5 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb skeleton */}
        <div className="flex space-x-2">
          <div className="h-3 bg-zinc-800 rounded w-12" />
          <div className="h-3 bg-zinc-800 rounded w-4" />
          <div className="h-3 bg-zinc-800 rounded w-10" />
          <div className="h-3 bg-zinc-800 rounded w-4" />
          <div className="h-3 bg-zinc-800 rounded w-24" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery skeleton */}
          <div className="space-y-4">
            <div className="aspect-square w-full bg-zinc-900 rounded-2xl border border-zinc-800" />
            <div className="flex space-x-3">
              {[1, 2].map((i) => (
                <div key={i} className="w-20 h-20 bg-zinc-900 rounded-xl border border-zinc-800" />
              ))}
            </div>
          </div>

          {/* Info skeleton */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="h-3 bg-zinc-800 rounded w-40" />
              <div className="h-8 bg-zinc-800 rounded w-64" />
              <div className="h-4 bg-zinc-800 rounded w-32" />
            </div>
            <div className="h-4 bg-zinc-800 rounded w-48" />
            <div className="space-y-2 border-t border-b border-zinc-800 py-4">
              <div className="h-3 bg-zinc-800 rounded w-full" />
              <div className="h-3 bg-zinc-800 rounded w-5/6" />
              <div className="h-3 bg-zinc-800 rounded w-4/6" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-zinc-900 rounded-xl border border-zinc-800" />
              ))}
            </div>
            <div className="h-14 bg-zinc-800 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ShopPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-5 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-end border-b border-zinc-800 pb-6">
          <div className="space-y-2">
            <div className="h-8 bg-zinc-800 rounded w-64" />
            <div className="h-3 bg-zinc-800 rounded w-48" />
          </div>
          <div className="h-10 bg-zinc-800 rounded w-64" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter sidebar skeleton */}
          <div className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 space-y-6">
            <div className="h-5 bg-zinc-800 rounded w-32" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 bg-zinc-800 rounded w-24" />
                <div className="space-y-1.5">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-3 bg-zinc-800 rounded w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Product grid skeleton */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
