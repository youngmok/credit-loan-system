"use client";

import React from "react";
import { LoanContract } from "@/types/loan";
import { formatCurrency, formatPercent, formatDate } from "@/lib/formatters";
import StatusBadge from "@/components/loan/StatusBadge";

interface ContractTableProps {
  contracts: LoanContract[];
  onRowClick: (id: number) => void;
}

export default function ContractTable({ contracts, onRowClick }: ContractTableProps) {
  return (
    <div className="table-container">
      <table className="table table-clickable">
        <thead>
          <tr>
            <th>계약번호</th>
            <th>고객명</th>
            <th style={{ textAlign: "right" }}>대출금액</th>
            <th style={{ textAlign: "right" }}>금리</th>
            <th style={{ textAlign: "right" }}>잔액</th>
            <th>상태</th>
            <th>실행일</th>
          </tr>
        </thead>
        <tbody>
          {contracts.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                style={{
                  textAlign: "center",
                  padding: "48px 16px",
                  color: "var(--text-muted)",
                }}
              >
                대출 계약이 없습니다.
              </td>
            </tr>
          ) : (
            contracts.map((contract) => (
              <tr
                key={contract.id}
                onClick={() => onRowClick(contract.id)}
              >
                <td style={{ fontWeight: 600 }}>{contract.contractNo}</td>
                <td>{contract.customerName || "-"}</td>
                <td style={{ textAlign: "right", fontWeight: 600 }} className="font-mono">
                  {formatCurrency(contract.principalAmount)}
                </td>
                <td style={{ textAlign: "right" }} className="font-mono">
                  {formatPercent(contract.interestRate)}
                </td>
                <td
                  className="font-mono"
                  style={{
                    textAlign: "right",
                    fontWeight: 700,
                    color: contract.outstandingBalance > 0 ? "#1d4ed8" : "#16a34a",
                  }}
                >
                  {formatCurrency(contract.outstandingBalance)}
                </td>
                <td>
                  <StatusBadge status={contract.status} />
                </td>
                <td>{formatDate(contract.executedAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
