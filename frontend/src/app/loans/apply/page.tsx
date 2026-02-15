"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { customerApi, applicationApi } from "@/lib/api";
import { Customer, RepaymentMethod, EmploymentType } from "@/types/loan";
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
import Card from "@/components/ui/Card";
import StepIndicator from "@/components/ui/StepIndicator";
import RepaymentMethodSelector from "@/components/loan/RepaymentMethodSelector";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const steps = [
  { label: "고객 정보" },
  { label: "대출 조건" },
  { label: "시뮬레이션" },
  { label: "확인 및 제출" },
];

const termOptions = [6, 12, 24, 36, 48, 60];

const employmentTypes: EmploymentType[] = [
  "REGULAR",
  "CONTRACT",
  "SELF_EMPLOYED",
  "FREELANCE",
  "UNEMPLOYED",
];

const ASSUMED_RATE = 5.5; // Assumed annual rate for simulation

export default function LoanApplyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Customer Info
  const [existingCustomers, setExistingCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [isNewCustomer, setIsNewCustomer] = useState(true);
  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    annualIncome: 0,
    employmentType: "REGULAR" as EmploymentType,
    company: "",
  });

  // Step 2: Loan Terms
  const [loanForm, setLoanForm] = useState({
    requestedAmount: 10000000,
    requestedTermMonths: 12,
    repaymentMethod: "EQUAL_PRINCIPAL_AND_INTEREST" as RepaymentMethod,
    existingLoanAmount: 0,
    purpose: "",
  });

  useEffect(() => {
    customerApi.getAll().then(setExistingCustomers).catch(() => {});
  }, []);

  function handleCustomerChange(
    field: string,
    value: string | number
  ) {
    setCustomerForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleLoanChange(field: string, value: string | number) {
    setLoanForm((prev) => ({ ...prev, [field]: value }));
  }

  function nextStep() {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setError(null);
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  }

  function validateStep1(): boolean {
    if (!isNewCustomer) {
      if (!selectedCustomerId) {
        setError("고객을 선택해주세요.");
        return false;
      }
      return true;
    }
    if (!customerForm.name.trim()) {
      setError("이름을 입력해주세요.");
      return false;
    }
    if (!customerForm.email.trim()) {
      setError("이메일을 입력해주세요.");
      return false;
    }
    if (!customerForm.phone.trim()) {
      setError("연락처를 입력해주세요.");
      return false;
    }
    if (customerForm.annualIncome <= 0) {
      setError("연소득을 입력해주세요.");
      return false;
    }
    return true;
  }

  function validateStep2(): boolean {
    if (loanForm.requestedAmount < 1000000) {
      setError("대출 금액은 최소 100만원 이상이어야 합니다.");
      return false;
    }
    if (!loanForm.purpose.trim()) {
      setError("대출 용도를 입력해주세요.");
      return false;
    }
    return true;
  }

  function handleNext() {
    setError(null);
    if (currentStep === 0 && !validateStep1()) return;
    if (currentStep === 1 && !validateStep2()) return;
    nextStep();
  }

  async function handleSubmit() {
    try {
      setSubmitting(true);
      setError(null);

      let customerId = selectedCustomerId;

      if (isNewCustomer) {
        const customer = await customerApi.create({
          ...customerForm,
          annualIncome: Number(customerForm.annualIncome),
        });
        customerId = customer.id;
      }

      if (!customerId) {
        setError("고객 정보가 올바르지 않습니다.");
        return;
      }

      const application = await applicationApi.create({
        customerId,
        requestedAmount: loanForm.requestedAmount,
        requestedTermMonths: loanForm.requestedTermMonths,
        repaymentMethod: loanForm.repaymentMethod,
        existingLoanAmount: loanForm.existingLoanAmount,
        purpose: loanForm.purpose,
      });

      await applicationApi.submit(application.id);

      router.push(`/loans/applications/${application.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "신청 처리 중 오류가 발생했습니다."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const simulationMethods: RepaymentMethod[] = [
    "EQUAL_PRINCIPAL_AND_INTEREST",
    "EQUAL_PRINCIPAL",
    "BULLET",
  ];

  const selectedCustomer = existingCustomers.find(
    (c) => c.id === selectedCustomerId
  );

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          대출 신청
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          아래 단계를 따라 대출을 신청하세요.
        </p>
      </div>

      <div className="space-y-10">
        <StepIndicator steps={steps} currentStep={currentStep} />

        {error && (
          <div
            style={{
              padding: "12px 16px",
              background: "rgba(239, 68, 68, 0.08)",
              borderRadius: "12px",
              color: "#dc2626",
              fontSize: "14px",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            {error}
          </div>
        )}

        {/* Step 1: Customer Info */}
        {currentStep === 0 && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-10 shadow-sm hover:shadow-lg transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">고객 정보</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">대출을 신청할 고객 정보를 입력하세요.</p>
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
                <button
                  className={`btn ${isNewCustomer ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => {
                    setIsNewCustomer(true);
                    setSelectedCustomerId(null);
                  }}
                >
                  신규 고객
                </button>
                <button
                  className={`btn ${!isNewCustomer ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setIsNewCustomer(false)}
                >
                  기존 고객
                </button>
              </div>

              {!isNewCustomer ? (
                <div className="form-group">
                  <label className="form-label">고객 선택</label>
                  <select
                    className="form-select"
                    value={selectedCustomerId ?? ""}
                    onChange={(e) =>
                      setSelectedCustomerId(
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                  >
                    <option value="">고객을 선택하세요</option>
                    {existingCustomers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.email})
                      </option>
                    ))}
                  </select>
                  {selectedCustomer && (
                    <div
                      className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 mt-4"
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "12px",
                        }}
                      >
                        <div>
                          <span style={{ color: "var(--text-secondary)" }}>이름: </span>
                          <span style={{ fontWeight: 600 }}>
                            {selectedCustomer.name}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: "var(--text-secondary)" }}>연락처: </span>
                          <span style={{ fontWeight: 600 }}>
                            {selectedCustomer.phone}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: "var(--text-secondary)" }}>연소득: </span>
                          <span style={{ fontWeight: 600 }} className="font-mono">
                            {formatCurrency(selectedCustomer.annualIncome)}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: "var(--text-secondary)" }}>고용형태: </span>
                          <span style={{ fontWeight: 600 }}>
                            {getEmploymentTypeLabel(selectedCustomer.employmentType)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                  }}
                >
                  <div className="form-group">
                    <label className="form-label">이름 *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="홍길동"
                      value={customerForm.name}
                      onChange={(e) =>
                        handleCustomerChange("name", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">이메일 *</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="hong@example.com"
                      value={customerForm.email}
                      onChange={(e) =>
                        handleCustomerChange("email", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">연락처 *</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="010-1234-5678"
                      value={customerForm.phone}
                      onChange={(e) =>
                        handleCustomerChange("phone", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">생년월일</label>
                    <input
                      type="date"
                      className="form-input"
                      value={customerForm.birthDate}
                      onChange={(e) =>
                        handleCustomerChange("birthDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">연소득 *</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="50000000"
                      value={customerForm.annualIncome || ""}
                      onChange={(e) =>
                        handleCustomerChange(
                          "annualIncome",
                          Number(e.target.value)
                        )
                      }
                    />
                    <p className="form-helper">
                      {customerForm.annualIncome > 0
                        ? formatCurrency(customerForm.annualIncome)
                        : "원 단위로 입력"}
                    </p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">고용형태</label>
                    <select
                      className="form-select"
                      value={customerForm.employmentType}
                      onChange={(e) =>
                        handleCustomerChange("employmentType", e.target.value)
                      }
                    >
                      {employmentTypes.map((type) => (
                        <option key={type} value={type}>
                          {getEmploymentTypeLabel(type)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div
                    className="form-group"
                    style={{ gridColumn: "1 / -1" }}
                  >
                    <label className="form-label">직장명</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="(주)회사명"
                      value={customerForm.company}
                      onChange={(e) =>
                        handleCustomerChange("company", e.target.value)
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Loan Terms */}
        {currentStep === 1 && (
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
                  onChange={(e) =>
                    handleLoanChange("requestedAmount", Number(e.target.value))
                  }
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
                  onChange={(e) =>
                    handleLoanChange("requestedAmount", Number(e.target.value))
                  }
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
                      onClick={() => handleLoanChange("requestedTermMonths", term)}
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
                  onChange={(method) =>
                    handleLoanChange("repaymentMethod", method)
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">기존 대출 잔액</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="0"
                  value={loanForm.existingLoanAmount || ""}
                  onChange={(e) =>
                    handleLoanChange("existingLoanAmount", Number(e.target.value))
                  }
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
                  onChange={(e) => handleLoanChange("purpose", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Simulation */}
        {currentStep === 2 && (
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
                  <div
                    style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}
                  >
                    월 상환액
                  </div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: "22px",
                      fontWeight: 800,
                      color: "#1d4ed8",
                    }}
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
                  <div
                    style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}
                  >
                    총 이자
                  </div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: "22px",
                      fontWeight: 800,
                      color: "#b45309",
                    }}
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
                  <div
                    style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}
                  >
                    총 상환액
                  </div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: "22px",
                      fontWeight: 800,
                      color: "#15803d",
                    }}
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
                              <span
                                className="badge badge-info"
                                style={{ marginLeft: "8px" }}
                              >
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
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 3 && (
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
                        <span style={{ fontWeight: 600 }}>
                          {customerForm.email}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: "var(--text-secondary)" }}>연락처: </span>
                        <span style={{ fontWeight: 600 }}>
                          {customerForm.phone}
                        </span>
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
                          <span style={{ fontWeight: 600 }}>
                            {customerForm.company}
                          </span>
                        </div>
                      )}
                    </>
                  ) : selectedCustomer ? (
                    <>
                      <div>
                        <span style={{ color: "var(--text-secondary)" }}>이름: </span>
                        <span style={{ fontWeight: 600 }}>
                          {selectedCustomer.name}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: "var(--text-secondary)" }}>이메일: </span>
                        <span style={{ fontWeight: 600 }}>
                          {selectedCustomer.email}
                        </span>
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
                    <span style={{ fontWeight: 600 }}>
                      {loanForm.requestedTermMonths}개월
                    </span>
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
        )}

        {/* Navigation Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "8px",
          }}
        >
          <button
            className="btn btn-secondary"
            onClick={prevStep}
            disabled={currentStep === 0}
            style={{ visibility: currentStep === 0 ? "hidden" : "visible" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            이전
          </button>

          {currentStep < steps.length - 1 ? (
            <button className="btn btn-primary" onClick={handleNext}>
              다음
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ) : (
            <button
              className="btn btn-success btn-lg"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  처리 중...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  대출 신청 제출
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
