"use client";

import React from "react";
import { FilterTab, TabItem } from "@/hooks/useApplicationList";

interface ApplicationFilterTabsProps {
  activeTab: FilterTab;
  tabs: TabItem[];
  getCount: (tabKey: FilterTab) => number;
  onTabChange: (tab: FilterTab) => void;
}

export default function ApplicationFilterTabs({
  activeTab,
  tabs,
  getCount,
  onTabChange,
}: ApplicationFilterTabsProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "4px",
        borderBottom: "2px solid var(--border-primary)",
        paddingBottom: "0",
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const count = getCount(tab.key);
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            style={{
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: isActive ? 700 : 500,
              color: isActive ? "#1d4ed8" : "var(--text-secondary)",
              background: "none",
              border: "none",
              borderBottom: isActive
                ? "2px solid #1d4ed8"
                : "2px solid transparent",
              cursor: "pointer",
              marginBottom: "-2px",
              transition: "all 0.2s ease",
            }}
          >
            {tab.label}
            <span
              style={{
                marginLeft: "6px",
                fontSize: "12px",
                padding: "1px 6px",
                borderRadius: "9999px",
                background: isActive ? "rgba(59, 130, 246, 0.08)" : "var(--bg-tertiary)",
                color: isActive ? "#1d4ed8" : "var(--text-muted)",
              }}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
