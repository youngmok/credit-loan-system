import React from "react";
import { LoanContract } from "@/types/loan";
import { formatCurrency, getRepaymentMethodLabel } from "@/lib/formatters";
import LoanSummaryCard from "@/components/loan/LoanSummaryCard";

interface ContractSummaryTabProps {
  contract: LoanContract;
}

export default function ContractSummaryTab({ contract }: ContractSummaryTabProps) {
  return (
    <div className="space-y-10">
      <LoanSummaryCard contract={contract} />

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm hover:shadow-lg transition-all duration-300">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">상환 정보</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          <div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
              총 이자
            </div>
            <div style={{ fontSize: "16px", fontWeight: 700 }} className="font-mono">
              {formatCurrency(contract.totalInterestPaid)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
              총 상환액
            </div>
            <div style={{ fontSize: "16px", fontWeight: 700 }} className="font-mono">
              {formatCurrency(contract.principalAmount + contract.totalInterestPaid)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
              상환방식
            </div>
            <div style={{ fontSize: "15px", fontWeight: 600 }}>
              {getRepaymentMethodLabel(contract.repaymentMethod)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
