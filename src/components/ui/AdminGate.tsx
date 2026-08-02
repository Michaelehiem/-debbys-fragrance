"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Eye, EyeOff } from "lucide-react";
import { siteConfig } from "@/config/site";

const ADMIN_PASSWORD = siteConfig.adminPassword;

interface AdminGateProps {
  children: React.ReactNode;
}

export const AdminGate: React.FC<AdminGateProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("debby_admin_auth");
    if (saved === "true") {
      setIsAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("debby_admin_auth", "true");
      setError(false);
    } else {
      setError(true);
      setPassword("");
      setTimeout(() => setError(false), 3000);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("debby_admin_auth");
    setPassword("");
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <div className="relative">{children}<LogoutButton onLogout={handleLogout} /></div>;
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex items-center justify-center px-4 font-sans dark:bg-zinc-950 dark:text-zinc-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-sm w-full space-y-8"
      >
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8 text-gold-600 dark:text-gold-400" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-100">Admin Access</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Enter the admin password to access the product management panel.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-500 absolute left-4 top-3.5" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoFocus
              className={`w-full bg-white border rounded-xl pl-11 pr-12 py-3 text-sm text-zinc-900 focus:outline-none transition-colors dark:bg-zinc-900 dark:text-zinc-100 ${
                error
                  ? "border-rose-500 focus:border-rose-400"
                  : "border-zinc-300 focus:border-gold-500 dark:border-zinc-800"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-zinc-500 hover:text-zinc-900 transition-colors dark:hover:text-zinc-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-rose-400 font-semibold"
            >
              Incorrect password. Please try again.
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 font-bold py-3 rounded-xl uppercase text-xs tracking-widest transition-all shadow-lg"
          >
            Unlock Admin Panel
          </button>
        </form>
      </motion.div>
    </div>
  );
};

function LogoutButton({ onLogout }: { onLogout: () => void }) {
  return (
    <button
      onClick={onLogout}
      className="fixed top-24 right-6 z-50 bg-white hover:bg-rose-50 border border-zinc-300 hover:border-rose-300 text-zinc-600 hover:text-rose-600 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all flex items-center space-x-1.5 shadow-sm dark:bg-zinc-800 dark:hover:bg-rose-900/60 dark:border-zinc-700 dark:hover:border-rose-700 dark:text-zinc-300 dark:hover:text-rose-300"
    >
      <Lock className="w-3 h-3" />
      <span>Lock Admin</span>
    </button>
  );
}
