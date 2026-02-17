"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { dashboardApi } from "@/lib/api";
import { DashboardData } from "@/types/loan";

export function useDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const result = await dashboardApi.get();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  function goToContract(id: number) {
    router.push(`/loans/contracts/${id}`);
  }

  function goToApplication(id: number) {
    router.push(`/loans/applications/${id}`);
  }

  return {
    data,
    loading,
    error,
    reload: loadDashboard,
    goToContract,
    goToApplication,
  };
}
