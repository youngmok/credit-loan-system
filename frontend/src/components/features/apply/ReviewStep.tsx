import React from "react";
import { Customer } from "@/types/loan";
import {
  formatCurrency,
  formatPercent,
  getRepaymentMethodLabel,
  getEmploymentTypeLabel,
} from "@/lib/formatters";
import {
  calculateMonthlyPayment,
  calculateTotalInterest,
  calculateTotalRepayment,
} from "@/lib/loan-calculator";
import { CustomerFormData, LoanFormData, ASSUMED_RATE } from "@/hooks/useLoanApply";

interface ReviewStepProps {
  isNewCustomer: boolean;
  customerForm: CustomerFormData;
  selectedCustomer: Customer | undefined;
  loanForm: LoanFormData;
}

export default function ReviewStep({
  isNewCustomer,
  customerForm,
  selectedCustomer,
  loanForm,
}: ReviewStepProps) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-10 shadow-sm hover:shadow-lg transition-all duration-300">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">신청 내용 확인</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">아래 정보를 확인한 후 제출해주세요.</p>

      <div className="space-y-6">
        {/* Customer Info Review */}
        <div
          style={{
            padding: "20px",
            background: "var(--bg-secondary)",
            borderRadius: "12px",
          }}
        >
          <h4
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "16px",
            }}
          >
            고객 정보
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              fontSize: "14px",
            }}
          >
            {isNewCustomer ? (
              <>
                <div>
                  <span style={{ color: "var(--text-secondary)" }}>이름: </span>
                  <span style={{ fontWeight: 600 }}>{customerForm.name}</span>
                </div>
                <div>
                  <span style={{ color: "var(--text-secondary)" }}>이메일: </span>
                  <span style={{ fontWeight: 600 }}>{customerForm.email}</span>
                </div>
                <div>
                  <span style={{ color: "var(--text-secondary)" }}>연락처: </span>
                  <span style={{ fontWeight: 600 }}>{customerForm.phone}</span>
                </div>
                <div>
                  <span style={{ color: "var(--text-secondary)" }}>연소득: </span>
                  <span style={{ fontWeight: 600 }} className="font-mono">
                    {formatCurrency(customerForm.annualIncome)}
                  </span>
                </div>
                <div>
                  <span style={{ color: "var(--text-secondary)" }}>고용형태: </span>
                  <span style={{ fontWeight: 600 }}>
                    {getEmploymentTypeLabel(customerForm.employmentType)}
                  </span>
                </div>
                {customerForm.company && (
                  <div>
                    <span style={{ color: "var(--text-secondary)" }}>직장명: </span>
                    <span style={{ fontWeight: 600 }}>{customerForm.company}</span>
                  </div>
                )}
              </>
            ) : selectedCustomer ? (
              <>
                <div>
                  <span style={{ color: "var(--text-secondary)" }}>이름: </span>
                  <span style={{ fontWeight: 600 }}>{selectedCustomer.name}</span>
                </div>
                <div>
                  <span style={{ color: "var(--text-secondary)" }}>이메일: </span>
                  <span style={{ fontWeight: 600 }}>{selectedCustomer.email}</span>
                </div>
                <div>
                  <span style={{ color: "var(--text-secondary)" }}>연소득: </span>
                  <span style={{ fontWeight: 600 }} className="font-mono">
                    {formatCurrency(selectedCustomer.annualIncome)}
                  </span>
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* Loan Terms Review */}
        <div
          style={{
            padding: "20px",
            background: "var(--bg-secondary)",
            borderRadius: "12px",
          }}
        >
          <h4
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "16px",
            }}
          >
            대출 조건
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              fontSize: "14px",
            }}
          >
            <div>
              <span style={{ color: "var(--text-secondary)" }}>대출금액: </span>
              <span style={{ fontWeight: 700, color: "#1d4ed8" }} className="font-mono">
                {formatCurrency(loanForm.requestedAmount)}
              </span>
            </div>
            <div>
              <span style={{ color: "var(--text-secondary)" }}>대출기간: </span>
              <span style={{ fontWeight: 600 }}>{loanForm.requestedTermMonths}개월</span>
            </div>
            <div>
              <span style={{ color: "var(--text-secondary)" }}>상환방식: </span>
              <span style={{ fontWeight: 600 }}>
                {getRepaymentMethodLabel(loanForm.repaymentMethod)}
              </span>
            </div>
            <div>
              <span style={{ color: "var(--text-secondary)" }}>기존대출: </span>
              <span style={{ fontWeight: 600 }} className="font-mono">
                {formatCurrency(loanForm.existingLoanAmount)}
              </span>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <span style={{ color: "var(--text-secondary)" }}>대출용도: </span>
              <span style={{ fontWeight: 600 }}>{loanForm.purpose}</span>
            </div>
          </div>
        </div>

        {/* Simulation Summary */}
        <div
          style={{
            padding: "20px",
            background: "rgba(59, 130, 246, 0.08)",
            borderRadius: "12px",
            border: "1px solid rgba(59, 130, 246, 0.2)",
          }}
        >
          <h4
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#1d4ed8",
              marginBottom: "16px",
            }}
          >
            예상 상환 정보 (예상금리 {formatPercent(ASSUMED_RATE)} 기준)
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "12px",
              fontSize: "14px",
            }}
          >
            <div>
              <div style={{ color: "var(--text-secondary)", marginBottom: "2px" }}>
                월 상환액
              </div>
              <div style={{ fontWeight: 700, color: "#1d4ed8" }} className="font-mono">
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
            <div>
              <div style={{ color: "var(--text-secondary)", marginBottom: "2px" }}>
                총 이자
              </div>
              <div style={{ fontWeight: 700, color: "#b45309" }} className="font-mono">
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
            <div>
              <div style={{ color: "var(--text-secondary)", marginBottom: "2px" }}>
                총 상환액
              </div>
              <div style={{ fontWeight: 700, color: "#15803d" }} className="font-mono">
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
        </div>
      </div>
    </div>
  );
}
