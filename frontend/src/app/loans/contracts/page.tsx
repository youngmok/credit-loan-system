"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { contractApi } from "@/lib/api";
import { LoanContract } from "@/types/loan";
import {
  formatCurrency,
  formatPercent,
  formatDate,
} from "@/lib/formatters";
import StatusBadge from "@/components/loan/StatusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ContractListPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState<LoanContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContracts();
  }, []);

  async function loadContracts() {
    try {
      setLoading(true);
      const data = await contractApi.getAll();
      setContracts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  const totalContracts = contracts.length;
  const activeContracts = contracts.filter(
    (c) => c.status === "EXECUTED" || c.status === "ACTIVE"
  ).length;
  const completedContracts = contracts.filter(
    (c) => c.status === "COMPLETED"
  ).length;
  const overdueContracts = contracts.filter(
    (c) => c.status === "OVERDUE"
  ).length;

  const summaryCards = [
    {
      label: "전체 계약",
      value: totalContracts,
      color: "#2563eb",
      bg: "rgba(59, 130, 246, 0.08)",
    },
    {
      label: "활성 대출",
      value: activeContracts,
      color: "#16a34a",
      bg: "rgba(22, 163, 74, 0.08)",
    },
    {
      label: "상환 완료",
      value: completedContracts,
      color: "#7c3aed",
      bg: "rgba(124, 58, 237, 0.08)",
    },
    {
      label: "연체",
      value: overdueContracts,
      color: "#dc2626",
      bg: "rgba(239, 68, 68, 0.08)",
    },
  ];

  if (loading) {
    return <LoadingSpinner size="lg" message="계약 목록을 불러오는 중..." />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          대출 관리
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          대출 계약을 관리하고 상환 현황을 확인합니다.
        </p>
      </div>

      <div className="space-y-10">
        {error && (
          <div
            style={{
              padding: "12px 16px",
              background: "rgba(239, 68, 68, 0.08)",
              borderRadius: "12px",
              color: "#dc2626",
              fontSize: "14px",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            {error}
          </div>
        )}

        {/* Summary Cards */}
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

        {/* Contracts Table */}
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
                    onClick={() =>
                      router.push(`/loans/contracts/${contract.id}`)
                    }
                  >
                    <td style={{ fontWeight: 600 }}>
                      {contract.contractNo}
                    </td>
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
                        color:
                          contract.outstandingBalance > 0
                            ? "#1d4ed8"
                            : "#16a34a",
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
      </div>
    </div>
  );
}
