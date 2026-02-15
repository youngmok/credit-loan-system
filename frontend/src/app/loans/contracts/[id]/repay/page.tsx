"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { contractApi, repaymentApi } from "@/lib/api";
import { LoanContract, RepaymentSchedule } from "@/types/loan";
import {
  formatCurrency,
  formatPercent,
  formatDate,
  getRepaymentMethodLabel,
} from "@/lib/formatters";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/loan/StatusBadge";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type RepaymentOption = "scheduled" | "early";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RepayPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const contractId = parseInt(id, 10);

  const [contract, setContract] = useState<LoanContract | null>(null);
  const [schedules, setSchedules] = useState<RepaymentSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repayOption, setRepayOption] = useState<RepaymentOption>("scheduled");
  const [amount, setAmount] = useState<number>(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    loadData();
  }, [contractId]);

  async function loadData() {
    try {
      setLoading(true);
      const [contractData, schedulesData] = await Promise.all([
        contractApi.getById(contractId),
        contractApi.getSchedules(contractId).catch(() => []),
      ]);
      setContract(contractData);
      setSchedules(schedulesData);

      // Find next scheduled payment
      const nextPayment = schedulesData.find(
        (s: RepaymentSchedule) => s.status === "SCHEDULED" || s.status === "OVERDUE"
      );
      if (nextPayment) {
        setAmount(nextPayment.totalAmount);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  const nextSchedule = schedules.find(
    (s) => s.status === "SCHEDULED" || s.status === "OVERDUE"
  );

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

  if (loading) {
    return <LoadingSpinner size="lg" message="계약 정보를 불러오는 중..." />;
  }

  if (!contract) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <p style={{ color: "#dc2626", fontSize: "16px", marginBottom: "16px" }}>
            계약 정보를 찾을 수 없습니다.
          </p>
          <button className="btn btn-primary" onClick={() => router.back()}>
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  // Show result
  if (result) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-10 shadow-sm">
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ marginBottom: "20px" }}>
              {result.success ? (
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2"
                  style={{ margin: "0 auto" }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="16 8.5 10 14.5 7.5 12" />
                </svg>
              ) : (
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="2"
                  style={{ margin: "0 auto" }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              )}
            </div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: result.success ? "#16a34a" : "#dc2626",
                marginBottom: "8px",
              }}
            >
              {result.success ? "상환 완료" : "상환 실패"}
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                marginBottom: "24px",
              }}
            >
              {result.message}
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
              <button
                className="btn btn-secondary"
                onClick={() =>
                  router.push(`/loans/contracts/${contractId}`)
                }
              >
                계약 상세로 이동
              </button>
              {!result.success && (
                <button
                  className="btn btn-primary"
                  onClick={() => setResult(null)}
                >
                  다시 시도
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Back Navigation */}
      <Link href={`/loans/contracts/${contractId}`} className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-8">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        계약 상세로 돌아가기
      </Link>

      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          상환하기
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          상환 방법을 선택하고 금액을 입력하세요.
        </p>
      </div>

      <div className="space-y-10">
        {error && (
          <div
            style={{
              padding: "12px 16px",
              background: "rgba(239, 68, 68, 0.08)",
              borderRadius: "12px",
              color: "#dc2626",
              fontSize: "14px",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            {error}
          </div>
        )}

        {/* Contract Summary */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm hover:shadow-lg transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">대출 요약</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "20px",
            }}
          >
            <div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                계약번호
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600 }}>
                {contract.contractNo}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                대출원금
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600 }} className="font-mono">
                {formatCurrency(contract.principalAmount)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                금리
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600 }} className="font-mono">
                {formatPercent(contract.interestRate)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                대출잔액
              </div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "#1d4ed8" }} className="font-mono">
                {formatCurrency(contract.outstandingBalance)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                상환방식
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600 }}>
                {getRepaymentMethodLabel(contract.repaymentMethod)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                상태
              </div>
              <StatusBadge status={contract.status} />
            </div>
          </div>
        </div>

        {/* Next Scheduled Payment */}
        {nextSchedule && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm hover:shadow-lg transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">다음 상환 예정</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: "20px",
              }}
            >
              <div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  회차
                </div>
                <div style={{ fontSize: "15px", fontWeight: 600 }}>
                  {nextSchedule.installmentNo}회
                </div>
              </div>
              <div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  납부일
                </div>
                <div style={{ fontSize: "15px", fontWeight: 600 }}>
                  {formatDate(nextSchedule.dueDate)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  납부금액
                </div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#1d4ed8" }} className="font-mono">
                  {formatCurrency(nextSchedule.totalAmount)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  상태
                </div>
                <span
                  className={`badge ${
                    nextSchedule.status === "OVERDUE"
                      ? "badge-danger"
                      : "badge-default"
                  }`}
                >
                  {nextSchedule.status === "OVERDUE" ? "연체" : "예정"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Repayment Options */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm hover:shadow-lg transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">상환 옵션</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Scheduled repayment */}
            <label
              className="rounded-xl hover:shadow-lg transition-all"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "20px",
                border:
                  repayOption === "scheduled"
                    ? "2px solid #2563eb"
                    : "2px solid var(--border-primary)",
                background:
                  repayOption === "scheduled" ? "rgba(59, 130, 246, 0.08)" : "var(--bg-primary)",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="repayOption"
                checked={repayOption === "scheduled"}
                onChange={() => {
                  setRepayOption("scheduled");
                  if (nextSchedule) setAmount(nextSchedule.totalAmount);
                }}
                style={{ marginTop: "3px", accentColor: "#2563eb" }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>
                  정기 상환
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  다음 회차의 예정된 금액을 상환합니다.
                </div>
                {repayOption === "scheduled" && (
                  <div style={{ marginTop: "16px" }}>
                    <label className="form-label">상환 금액</label>
                    <input
                      type="number"
                      className="form-input"
                      value={amount || ""}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      min={0}
                      step={1000}
                    />
                    <p className="form-helper">
                      {amount > 0 ? formatCurrency(amount) : "금액을 입력하세요"}
                    </p>
                  </div>
                )}
              </div>
            </label>

            {/* Early repayment */}
            <label
              className="rounded-xl hover:shadow-lg transition-all"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "20px",
                border:
                  repayOption === "early"
                    ? "2px solid #16a34a"
                    : "2px solid var(--border-primary)",
                background:
                  repayOption === "early" ? "rgba(22, 163, 74, 0.08)" : "var(--bg-primary)",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="repayOption"
                checked={repayOption === "early"}
                onChange={() => setRepayOption("early")}
                style={{ marginTop: "3px", accentColor: "#16a34a" }}
              />
              <div>
                <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>
                  조기 상환
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  남은 대출 잔액 전체를 일시에 상환합니다.
                </div>
                <div
                  className="font-mono"
                  style={{
                    marginTop: "8px",
                    fontSize: "18px",
                    fontWeight: 800,
                    color: "#16a34a",
                  }}
                >
                  {formatCurrency(contract.outstandingBalance)}
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <button
            className="btn btn-secondary"
            onClick={() => router.push(`/loans/contracts/${contractId}`)}
          >
            취소
          </button>
          <button
            className={`btn ${repayOption === "early" ? "btn-success" : "btn-primary"} btn-lg`}
            onClick={() => setShowConfirm(true)}
            disabled={repayOption === "scheduled" && amount <= 0}
          >
            {repayOption === "early"
              ? `조기상환 (${formatCurrency(contract.outstandingBalance)})`
              : `상환하기 (${formatCurrency(amount)})`}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="상환 확인"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setShowConfirm(false)}
              disabled={processing}
            >
              취소
            </button>
            <button
              className={`btn ${repayOption === "early" ? "btn-success" : "btn-primary"}`}
              onClick={handleRepay}
              disabled={processing}
            >
              {processing ? "처리 중..." : "확인"}
            </button>
          </>
        }
      >
        <div style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          {repayOption === "early" ? (
            <>
              <p style={{ marginBottom: "12px" }}>
                <strong>조기상환</strong>을 진행합니다.
              </p>
              <div
                style={{
                  padding: "12px 16px",
                  background: "rgba(22, 163, 74, 0.08)",
                  borderRadius: "12px",
                  border: "1px solid rgba(22, 163, 74, 0.2)",
                }}
              >
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  상환 금액
                </div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "#16a34a" }} className="font-mono">
                  {formatCurrency(contract.outstandingBalance)}
                </div>
              </div>
              <p style={{ marginTop: "12px", fontSize: "13px", color: "var(--text-muted)" }}>
                조기상환 후 대출이 완료 처리됩니다.
              </p>
            </>
          ) : (
            <>
              <p style={{ marginBottom: "12px" }}>
                <strong>정기상환</strong>을 진행합니다.
              </p>
              <div
                style={{
                  padding: "12px 16px",
                  background: "rgba(59, 130, 246, 0.08)",
                  borderRadius: "12px",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                }}
              >
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  상환 금액
                </div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "#1d4ed8" }} className="font-mono">
                  {formatCurrency(amount)}
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
