import React from "react";
import { CreditAssessment } from "@/types/loan";
import {
  formatCurrency,
  formatPercent,
  formatDateTime,
  getAssessmentResultLabel,
} from "@/lib/formatters";
import CreditScoreGauge from "@/components/loan/CreditScoreGauge";

interface AssessmentResultCardProps {
  assessment: CreditAssessment;
}

export default function AssessmentResultCard({ assessment }: AssessmentResultCardProps) {
  return (
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
  );
}
