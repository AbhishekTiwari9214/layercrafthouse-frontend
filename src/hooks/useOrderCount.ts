"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export function useOrderCount() {
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setCount(0);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchCount() {
      try {
        const result = await api.getOrderCount();
        if (!cancelled) {
          setCount(result.data.count);
        }
      } catch {
        if (!cancelled) {
          setCount(0);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchCount();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, pathname]);

  return { count, loading, hasOrders: count > 0 };
}
