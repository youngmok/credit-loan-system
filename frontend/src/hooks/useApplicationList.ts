"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoanApplication, LoanStatus } from "@/types/loan";

export type FilterTab = "ALL" | LoanStatus;

export interface TabItem {
  key: FilterTab;
  label: string;
}

export const filterTabs: TabItem[] = [
  { key: "ALL", label: "전체" },
  { key: "APPLIED", label: "심사대기" },
  { key: "REVIEWING", label: "심사중" },
  { key: "APPROVED", label: "승인" },
  { key: "REJECTED", label: "거절" },
];

export function useApplicationList(initialApplications: LoanApplication[]) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");

  const filteredApplications =
    activeTab === "ALL"
      ? initialApplications
      : initialApplications.filter((app) => app.status === activeTab);

  function getCountByTab(tabKey: FilterTab): number {
    return tabKey === "ALL"
      ? initialApplications.length
      : initialApplications.filter((a) => a.status === tabKey).length;
  }

  function goToApplication(id: number) {
    router.push(`/loans/applications/${id}`);
  }

  function goToApply() {
    router.push("/loans/apply");
  }

  return {
    filteredApplications,
    activeTab,
    setActiveTab,
    getCountByTab,
    goToApplication,
    goToApply,
  };
}
