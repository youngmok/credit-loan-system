"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { contractApi } from "@/lib/api";
import {
  LoanContract,
  RepaymentSchedule,
  LoanTransaction,
} from "@/types/loan";
import {
  formatCurrency,
  formatPercent,
  formatDate,
  formatDateTime,
  getRepaymentMethodLabel,
  getRepaymentStatusLabel,
  getTransactionTypeLabel,
} from "@/lib/formatters";
import Card from "@/components/ui/Card";
import LoanSummaryCard from "@/components/loan/LoanSummaryCard";
import StatusBadge from "@/components/loan/StatusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type TabType = "summary" | "schedule" | "transactions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ContractDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const contractId = parseInt(id, 10);

  const [contract, setContract] = useState<LoanContract | null>(null);
  const [schedules, setSchedules] = useState<RepaymentSchedule[]>([]);
  const [transactions, setTransactions] = useState<LoanTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("summary");

  useEffect(() => {
    loadData();
  }, [contractId]);

  async function loadData() {
    try {
      setLoading(true);
      const [contractData, schedulesData, transactionsData] = await Promise.all(
        [
          contractApi.getById(contractId),
          contractApi.getSchedules(contractId).catch(() => []),
          contractApi.getTransactions(contractId).catch(() => []),
        ]
      );
      setContract(contractData);
      setSchedules(schedulesData);
      setTransactions(transactionsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  function getScheduleStatusStyle(status: string): React.CSSProperties {
    switch (status) {
      case "PAID":
        return { color: "#16a34a", background: "rgba(22, 163, 74, 0.08)" };
      case "OVERDUE":
        return { color: "#dc2626", background: "rgba(239, 68, 68, 0.08)" };
      case "PARTIALLY_PAID":
        return { color: "#d97706", background: "rgba(245, 158, 11, 0.08)" };
      default:
        return { color: "var(--text-secondary)", background: "var(--bg-tertiary)" };
    }
  }

  const tabs: { key: TabType; label: string }[] = [
    { key: "summary", label: "원장" },
    { key: "schedule", label: "상환스케줄" },
    { key: "transactions", label: "거래내역" },
  ];

  if (loading) {
    return <LoadingSpinner size="lg" message="계약 정보를 불러오는 중..." />;
  }

  if (error && !contract) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <p style={{ color: "#dc2626", fontSize: "16px", marginBottom: "16px" }}>
            {error}
          </p>
          <button className="btn btn-primary" onClick={() => router.back()}>
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!contract) return null;

  const isActive =
    contract.status === "EXECUTED" ||
    contract.status === "ACTIVE" ||
    contract.status === "OVERDUE";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Back Navigation */}
      <Link href="/loans/contracts" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-8">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        대출 관리로 돌아가기
      </Link>

      {/* Page Header */}
      <div className="mb-12 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            대출 계약 상세
          </h1>
        </div>
        {isActive && (
          <button
            className="btn btn-primary"
            onClick={() =>
              router.push(`/loans/contracts/${contract.id}/repay`)
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            상환하기
          </button>
        )}
      </div>

      <div className="space-y-10">
        {/* Tabs */}
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
                onClick={() => setActiveTab(tab.key)}
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

        {/* Tab Content: Summary */}
        {activeTab === "summary" && (
          <div className="space-y-10">
            <LoanSummaryCard contract={contract} />

            {/* Additional Info */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm hover:shadow-lg transition-all duration-300">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">상환 정보</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "20px",
                }}
              >
                <div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                    총 이자
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: 700 }} className="font-mono">
                    {formatCurrency(contract.totalInterestPaid)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                    총 상환액
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: 700 }} className="font-mono">
                    {formatCurrency(contract.principalAmount + contract.totalInterestPaid)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                    상환방식
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 600 }}>
                    {getRepaymentMethodLabel(contract.repaymentMethod)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Repayment Schedule */}
        {activeTab === "schedule" && (
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
                        <td style={{ fontWeight: 600 }}>
                          {s.installmentNo}회
                        </td>
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
        )}

        {/* Tab Content: Transactions */}
        {activeTab === "transactions" && (
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
                              : tx.type === "REPAYMENT" ||
                                tx.type === "EARLY_REPAYMENT"
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
                            tx.type === "REPAYMENT" ||
                            tx.type === "EARLY_REPAYMENT"
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
        )}
      </div>
    </div>
  );
}
