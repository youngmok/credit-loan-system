import React from "react";
import { LoanTransaction } from "@/types/loan";
import { formatCurrency, formatDateTime, getTransactionTypeLabel } from "@/lib/formatters";

interface TransactionsTabProps {
  transactions: LoanTransaction[];
}

export default function TransactionsTab({ transactions }: TransactionsTabProps) {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>거래번호</th>
            <th>유형</th>
            <th style={{ textAlign: "right" }}>금액</th>
            <th style={{ textAlign: "right" }}>거래후 잔액</th>
            <th>설명</th>
            <th>거래일시</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                style={{
                  textAlign: "center",
                  padding: "48px 16px",
                  color: "var(--text-muted)",
                }}
              >
                거래 내역이 없습니다.
              </td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx.id}>
                <td style={{ fontWeight: 600, fontSize: "13px" }}>
                  {tx.transactionNo}
                </td>
                <td>
                  <span
                    className={`badge ${
                      tx.type === "DISBURSEMENT"
                        ? "badge-info"
                        : tx.type === "REPAYMENT" || tx.type === "EARLY_REPAYMENT"
                        ? "badge-success"
                        : tx.type === "OVERDUE_INTEREST"
                        ? "badge-danger"
                        : "badge-default"
                    }`}
                  >
                    {getTransactionTypeLabel(tx.type)}
                  </span>
                </td>
                <td
                  className="font-mono"
                  style={{
                    textAlign: "right",
                    fontWeight: 600,
                    color:
                      tx.type === "REPAYMENT" || tx.type === "EARLY_REPAYMENT"
                        ? "#16a34a"
                        : tx.type === "DISBURSEMENT"
                        ? "#1d4ed8"
                        : "var(--text-heading)",
                  }}
                >
                  {tx.type === "REPAYMENT" || tx.type === "EARLY_REPAYMENT"
                    ? "-"
                    : "+"}
                  {formatCurrency(tx.amount)}
                </td>
                <td style={{ textAlign: "right" }} className="font-mono">
                  {formatCurrency(tx.balanceAfter)}
                </td>
                <td
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    maxWidth: "200px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tx.description || "-"}
                </td>
                <td style={{ fontSize: "13px" }}>
                  {formatDateTime(tx.transactedAt)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
