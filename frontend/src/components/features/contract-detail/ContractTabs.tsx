"use client";

import React from "react";
import { TabType } from "@/hooks/useContractDetail";

interface ContractTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { key: TabType; label: string }[] = [
  { key: "summary", label: "원장" },
  { key: "schedule", label: "상환스케줄" },
  { key: "transactions", label: "거래내역" },
];

export default function ContractTabs({ activeTab, onTabChange }: ContractTabsProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "4px",
        borderBottom: "2px solid var(--border-primary)",
      }}
    >
      {tabs.map((tab) => {
        const isActiveTab = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            style={{
              padding: "12px 28px",
              fontSize: "14px",
              fontWeight: isActiveTab ? 700 : 500,
              color: isActiveTab ? "#1d4ed8" : "var(--text-secondary)",
              background: "none",
              border: "none",
              borderBottom: isActiveTab
                ? "2px solid #1d4ed8"
                : "2px solid transparent",
              cursor: "pointer",
              marginBottom: "-2px",
              transition: "all 0.2s ease",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
