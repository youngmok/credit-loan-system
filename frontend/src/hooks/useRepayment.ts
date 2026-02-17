"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { repaymentApi } from "@/lib/api";
import { LoanContract, RepaymentSchedule } from "@/types/loan";
import { formatCurrency } from "@/lib/formatters";

export type RepaymentOption = "scheduled" | "early";

export interface RepaymentResult {
  success: boolean;
  message: string;
}

export interface RepaymentInitialData {
  contract: LoanContract | null;
  schedules: RepaymentSchedule[];
}

export function useRepayment(contractId: number, initialData: RepaymentInitialData) {
  const router = useRouter();
  const [contract] = useState(initialData.contract);
  const [error, setError] = useState<string | null>(null);
  const [repayOption, setRepayOption] = useState<RepaymentOption>("scheduled");
  const [showConfirm, setShowConfirm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<RepaymentResult | null>(null);

  const nextSchedule = initialData.schedules.find(
    (s) => s.status === "SCHEDULED" || s.status === "OVERDUE"
  );

  const [amount, setAmount] = useState<number>(nextSchedule?.totalAmount ?? 0);

  async function handleRepay() {
    try {
      setProcessing(true);
      setError(null);

      if (repayOption === "early") {
        await repaymentApi.earlyRepay(contractId);
        setResult({
          success: true,
          message: "조기상환이 완료되었습니다. 대출이 정상 완료 처리되었습니다.",
        });
      } else {
        await repaymentApi.repay(contractId, { amount });
        setResult({
          success: true,
          message: `${formatCurrency(amount)} 상환이 완료되었습니다.`,
        });
      }
    } catch (err) {
      setResult({
        success: false,
        message:
          err instanceof Error
            ? err.message
            : "상환 처리 중 오류가 발생했습니다.",
      });
    } finally {
      setProcessing(false);
      setShowConfirm(false);
    }
  }

  function selectScheduledOption() {
    setRepayOption("scheduled");
    if (nextSchedule) setAmount(nextSchedule.totalAmount);
  }

  function selectEarlyOption() {
    setRepayOption("early");
  }

  function openConfirm() {
    setShowConfirm(true);
  }

  function closeConfirm() {
    setShowConfirm(false);
  }

  function clearResult() {
    setResult(null);
  }

  function goToContract() {
    router.push(`/loans/contracts/${contractId}`);
  }

  function goBack() {
    router.back();
  }

  return {
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
  };
}
