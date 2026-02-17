"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LoanContract,
  RepaymentSchedule,
  LoanTransaction,
} from "@/types/loan";

export type TabType = "summary" | "schedule" | "transactions";

export function getScheduleStatusStyle(status: string): React.CSSProperties {
  switch (status) {
    case "PAID":
      return { color: "#16a34a", background: "rgba(22, 163, 74, 0.08)" };
    case "OVERDUE":
      return { color: "#dc2626", background: "rgba(239, 68, 68, 0.08)" };
    case "PARTIALLY_PAID":
      return { color: "#d97706", background: "rgba(245, 158, 11, 0.08)" };
    default:
      return { color: "var(--text-secondary)", background: "var(--bg-tertiary)" };
  }
}

export interface ContractDetailInitialData {
  contract: LoanContract | null;
  schedules: RepaymentSchedule[];
  transactions: LoanTransaction[];
}

export function useContractDetail(initialData: ContractDetailInitialData) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("summary");

  const { contract, schedules, transactions } = initialData;

  const isActive =
    contract?.status === "EXECUTED" ||
    contract?.status === "ACTIVE" ||
    contract?.status === "OVERDUE";

  function goToRepay() {
    if (contract) {
      router.push(`/loans/contracts/${contract.id}/repay`);
    }
  }

  function goBack() {
    router.back();
  }

  return {
    contract,
    schedules,
    transactions,
    activeTab,
    setActiveTab,
    isActive,
    goToRepay,
    goBack,
  };
}
