import React from "react";
import { LoanContract } from "@/types/loan";
import { formatCurrency, formatPercent, getRepaymentMethodLabel } from "@/lib/formatters";
import StatusBadge from "@/components/loan/StatusBadge";

interface ContractSummarySectionProps {
  contract: LoanContract;
}

export default function ContractSummarySection({ contract }: ContractSummarySectionProps) {
  return (
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
  );
}
