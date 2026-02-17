"use client";

import React from "react";
import Link from "next/link";
import ErrorBanner from "@/components/ui/ErrorBanner";
import StatusBadge from "@/components/loan/StatusBadge";
import StatusTimeline from "@/components/loan/StatusTimeline";
import Modal from "@/components/ui/Modal";
import ApplicationInfoCard from "./ApplicationInfoCard";
import CustomerInfoCard from "./CustomerInfoCard";
import AssessmentResultCard from "./AssessmentResultCard";
import ApplicationActions from "./ApplicationActions";
import {
  useApplicationDetail,
  confirmMessages,
  ApplicationDetailInitialData,
} from "@/hooks/useApplicationDetail";
import { formatDateTime } from "@/lib/formatters";

interface ApplicationDetailClientProps {
  applicationId: number;
  initialData: ApplicationDetailInitialData;
  serverError?: string;
}

export default function ApplicationDetailClient({
  applicationId,
  initialData,
  serverError,
}: ApplicationDetailClientProps) {
  const {
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
  } = useApplicationDetail(applicationId, initialData);

  if ((serverError || error) && !application) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <p style={{ color: "#dc2626", fontSize: "16px", marginBottom: "16px" }}>
            {serverError || error}
          </p>
          <button className="btn btn-primary" onClick={goBack}>
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!application) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <Link href="/loans/applications" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-8">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        신청 현황으로 돌아가기
      </Link>

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
        <ApplicationActions
          status={application.status}
          actionLoading={actionLoading}
          onAction={openConfirmModal}
        />
      </div>

      {error && (
        <div style={{ marginBottom: "24px" }}>
          <ErrorBanner message={error} />
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-3 detail-grid">
        <div className="lg:col-span-2 space-y-10">
          <ApplicationInfoCard application={application} />
          {customer && <CustomerInfoCard customer={customer} />}
          {assessment && <AssessmentResultCard assessment={assessment} />}
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm hover:shadow-lg transition-all duration-300 h-fit">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">상태 이력</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">신청서의 처리 과정을 확인합니다.</p>
          <StatusTimeline history={history} />
        </div>
      </div>

      <Modal
        isOpen={showConfirmModal}
        onClose={closeConfirmModal}
        title={confirmMessages[confirmAction]?.title || "확인"}
        footer={
          <>
            <button className="btn btn-secondary" onClick={closeConfirmModal} disabled={actionLoading}>
              취소
            </button>
            <button
              className={`btn ${confirmAction === "execute" ? "btn-success" : "btn-primary"}`}
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
