import React from "react";
import { LoanApplication } from "@/types/loan";
import { formatCurrency, getRepaymentMethodLabel } from "@/lib/formatters";

interface ApplicationInfoCardProps {
  application: LoanApplication;
}

export default function ApplicationInfoCard({ application }: ApplicationInfoCardProps) {
  return (
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
  );
}
