"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { applicationApi, contractApi, customerApi } from "@/lib/api";
import {
  LoanApplication,
  CreditAssessment,
  StatusHistory,
  Customer,
} from "@/types/loan";

export const confirmMessages: Record<string, { title: string; message: string }> = {
  submit: {
    title: "신청 제출",
    message: "대출 신청을 제출하시겠습니까? 제출 후에는 수정할 수 없습니다.",
  },
  assess: {
    title: "심사 실행",
    message: "신용평가 심사를 실행하시겠습니까? 심사 결과에 따라 승인 또는 거절됩니다.",
  },
  execute: {
    title: "대출 실행",
    message: "대출을 실행하시겠습니까? 실행 즉시 대출금이 지급되며, 상환 일정이 생성됩니다.",
  },
};

export interface ApplicationDetailInitialData {
  application: LoanApplication | null;
  customer: Customer | null;
  history: StatusHistory[];
  assessment: CreditAssessment | null;
}

export function useApplicationDetail(
  applicationId: number,
  initialData: ApplicationDetailInitialData
) {
  const router = useRouter();
  const [application, setApplication] = useState(initialData.application);
  const [assessment, setAssessment] = useState(initialData.assessment);
  const [history, setHistory] = useState(initialData.history);
  const [customer, setCustomer] = useState(initialData.customer);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<string>("");

  async function reloadData() {
    try {
      const app = await applicationApi.getById(applicationId);
      setApplication(app);

      try {
        const cust = await customerApi.getById(app.customerId);
        setCustomer(cust);
      } catch {}

      try {
        const hist = await applicationApi.getHistory(applicationId);
        setHistory(hist);
      } catch {}

      const assessedStatuses = ["APPROVED", "REJECTED", "EXECUTED", "ACTIVE", "COMPLETED"];
      if (assessedStatuses.includes(app.status)) {
        try {
          const assess = await applicationApi.getAssessment(applicationId);
          setAssessment(assess);
        } catch {}
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다."
      );
    }
  }

  async function handleSubmit() {
    try {
      setActionLoading(true);
      await applicationApi.submit(applicationId);
      await reloadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "제출 처리 중 오류가 발생했습니다."
      );
    } finally {
      setActionLoading(false);
      setShowConfirmModal(false);
    }
  }

  async function handleAssess() {
    try {
      setActionLoading(true);
      const result = await applicationApi.assess(applicationId);
      setAssessment(result);
      await reloadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "심사 처리 중 오류가 발생했습니다."
      );
    } finally {
      setActionLoading(false);
      setShowConfirmModal(false);
    }
  }

  async function handleExecute() {
    try {
      setActionLoading(true);
      const contract = await contractApi.execute(applicationId);
      router.push(`/loans/contracts/${contract.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "대출 실행 중 오류가 발생했습니다."
      );
      setActionLoading(false);
      setShowConfirmModal(false);
    }
  }

  function openConfirmModal(action: string) {
    setConfirmAction(action);
    setShowConfirmModal(true);
  }

  function closeConfirmModal() {
    setShowConfirmModal(false);
  }

  function handleConfirm() {
    switch (confirmAction) {
      case "submit":
        handleSubmit();
        break;
      case "assess":
        handleAssess();
        break;
      case "execute":
        handleExecute();
        break;
    }
  }

  function goBack() {
    router.back();
  }

  return {
    application,
    assessment,
    history,
    customer,
    error,
    actionLoading,
    showConfirmModal,
    confirmAction,
    openConfirmModal,
    closeConfirmModal,
    handleConfirm,
    goBack,
  };
}
