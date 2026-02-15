import React from "react";
import { LoanContract } from "@/types/loan";
import {
  formatCurrency,
  formatPercent,
  getRepaymentMethodLabel,
  formatDate,
} from "@/lib/formatters";
import StatusBadge from "./StatusBadge";

interface LoanSummaryCardProps {
  contract: LoanContract;
}

export default function LoanSummaryCard({ contract }: LoanSummaryCardProps) {
  const fields = [
    { label: "대출원금", value: formatCurrency(contract.principalAmount) },
    { label: "금리", value: formatPercent(contract.interestRate) },
    { label: "대출기간", value: `${contract.termMonths}개월` },
    {
      label: "상환방식",
      value: getRepaymentMethodLabel(contract.repaymentMethod),
    },
    { label: "월 상환액", value: formatCurrency(contract.monthlyPayment) },
    {
      label: "대출잔액",
      value: formatCurrency(contract.outstandingBalance),
      highlight: true,
    },
    { label: "실행일", value: formatDate(contract.executedAt) },
    { label: "만기일", value: formatDate(contract.endDate) },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h3 className="card-title">대출 원장</h3>
            <p className="card-subtitle">
              계약번호: {contract.contractNo}
            </p>
          </div>
          <StatusBadge status={contract.status} />
        </div>
      </div>
      <div className="card-body">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
          }}
        >
          {fields.map((field) => (
            <div key={field.label}>
              <div
                style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}
              >
                {field.label}
              </div>
              <div
                style={{
                  fontSize: field.highlight ? "20px" : "15px",
                  fontWeight: field.highlight ? 800 : 600,
                  color: field.highlight ? "#1d4ed8" : "var(--text-heading)",
                }}
              >
                {field.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
