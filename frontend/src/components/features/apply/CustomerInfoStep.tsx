"use client";

import React from "react";
import { Customer, EmploymentType } from "@/types/loan";
import { formatCurrency, getEmploymentTypeLabel } from "@/lib/formatters";
import { CustomerFormData, employmentTypes } from "@/hooks/useLoanApply";

interface CustomerInfoStepProps {
  isNewCustomer: boolean;
  existingCustomers: Customer[];
  selectedCustomerId: number | null;
  selectedCustomer: Customer | undefined;
  customerForm: CustomerFormData;
  onSelectNew: () => void;
  onSelectExisting: () => void;
  onSelectCustomerId: (id: number | null) => void;
  onCustomerChange: (field: string, value: string | number) => void;
}

export default function CustomerInfoStep({
  isNewCustomer,
  existingCustomers,
  selectedCustomerId,
  selectedCustomer,
  customerForm,
  onSelectNew,
  onSelectExisting,
  onSelectCustomerId,
  onCustomerChange,
}: CustomerInfoStepProps) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-10 shadow-sm hover:shadow-lg transition-all duration-300">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">고객 정보</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">대출을 신청할 고객 정보를 입력하세요.</p>
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          <button
            className={`btn ${isNewCustomer ? "btn-primary" : "btn-secondary"}`}
            onClick={onSelectNew}
          >
            신규 고객
          </button>
          <button
            className={`btn ${!isNewCustomer ? "btn-primary" : "btn-secondary"}`}
            onClick={onSelectExisting}
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
                onSelectCustomerId(
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
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 mt-4">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <div>
                    <span style={{ color: "var(--text-secondary)" }}>이름: </span>
                    <span style={{ fontWeight: 600 }}>{selectedCustomer.name}</span>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-secondary)" }}>연락처: </span>
                    <span style={{ fontWeight: 600 }}>{selectedCustomer.phone}</span>
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
                onChange={(e) => onCustomerChange("name", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">이메일 *</label>
              <input
                type="email"
                className="form-input"
                placeholder="hong@example.com"
                value={customerForm.email}
                onChange={(e) => onCustomerChange("email", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">연락처 *</label>
              <input
                type="tel"
                className="form-input"
                placeholder="010-1234-5678"
                value={customerForm.phone}
                onChange={(e) => onCustomerChange("phone", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">생년월일</label>
              <input
                type="date"
                className="form-input"
                min="1900-01-01"
                max="2099-12-31"
                value={customerForm.birthDate}
                onChange={(e) => {
                  const val = e.target.value;
                  const year = val.split("-")[0];
                  if (year && year.length > 4) return;
                  onCustomerChange("birthDate", val);
                }}
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
                  onCustomerChange("annualIncome", Number(e.target.value))
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
                onChange={(e) => onCustomerChange("employmentType", e.target.value)}
              >
                {employmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {getEmploymentTypeLabel(type)}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">직장명</label>
              <input
                type="text"
                className="form-input"
                placeholder="(주)회사명"
                value={customerForm.company}
                onChange={(e) => onCustomerChange("company", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
