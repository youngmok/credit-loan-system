"use client";

import React from "react";
import { RepaymentResult as RepaymentResultType } from "@/hooks/useRepayment";

interface RepaymentResultProps {
  result: RepaymentResultType;
  onGoToContract: () => void;
  onRetry: () => void;
}

export default function RepaymentResult({
  result,
  onGoToContract,
  onRetry,
}: RepaymentResultProps) {
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
            <button className="btn btn-secondary" onClick={onGoToContract}>
              계약 상세로 이동
            </button>
            {!result.success && (
              <button className="btn btn-primary" onClick={onRetry}>
                다시 시도
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
