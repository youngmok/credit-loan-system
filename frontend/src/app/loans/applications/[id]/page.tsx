"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { applicationApi, contractApi, customerApi } from "@/lib/api";
import {
  LoanApplication,
  CreditAssessment,
  StatusHistory,
  Customer,
} from "@/types/loan";
import {
  formatCurrency,
  formatPercent,
  formatDate,
  formatDateTime,
  getRepaymentMethodLabel,
  getAssessmentResultLabel,
} from "@/lib/formatters";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/loan/StatusBadge";
import StatusTimeline from "@/components/loan/StatusTimeline";
import CreditScoreGauge from "@/components/loan/CreditScoreGauge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Modal from "@/components/ui/Modal";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ApplicationDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const applicationId = parseInt(id, 10);

  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [assessment, setAssessment] = useState<CreditAssessment | null>(null);
  const [history, setHistory] = useState<StatusHistory[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<string>("");

  useEffect(() => {
    loadData();
  }, [applicationId]);

  async function loadData() {
    try {
      setLoading(true);
      const app = await applicationApi.getById(applicationId);
      setApplication(app);

      // Load customer
      try {
        const cust = await customerApi.getById(app.customerId);
        setCustomer(cust);
      } catch {
        // Customer info might not be available
      }

      // Load history
      try {
        const hist = await applicationApi.getHistory(applicationId);
        setHistory(hist);
      } catch {
        // History might not be available
      }

      // Load assessment if status is beyond REVIEWING
      const assessedStatuses = ["APPROVED", "REJECTED", "EXECUTED", "ACTIVE", "COMPLETED"];
      if (assessedStatuses.includes(app.status)) {
        try {
          const assess = await applicationApi.getAssessment(applicationId);
          setAssessment(assess);
        } catch {
          // Assessment might not exist yet
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    try {
      setActionLoading(true);
      await applicationApi.submit(applicationId);
      await loadData();
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
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "심사 처리 중 오류가 발생했습니다."
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
        err instanceof Error
          ? err.message
          : "대출 실행 중 오류가 발생했습니다."
      );
      setActionLoading(false);
      setShowConfirmModal(false);
    }
  }

  function openConfirmModal(action: string) {
    setConfirmAction(action);
    setShowConfirmModal(true);
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

  const confirmMessages: Record<string, { title: string; message: string }> = {
    submit: {
      title: "신청 제출",
      message: "대출 신청을 제출하시겠습니까? 제출 후에는 수정할 수 없습니다.",
    },
    assess: {
      title: "심사 실행",
      message:
        "신용평가 심사를 실행하시겠습니까? 심사 결과에 따라 승인 또는 거절됩니다.",
    },
    execute: {
      title: "대출 실행",
      message:
        "대출을 실행하시겠습니까? 실행 즉시 대출금이 지급되며, 상환 일정이 생성됩니다.",
    },
  };

  if (loading) {
    return <LoadingSpinner size="lg" message="신청 정보를 불러오는 중..." />;
  }

  if (error && !application) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <p style={{ color: "#dc2626", fontSize: "16px", marginBottom: "16px" }}>
            {error}
          </p>
          <button className="btn btn-primary" onClick={() => router.back()}>
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!application) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Back Navigation */}
      <Link href="/loans/applications" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-8">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        신청 현황으로 돌아가기
      </Link>

      {/* Page Header */}
      <div className="mb-12 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              대출 신청 #{application.id}
            </h1>
            <StatusBadge status={application.status} />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            신청일: {formatDateTime(application.createdAt)}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          {application.status === "DRAFT" && (
            <button
              className="btn btn-primary"
              onClick={() => openConfirmModal("submit")}
              disabled={actionLoading}
            >
              신청 제출
            </button>
          )}
          {application.status === "APPLIED" && (
            <button
              className="btn btn-primary"
              onClick={() => openConfirmModal("assess")}
              disabled={actionLoading}
            >
              심사 실행
            </button>
          )}
          {application.status === "APPROVED" && (
            <button
              className="btn btn-success"
              onClick={() => openConfirmModal("execute")}
              disabled={actionLoading}
            >
              대출 실행
            </button>
          )}
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            background: "rgba(239, 68, 68, 0.08)",
            borderRadius: "12px",
            color: "#dc2626",
            fontSize: "14px",
            marginBottom: "24px",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}
        >
          {error}
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-3 detail-grid">
        {/* Left Column (2 cols wide) */}
        <div className="lg:col-span-2 space-y-10">
          {/* Application Info */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm hover:shadow-lg transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">신청 정보</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  대출 희망금액
                </div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "#1d4ed8" }} className="font-mono">
                  {formatCurrency(application.requestedAmount)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  대출 기간
                </div>
                <div style={{ fontSize: "16px", fontWeight: 600 }}>
                  {application.requestedTermMonths}개월
                </div>
              </div>
              <div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  상환 방식
                </div>
                <div style={{ fontSize: "15px", fontWeight: 600 }}>
                  {getRepaymentMethodLabel(application.repaymentMethod)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  기존 대출 잔액
                </div>
                <div style={{ fontSize: "15px", fontWeight: 600 }} className="font-mono">
                  {formatCurrency(application.existingLoanAmount)}
                </div>
              </div>
              {application.purpose && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                    대출 용도
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 600 }}>
                    {application.purpose}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Info */}
          {customer && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm hover:shadow-lg transition-all duration-300">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">고객 정보</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                <div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                    이름
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 600 }}>
                    {customer.name}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                    이메일
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 600 }}>
                    {customer.email}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                    연락처
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 600 }}>
                    {customer.phone}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                    연소득
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 600 }} className="font-mono">
                    {formatCurrency(customer.annualIncome)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Assessment Result */}
          {assessment && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm hover:shadow-lg transition-all duration-300">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">심사 결과</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
                  alignItems: "start",
                }}
              >
                <CreditScoreGauge
                  score={assessment.creditScore}
                  grade={assessment.creditGrade}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                      심사 결과
                    </div>
                    <div>
                      <span
                        className={`badge ${
                          assessment.result === "APPROVED"
                            ? "badge-success"
                            : assessment.result === "REJECTED"
                            ? "badge-danger"
                            : "badge-warning"
                        }`}
                        style={{ fontSize: "14px", padding: "4px 12px" }}
                      >
                        {getAssessmentResultLabel(assessment.result)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                      DSR 비율
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: 700 }} className="font-mono">
                      {formatPercent(assessment.dsrRatio)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                      승인 금리
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "#1d4ed8" }} className="font-mono">
                      {formatPercent(assessment.approvedRate)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                      승인 금액
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: 700 }} className="font-mono">
                      {formatCurrency(assessment.approvedAmount)}
                    </div>
                  </div>
                  {assessment.rejectionReason && (
                    <div>
                      <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                        거절 사유
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#dc2626",
                          padding: "8px 12px",
                          background: "rgba(239, 68, 68, 0.08)",
                          borderRadius: "8px",
                        }}
                      >
                        {assessment.rejectionReason}
                      </div>
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                      심사일시
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {formatDateTime(assessment.assessedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Timeline */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm hover:shadow-lg transition-all duration-300 h-fit">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">상태 이력</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">신청서의 처리 과정을 확인합니다.</p>
          <StatusTimeline history={history} />
        </div>
      </div>

      {/* Confirm Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={confirmMessages[confirmAction]?.title || "확인"}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setShowConfirmModal(false)}
              disabled={actionLoading}
            >
              취소
            </button>
            <button
              className={`btn ${
                confirmAction === "execute" ? "btn-success" : "btn-primary"
              }`}
              onClick={handleConfirm}
              disabled={actionLoading}
            >
              {actionLoading ? "처리 중..." : "확인"}
            </button>
          </>
        }
      >
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          {confirmMessages[confirmAction]?.message}
        </p>
      </Modal>

      <style>{`
        @media (max-width: 1024px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
