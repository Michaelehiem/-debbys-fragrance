"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Review } from "@/types";

interface ReviewContextType {
  reviews: Record<string, Review[]>; // productId -> reviews[]
  addReview: (productId: string, review: Omit<Review, "id" | "date">) => void;
  getProductReviews: (productId: string) => Review[];
  getAverageRating: (productId: string) => number;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Record<string, Review[]>>({});

  useEffect(() => {
    const saved = localStorage.getItem("debby_reviews");
    if (saved) {
      try { setReviews(JSON.parse(saved)); } catch (e) { console.error("Failed to load reviews", e); }
    }
  }, []);

  const saveReviews = (r: Record<string, Review[]>) => {
    setReviews(r);
    localStorage.setItem("debby_reviews", JSON.stringify(r));
  };

  const addReview = (productId: string, reviewData: Omit<Review, "id" | "date">) => {
    const newReview: Review = {
      ...reviewData,
      id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: new Date().toISOString(),
    };
    const existing = reviews[productId] || [];
    saveReviews({ ...reviews, [productId]: [...existing, newReview] });
  };

  const getProductReviews = (productId: string): Review[] => {
    return reviews[productId] || [];
  };

  const getAverageRating = (productId: string): number => {
    const productReviews = reviews[productId] || [];
    if (productReviews.length === 0) return 0;
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / productReviews.length) * 10) / 10;
  };

  return (
    <ReviewContext.Provider value={{ reviews, addReview, getProductReviews, getAverageRating }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) throw new Error("useReviews must be used within ReviewProvider");
  return context;
};
