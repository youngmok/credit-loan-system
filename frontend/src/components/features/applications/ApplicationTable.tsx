"use client";

import React from "react";
import { LoanApplication } from "@/types/loan";
import { formatCurrency, formatDate } from "@/lib/formatters";
import StatusBadge from "@/components/loan/StatusBadge";

interface ApplicationTableProps {
  applications: LoanApplication[];
  activeTab: string;
  onRowClick: (id: number) => void;
}

export default function ApplicationTable({
  applications,
  activeTab,
  onRowClick,
}: ApplicationTableProps) {
  return (
    <div className="table-container">
      <table className="table table-clickable">
        <thead>
          <tr>
            <th>신청번호</th>
            <th>고객명</th>
            <th>신청금액</th>
            <th>대출기간</th>
            <th>신청일</th>
            <th>상태</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                style={{
                  textAlign: "center",
                  padding: "48px 16px",
                  color: "var(--text-muted)",
                }}
              >
                {activeTab === "ALL"
                  ? "대출 신청 내역이 없습니다."
                  : "해당 상태의 신청 내역이 없습니다."}
              </td>
            </tr>
          ) : (
            applications.map((app) => (
              <tr
                key={app.id}
                onClick={() => onRowClick(app.id)}
              >
                <td style={{ fontWeight: 600 }}>{app.applicationNo}</td>
                <td>{app.customerName || `-`}</td>
                <td style={{ fontWeight: 600 }} className="font-mono">
                  {formatCurrency(app.requestedAmount)}
                </td>
                <td>{app.requestedTermMonths}개월</td>
                <td>{formatDate(app.createdAt)}</td>
                <td>
                  <StatusBadge status={app.status} />
                </td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRowClick(app.id);
                    }}
                  >
                    상세
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
