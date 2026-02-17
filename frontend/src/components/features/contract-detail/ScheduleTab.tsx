import React from "react";
import { RepaymentSchedule } from "@/types/loan";
import { formatCurrency, formatDate, getRepaymentStatusLabel } from "@/lib/formatters";
import { getScheduleStatusStyle } from "@/hooks/useContractDetail";

interface ScheduleTabProps {
  schedules: RepaymentSchedule[];
}

export default function ScheduleTab({ schedules }: ScheduleTabProps) {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>회차</th>
            <th>납입일</th>
            <th style={{ textAlign: "right" }}>원금</th>
            <th style={{ textAlign: "right" }}>이자</th>
            <th style={{ textAlign: "right" }}>합계</th>
            <th style={{ textAlign: "right" }}>잔액</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {schedules.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                style={{
                  textAlign: "center",
                  padding: "48px 16px",
                  color: "var(--text-muted)",
                }}
              >
                상환 스케줄이 없습니다.
              </td>
            </tr>
          ) : (
            schedules.map((s) => {
              const statusStyle = getScheduleStatusStyle(s.status);
              return (
                <tr
                  key={s.id || s.installmentNo}
                  style={{
                    background:
                      s.status === "OVERDUE" ? "rgba(239, 68, 68, 0.04)" : undefined,
                  }}
                >
                  <td style={{ fontWeight: 600 }}>{s.installmentNo}회</td>
                  <td>{formatDate(s.dueDate)}</td>
                  <td style={{ textAlign: "right" }} className="font-mono">
                    {formatCurrency(s.principalAmount)}
                  </td>
                  <td style={{ textAlign: "right" }} className="font-mono">
                    {formatCurrency(s.interestAmount)}
                  </td>
                  <td
                    style={{ textAlign: "right", fontWeight: 600 }}
                    className="font-mono"
                  >
                    {formatCurrency(s.totalAmount)}
                  </td>
                  <td style={{ textAlign: "right" }} className="font-mono">
                    {formatCurrency(s.outstandingBalanceAfter)}
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        ...statusStyle,
                        padding: "3px 10px",
                        borderRadius: "9999px",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {getRepaymentStatusLabel(s.status)}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
