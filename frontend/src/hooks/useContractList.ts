"use client";

import { useRouter } from "next/navigation";
import { LoanContract } from "@/types/loan";

export interface SummaryCard {
  label: string;
  value: number;
  color: string;
  bg: string;
}

export function useContractList(initialContracts: LoanContract[]) {
  const router = useRouter();

  const totalContracts = initialContracts.length;
  const activeContracts = initialContracts.filter(
    (c) => c.status === "EXECUTED" || c.status === "ACTIVE"
  ).length;
  const completedContracts = initialContracts.filter(
    (c) => c.status === "COMPLETED"
  ).length;
  const overdueContracts = initialContracts.filter(
    (c) => c.status === "OVERDUE"
  ).length;

  const summaryCards: SummaryCard[] = [
    { label: "전체 계약", value: totalContracts, color: "#2563eb", bg: "rgba(59, 130, 246, 0.08)" },
    { label: "활성 대출", value: activeContracts, color: "#16a34a", bg: "rgba(22, 163, 74, 0.08)" },
    { label: "상환 완료", value: completedContracts, color: "#7c3aed", bg: "rgba(124, 58, 237, 0.08)" },
    { label: "연체", value: overdueContracts, color: "#dc2626", bg: "rgba(239, 68, 68, 0.08)" },
  ];

  function goToContract(id: number) {
    router.push(`/loans/contracts/${id}`);
  }

  return {
    contracts: initialContracts,
    summaryCards,
    goToContract,
  };
}
