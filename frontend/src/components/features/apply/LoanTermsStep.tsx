"use client";

import React from "react";
import { formatCurrency } from "@/lib/formatters";
import RepaymentMethodSelector from "@/components/loan/RepaymentMethodSelector";
import { LoanFormData, termOptions } from "@/hooks/useLoanApply";

interface LoanTermsStepProps {
  loanForm: LoanFormData;
  onLoanChange: (field: string, value: string | number) => void;
}

export default function LoanTermsStep({ loanForm, onLoanChange }: LoanTermsStepProps) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-10 shadow-sm hover:shadow-lg transition-all duration-300">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">대출 조건</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">원하는 대출 조건을 설정하세요.</p>
      <div className="space-y-6">
        <div className="form-group">
          <label className="form-label">
            대출 희망금액: {formatCurrency(loanForm.requestedAmount)}
          </label>
          <input
            type="range"
            className="range-slider"
            min={1000000}
            max={500000000}
            step={1000000}
            value={loanForm.requestedAmount}
            onChange={(e) => onLoanChange("requestedAmount", Number(e.target.value))}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              color: "var(--text-muted)",
              marginTop: "4px",
            }}
          >
            <span>100만원</span>
            <span>5억원</span>
          </div>
          <input
            type="number"
            className="form-input"
            style={{ marginTop: "8px" }}
            value={loanForm.requestedAmount}
            onChange={(e) => onLoanChange("requestedAmount", Number(e.target.value))}
            min={1000000}
            max={500000000}
            step={1000000}
          />
        </div>

        <div className="form-group">
          <label className="form-label">대출 기간</label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {termOptions.map((term) => (
              <button
                key={term}
                className={`btn ${
                  loanForm.requestedTermMonths === term
                    ? "btn-primary"
                    : "btn-secondary"
                } btn-sm`}
                onClick={() => onLoanChange("requestedTermMonths", term)}
              >
                {term}개월
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">상환 방식</label>
          <RepaymentMethodSelector
            value={loanForm.repaymentMethod}
            onChange={(method) => onLoanChange("repaymentMethod", method)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">기존 대출 잔액</label>
          <input
            type="number"
            className="form-input"
            placeholder="0"
            value={loanForm.existingLoanAmount || ""}
            onChange={(e) => onLoanChange("existingLoanAmount", Number(e.target.value))}
          />
          <p className="form-helper">
            {loanForm.existingLoanAmount > 0
              ? formatCurrency(loanForm.existingLoanAmount)
              : "다른 금융기관의 기존 대출 잔액을 입력해주세요"}
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">대출 용도 *</label>
          <input
            type="text"
            className="form-input"
            placeholder="예: 생활비, 사업자금, 주택자금 등"
            value={loanForm.purpose}
            onChange={(e) => onLoanChange("purpose", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
