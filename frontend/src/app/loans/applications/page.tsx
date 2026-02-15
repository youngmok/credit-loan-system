"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { applicationApi } from "@/lib/api";
import { LoanApplication, LoanStatus } from "@/types/loan";
import { formatCurrency, formatDate } from "@/lib/formatters";
import StatusBadge from "@/components/loan/StatusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type FilterTab = "ALL" | LoanStatus;

interface TabItem {
  key: FilterTab;
  label: string;
}

const filterTabs: TabItem[] = [
  { key: "ALL", label: "전체" },
  { key: "APPLIED", label: "심사대기" },
  { key: "REVIEWING", label: "심사중" },
  { key: "APPROVED", label: "승인" },
  { key: "REJECTED", label: "거절" },
];

export default function ApplicationListPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      setLoading(true);
      const data = await applicationApi.getAll();
      setApplications(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredApplications =
    activeTab === "ALL"
      ? applications
      : applications.filter((app) => app.status === activeTab);

  if (loading) {
    return <LoadingSpinner size="lg" message="신청 목록을 불러오는 중..." />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Page Header */}
      <div className="mb-12 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            신청 현황
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            대출 신청 목록을 확인하고 관리합니다.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => router.push("/loans/apply")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          새 대출 신청
        </button>
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

        {/* Filter Tabs */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            borderBottom: "2px solid var(--border-primary)",
            paddingBottom: "0",
          }}
        >
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const count =
              tab.key === "ALL"
                ? applications.length
                : applications.filter((a) => a.status === tab.key).length;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
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

        {/* Table */}
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
              {filteredApplications.length === 0 ? (
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
                filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() =>
                      router.push(`/loans/applications/${app.id}`)
                    }
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
                          router.push(`/loans/applications/${app.id}`);
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
      </div>
    </div>
  );
}
