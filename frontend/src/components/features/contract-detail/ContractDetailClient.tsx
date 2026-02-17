"use client";

import React from "react";
import Link from "next/link";
import ContractTabs from "./ContractTabs";
import ContractSummaryTab from "./ContractSummaryTab";
import ScheduleTab from "./ScheduleTab";
import TransactionsTab from "./TransactionsTab";
import { useContractDetail, ContractDetailInitialData } from "@/hooks/useContractDetail";

interface ContractDetailClientProps {
  initialData: ContractDetailInitialData;
  serverError?: string;
}

export default function ContractDetailClient({
  initialData,
  serverError,
}: ContractDetailClientProps) {
  const {
    contract,
    schedules,
    transactions,
    activeTab,
    setActiveTab,
    isActive,
    goToRepay,
    goBack,
  } = useContractDetail(initialData);

  if (serverError && !contract) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <p style={{ color: "#dc2626", fontSize: "16px", marginBottom: "16px" }}>
            {serverError}
          </p>
          <button className="btn btn-primary" onClick={goBack}>
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!contract) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <Link href="/loans/contracts" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-8">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        대출 관리로 돌아가기
      </Link>

      <div className="mb-12 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            대출 계약 상세
          </h1>
        </div>
        {isActive && (
          <button className="btn btn-primary" onClick={goToRepay}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            상환하기
          </button>
        )}
      </div>

      <div className="space-y-10">
        <ContractTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === "summary" && <ContractSummaryTab contract={contract} />}
        {activeTab === "schedule" && <ScheduleTab schedules={schedules} />}
        {activeTab === "transactions" && <TransactionsTab transactions={transactions} />}
      </div>
    </div>
  );
}
