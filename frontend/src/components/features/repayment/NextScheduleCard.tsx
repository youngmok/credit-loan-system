import React from "react";
import { RepaymentSchedule } from "@/types/loan";
import { formatCurrency, formatDate } from "@/lib/formatters";

interface NextScheduleCardProps {
  schedule: RepaymentSchedule;
}

export default function NextScheduleCard({ schedule }: NextScheduleCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm hover:shadow-lg transition-all duration-300">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">다음 상환 예정</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "20px",
        }}
      >
        <div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
            회차
          </div>
          <div style={{ fontSize: "15px", fontWeight: 600 }}>
            {schedule.installmentNo}회
          </div>
        </div>
        <div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
            납부일
          </div>
          <div style={{ fontSize: "15px", fontWeight: 600 }}>
            {formatDate(schedule.dueDate)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
            납부금액
          </div>
          <div style={{ fontSize: "18px", fontWeight: 800, color: "#1d4ed8" }} className="font-mono">
            {formatCurrency(schedule.totalAmount)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
            상태
          </div>
          <span
            className={`badge ${
              schedule.status === "OVERDUE" ? "badge-danger" : "badge-default"
            }`}
          >
            {schedule.status === "OVERDUE" ? "연체" : "예정"}
          </span>
        </div>
      </div>
    </div>
  );
}
