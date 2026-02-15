"use client";

import React from "react";
import { RepaymentMethod } from "@/types/loan";

interface RepaymentMethodSelectorProps {
  value: RepaymentMethod;
  onChange: (method: RepaymentMethod) => void;
}

interface MethodInfo {
  key: RepaymentMethod;
  label: string;
  description: string;
  barHeights: number[];
}

const methods: MethodInfo[] = [
  {
    key: "EQUAL_PRINCIPAL_AND_INTEREST",
    label: "원리금균등상환",
    description: "매월 동일한 금액(원금+이자)을 상환합니다. 초기 부담이 적어 가장 많이 사용됩니다.",
    barHeights: [60, 60, 60, 60, 60, 60, 60, 60],
  },
  {
    key: "EQUAL_PRINCIPAL",
    label: "원금균등상환",
    description: "매월 동일한 원금에 잔액 이자를 더해 상환합니다. 총 이자가 가장 적습니다.",
    barHeights: [90, 80, 70, 62, 55, 48, 42, 36],
  },
  {
    key: "BULLET",
    label: "만기일시상환",
    description: "매월 이자만 납부하고 만기에 원금을 일시 상환합니다. 월 부담이 가장 적습니다.",
    barHeights: [20, 20, 20, 20, 20, 20, 20, 95],
  },
];

export default function RepaymentMethodSelector({
  value,
  onChange,
}: RepaymentMethodSelectorProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {methods.map((method) => {
        const isSelected = value === method.key;
        return (
          <label
            key={method.key}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "16px",
              padding: "16px 20px",
              borderRadius: "12px",
              border: isSelected
                ? "2px solid #2563eb"
                : "2px solid var(--border-primary)",
              background: isSelected ? "rgba(59, 130, 246, 0.08)" : "var(--bg-primary)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <input
              type="radio"
              name="repaymentMethod"
              value={method.key}
              checked={isSelected}
              onChange={() => onChange(method.key)}
              style={{ marginTop: "4px", accentColor: "#2563eb" }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: isSelected ? "#1d4ed8" : "var(--text-heading)",
                  marginBottom: "4px",
                }}
              >
                {method.label}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                {method.description}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "3px",
                height: "50px",
                flexShrink: 0,
              }}
            >
              {method.barHeights.map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: "8px",
                    height: `${(h / 100) * 50}px`,
                    borderRadius: "2px 2px 0 0",
                    background: isSelected
                      ? `rgba(37, 99, 235, ${0.4 + (i / method.barHeights.length) * 0.6})`
                      : `rgba(148, 163, 184, ${0.3 + (i / method.barHeights.length) * 0.5})`,
                    transition: "background 0.2s ease",
                  }}
                />
              ))}
            </div>
          </label>
        );
      })}
    </div>
  );
}
