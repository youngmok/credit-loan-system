import React from "react";
import { SummaryCard } from "@/hooks/useContractList";

interface ContractSummaryCardsProps {
  summaryCards: SummaryCard[];
}

export default function ContractSummaryCards({ summaryCards }: ContractSummaryCardsProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "24px",
      }}
    >
      {summaryCards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div
            className="font-mono"
            style={{
              fontSize: "32px",
              fontWeight: 800,
              color: card.color,
              lineHeight: 1.2,
              textAlign: "center",
            }}
          >
            {card.value}
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              fontWeight: 500,
              marginTop: "4px",
              textAlign: "center",
            }}
          >
            {card.label}
          </div>
        </div>
      ))}
    </div>
  );
}
