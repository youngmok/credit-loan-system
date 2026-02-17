"use client";

import React from "react";
import Link from "next/link";
import ErrorBanner from "@/components/ui/ErrorBanner";
import ContractSummarySection from "./ContractSummarySection";
import NextScheduleCard from "./NextScheduleCard";
import RepaymentOptions from "./RepaymentOptions";
import RepaymentResult from "./RepaymentResult";
import RepaymentConfirmModal from "./RepaymentConfirmModal";
import { useRepayment, RepaymentInitialData } from "@/hooks/useRepayment";

interface RepayClientProps {
  contractId: number;
  initialData: RepaymentInitialData;
  serverError?: string;
}

export default function RepayClient({
  contractId,
  initialData,
  serverError,
}: RepayClientProps) {
  const {
    contract,
    error,
    repayOption,
    amount,
    setAmount,
    showConfirm,
    processing,
    result,
    nextSchedule,
    selectScheduledOption,
    selectEarlyOption,
    openConfirm,
    closeConfirm,
    handleRepay,
    clearResult,
    goToContract,
    goBack,
  } = useRepayment(contractId, initialData);

  if (!contract) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <p style={{ color: "#dc2626", fontSize: "16px", marginBottom: "16px" }}>
            {serverError || "계약 정보를 찾을 수 없습니다."}
          </p>
          <button className="btn btn-primary" onClick={goBack}>
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <RepaymentResult
        result={result}
        onGoToContract={goToContract}
        onRetry={clearResult}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <Link href={`/loans/contracts/${contractId}`} className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-8">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        계약 상세로 돌아가기
      </Link>

      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          상환하기
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          상환 방법을 선택하고 금액을 입력하세요.
        </p>
      </div>

      <div className="space-y-10">
        {error && <ErrorBanner message={error} />}

        <ContractSummarySection contract={contract} />

        {nextSchedule && <NextScheduleCard schedule={nextSchedule} />}

        <RepaymentOptions
          repayOption={repayOption}
          amount={amount}
          contract={contract}
          onSelectScheduled={selectScheduledOption}
          onSelectEarly={selectEarlyOption}
          onAmountChange={setAmount}
          onSubmit={openConfirm}
          onCancel={goToContract}
        />
      </div>

      <RepaymentConfirmModal
        isOpen={showConfirm}
        repayOption={repayOption}
        amount={amount}
        outstandingBalance={contract.outstandingBalance}
        processing={processing}
        onConfirm={handleRepay}
        onClose={closeConfirm}
      />
    </div>
  );
}
