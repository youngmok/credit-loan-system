import React from "react";
import { RepaymentMethod } from "@/types/loan";
import { formatCurrency, formatPercent, getRepaymentMethodLabel } from "@/lib/formatters";
import {
  calculateMonthlyPayment,
  calculateTotalInterest,
  calculateTotalRepayment,
} from "@/lib/loan-calculator";
import { LoanFormData, ASSUMED_RATE, simulationMethods } from "@/hooks/useLoanApply";

interface SimulationStepProps {
  loanForm: LoanFormData;
}

export default function SimulationStep({ loanForm }: SimulationStepProps) {
  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-10 shadow-sm hover:shadow-lg transition-all duration-300">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">대출 시뮬레이션</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">선택하신 조건에 따른 예상 상환금액입니다.</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "24px",
              background: "rgba(59, 130, 246, 0.08)",
              borderRadius: "12px",
            }}
          >
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
              월 상환액
            </div>
            <div
              className="font-mono"
              style={{ fontSize: "22px", fontWeight: 800, color: "#1d4ed8" }}
            >
              {formatCurrency(
                calculateMonthlyPayment(
                  loanForm.requestedAmount,
                  ASSUMED_RATE,
                  loanForm.requestedTermMonths,
                  loanForm.repaymentMethod
                )
              )}
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              padding: "24px",
              background: "rgba(245, 158, 11, 0.08)",
              borderRadius: "12px",
            }}
          >
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
              총 이자
            </div>
            <div
              className="font-mono"
              style={{ fontSize: "22px", fontWeight: 800, color: "#b45309" }}
            >
              {formatCurrency(
                calculateTotalInterest(
                  loanForm.requestedAmount,
                  ASSUMED_RATE,
                  loanForm.requestedTermMonths,
                  loanForm.repaymentMethod
                )
              )}
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              padding: "24px",
              background: "rgba(22, 163, 74, 0.08)",
              borderRadius: "12px",
            }}
          >
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
              총 상환액
            </div>
            <div
              className="font-mono"
              style={{ fontSize: "22px", fontWeight: 800, color: "#15803d" }}
            >
              {formatCurrency(
                calculateTotalRepayment(
                  loanForm.requestedAmount,
                  ASSUMED_RATE,
                  loanForm.requestedTermMonths,
                  loanForm.repaymentMethod
                )
              )}
            </div>
          </div>
        </div>
        <p
          style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            textAlign: "center",
          }}
        >
          * 예상 금리 {formatPercent(ASSUMED_RATE)} 기준 시뮬레이션입니다.
          실제 금리는 신용평가 결과에 따라 달라질 수 있습니다.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-10 shadow-sm hover:shadow-lg transition-all duration-300">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">상환방식별 비교</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">세 가지 상환방식의 예상 금액을 비교합니다.</p>
        <div className="table-container" style={{ border: "none" }}>
          <table className="table">
            <thead>
              <tr>
                <th>상환방식</th>
                <th style={{ textAlign: "right" }}>첫달 상환액</th>
                <th style={{ textAlign: "right" }}>총 이자</th>
                <th style={{ textAlign: "right" }}>총 상환액</th>
              </tr>
            </thead>
            <tbody>
              {simulationMethods.map((method) => {
                const isSelected = method === loanForm.repaymentMethod;
                return (
                  <tr
                    key={method}
                    style={{
                      background: isSelected ? "rgba(59, 130, 246, 0.08)" : undefined,
                    }}
                  >
                    <td>
                      <span style={{ fontWeight: isSelected ? 700 : 500 }}>
                        {getRepaymentMethodLabel(method)}
                      </span>
                      {isSelected && (
                        <span className="badge badge-info" style={{ marginLeft: "8px" }}>
                          선택
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 600 }} className="font-mono">
                      {formatCurrency(
                        calculateMonthlyPayment(
                          loanForm.requestedAmount,
                          ASSUMED_RATE,
                          loanForm.requestedTermMonths,
                          method
                        )
                      )}
                    </td>
                    <td style={{ textAlign: "right" }} className="font-mono">
                      {formatCurrency(
                        calculateTotalInterest(
                          loanForm.requestedAmount,
                          ASSUMED_RATE,
                          loanForm.requestedTermMonths,
                          method
                        )
                      )}
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 600 }} className="font-mono">
                      {formatCurrency(
                        calculateTotalRepayment(
                          loanForm.requestedAmount,
                          ASSUMED_RATE,
                          loanForm.requestedTermMonths,
                          method
                        )
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
