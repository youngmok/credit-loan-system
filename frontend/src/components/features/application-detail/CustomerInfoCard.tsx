import React from "react";
import { Customer } from "@/types/loan";
import { formatCurrency } from "@/lib/formatters";

interface CustomerInfoCardProps {
  customer: Customer;
}

export default function CustomerInfoCard({ customer }: CustomerInfoCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm hover:shadow-lg transition-all duration-300">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">고객 정보</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        <div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
            이름
          </div>
          <div style={{ fontSize: "15px", fontWeight: 600 }}>{customer.name}</div>
        </div>
        <div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
            이메일
          </div>
          <div style={{ fontSize: "15px", fontWeight: 600 }}>{customer.email}</div>
        </div>
        <div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
            연락처
          </div>
          <div style={{ fontSize: "15px", fontWeight: 600 }}>{customer.phone}</div>
        </div>
        <div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
            연소득
          </div>
          <div style={{ fontSize: "15px", fontWeight: 600 }} className="font-mono">
            {formatCurrency(customer.annualIncome)}
          </div>
        </div>
      </div>
    </div>
  );
}
