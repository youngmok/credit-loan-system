"use client";

import React from "react";
import ErrorBanner from "@/components/ui/ErrorBanner";
import ContractSummaryCards from "./ContractSummaryCards";
import ContractTable from "./ContractTable";
import { useContractList } from "@/hooks/useContractList";
import { LoanContract } from "@/types/loan";

interface ContractListClientProps {
  contracts: LoanContract[];
  error?: string;
}

export default function ContractListClient({
  contracts: initialContracts,
  error,
}: ContractListClientProps) {
  const { contracts, summaryCards, goToContract } =
    useContractList(initialContracts);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          대출 관리
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          대출 계약을 관리하고 상환 현황을 확인합니다.
        </p>
      </div>

      <div className="space-y-10">
        {error && <ErrorBanner message={error} />}
        <ContractSummaryCards summaryCards={summaryCards} />
        <ContractTable contracts={contracts} onRowClick={goToContract} />
      </div>
    </div>
  );
}
