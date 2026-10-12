"use client";

import { useCallback, useEffect, useState } from "react";
import type { DashboardStats } from "@/types/store";

export function useStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard", { cache: "no-store" });
      if (res.status === 401) {
        setError("Session expired — please reload and sign in again.");
        return;
      }
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { stats: DashboardStats };
      setStats(data.stats);
      setError(null);
    } catch {
      setError("Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { stats, loading, error, refresh };
}
