"use client";

import React from "react";
import { LoanContract } from "@/types/loan";
import { formatCurrency } from "@/lib/formatters";
import { RepaymentOption } from "@/hooks/useRepayment";

interface RepaymentOptionsProps {
  repayOption: RepaymentOption;
  amount: number;
  contract: LoanContract;
  onSelectScheduled: () => void;
  onSelectEarly: () => void;
  onAmountChange: (amount: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function RepaymentOptions({
  repayOption,
  amount,
  contract,
  onSelectScheduled,
  onSelectEarly,
  onAmountChange,
  onSubmit,
  onCancel,
}: RepaymentOptionsProps) {
  return (
    <>
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
              onChange={onSelectScheduled}
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
                    onChange={(e) => onAmountChange(Number(e.target.value))}
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
              onChange={onSelectEarly}
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
        <button className="btn btn-secondary" onClick={onCancel}>
          취소
        </button>
        <button
          className={`btn ${repayOption === "early" ? "btn-success" : "btn-primary"} btn-lg`}
          onClick={onSubmit}
          disabled={repayOption === "scheduled" && amount <= 0}
        >
          {repayOption === "early"
            ? `조기상환 (${formatCurrency(contract.outstandingBalance)})`
            : `상환하기 (${formatCurrency(amount)})`}
        </button>
      </div>
    </>
  );
}
