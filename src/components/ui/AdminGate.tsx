"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminGateProps {
  children: React.ReactNode;
}

export const AdminGate: React.FC<AdminGateProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    (async () => {
      const hasUnlocked = localStorage.getItem("debby_admin_access") === "true";
      try {
        const res = await fetch("/api/admin/auth", { cache: "no-store" });
        const data = res.ok ? ((await res.json()) as { authenticated?: boolean }) : null;
        if (!active) return;
        if (data?.authenticated) {
          setIsAuthenticated(true);
        } else if (!hasUnlocked) {
          router.replace("/");
          return;
        }
      } catch {
        if (!active) return;
        if (!hasUnlocked) {
          router.replace("/");
          return;
        }
      } finally {
        if (active) setChecking(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        setError("Incorrect password. Please try again.");
        setPassword("");
      }
    } catch {
      setError("Could not reach the server. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {
      /* ignore */
    }
    setIsAuthenticated(false);
    setPassword("");
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-600 border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="relative">
        {children}
        <button
          onClick={handleLogout}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-1.5 border border-ink/15 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-soft shadow-editorial-sm transition-all hover:border-rose-300 hover:text-rose-600"
        >
          <Lock className="h-3 w-3" />
          <span>Lock admin</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 text-ink">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10">
            <ShieldCheck className="h-8 w-8 text-gold-700" />
          </div>
          <h1 className="font-serif text-2xl font-bold">Admin Access</h1>
          <p className="text-xs text-ink-soft">
            Enter the admin password to access the management dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 h-4 w-4 text-ink-soft/60" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoFocus
              className={`w-full border bg-white py-3 pl-11 pr-12 text-sm text-ink focus:outline-none ${
                error ? "border-rose-400" : "border-ink/15 focus:border-gold-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-ink-soft/60 hover:text-ink"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold text-rose-500"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full bg-ink py-3 text-xs font-bold uppercase tracking-[0.2em] text-paper transition-colors hover:bg-gold-700"
          >
            Unlock dashboard
          </button>
        </form>
      </motion.div>
    </div>
  );
};
