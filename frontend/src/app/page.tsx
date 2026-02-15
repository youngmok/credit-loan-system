"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dashboardApi } from "@/lib/api";
import { DashboardData, LoanApplication, LoanContract } from "@/types/loan";
import {
  formatCurrency,
  formatDate,
  formatPercent,
} from "@/lib/formatters";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StatusBadge from "@/components/loan/StatusBadge";

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const result = await dashboardApi.get();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" message="대시보드를 불러오는 중..." />;
  }

  if (error) {
    return (
      <div className="text-center py-16 px-5">
        <div className="mb-4 flex justify-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#dc2626"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <p className="text-red-600 text-base mb-4">{error}</p>
        <button className="btn btn-primary" onClick={loadDashboard}>
          다시 시도
        </button>
      </div>
    );
  }

  const stats = [
    {
      label: "활성 대출 수",
      value: data?.activeLoans ?? 0,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        </svg>
      ),
      iconBg: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(99,102,241,0.1))",
    },
    {
      label: "진행중 신청",
      value: data?.pendingApplications ?? 0,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      iconBg: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(251,191,36,0.1))",
    },
    {
      label: "총 대출잔액",
      value: formatCurrency(data?.totalOutstanding ?? 0),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      iconBg: "linear-gradient(135deg, rgba(22,163,74,0.1), rgba(34,197,94,0.1))",
    },
    {
      label: "연체 건수",
      value: data?.overdueCount ?? 0,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      iconBg: "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(248,113,113,0.1))",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            {/* Left: Text content */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  신용대출
                </span>
                <br />
                <span className="text-gray-900 dark:text-gray-100">코어 시스템</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                대출 신청부터 심사, 실행, 상환까지 신용대출의 전체 라이프사이클을 관리합니다.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/loans/apply"
                  className="inline-flex items-center px-5 py-2.5 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  새 대출 신청
                </Link>
                <Link
                  href="/loans/contracts"
                  className="inline-flex items-center px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  대출 현황 보기
                </Link>
              </div>
            </div>
            {/* Right: SVG Illustration */}
            <div className="hidden lg:block">
              <svg viewBox="0 0 500 380" className="w-full h-auto" fill="none">
                <defs>
                  <linearGradient id="bar1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                  <linearGradient id="bar2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Y-axis grid lines */}
                <line x1="60" y1="60" x2="460" y2="60" className="stroke-gray-100 dark:stroke-gray-800" strokeWidth="1" />
                <line x1="60" y1="120" x2="460" y2="120" className="stroke-gray-100 dark:stroke-gray-800" strokeWidth="1" />
                <line x1="60" y1="180" x2="460" y2="180" className="stroke-gray-100 dark:stroke-gray-800" strokeWidth="1" />
                <line x1="60" y1="240" x2="460" y2="240" className="stroke-gray-100 dark:stroke-gray-800" strokeWidth="1" />
                <line x1="60" y1="300" x2="460" y2="300" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" />
                {/* Bar chart */}
                <rect x="80" y="180" width="50" height="120" rx="8" fill="url(#bar1)" opacity="0.7" />
                <rect x="160" y="120" width="50" height="180" rx="8" fill="url(#bar2)" opacity="0.7" />
                <rect x="240" y="160" width="50" height="140" rx="8" fill="url(#bar1)" opacity="0.6" />
                <rect x="320" y="100" width="50" height="200" rx="8" fill="url(#bar2)" opacity="0.8" />
                <rect x="400" y="80" width="50" height="220" rx="8" fill="url(#bar1)" opacity="0.9" />
                {/* Area under line */}
                <path d="M105,170 L185,110 L265,145 L345,85 L425,65 L425,300 L105,300 Z" fill="url(#areaFill)" />
                {/* Line chart */}
                <path d="M105,170 L185,110 L265,145 L345,85 L425,65" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                {/* Data points */}
                <circle cx="105" cy="170" r="5" className="fill-white dark:fill-gray-950" stroke="#6366f1" strokeWidth="2.5" />
                <circle cx="185" cy="110" r="5" className="fill-white dark:fill-gray-950" stroke="#6366f1" strokeWidth="2.5" />
                <circle cx="265" cy="145" r="5" className="fill-white dark:fill-gray-950" stroke="#6366f1" strokeWidth="2.5" />
                <circle cx="345" cy="85" r="5" className="fill-white dark:fill-gray-950" stroke="#6366f1" strokeWidth="2.5" />
                <circle cx="425" cy="65" r="5" className="fill-white dark:fill-gray-950" stroke="#6366f1" strokeWidth="2.5" />
                {/* Floating summary card */}
                <rect x="330" y="15" width="140" height="55" rx="12" className="fill-white dark:fill-gray-900 stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" />
                <text x="348" y="37" fontSize="11" className="fill-gray-500 dark:fill-gray-400" fontFamily="sans-serif">총 대출잔액</text>
                <text x="348" y="57" fontSize="16" fontWeight="bold" className="fill-gray-900 dark:fill-gray-100" fontFamily="sans-serif">
                  {formatCurrency(data?.totalOutstanding ?? 0)}
                </text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Stat Cards Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-xl"
                    style={{ background: stat.iconBg }}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Recent Contracts */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  최근 대출 계약
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  최근 실행된 대출 계약 목록
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        계약번호
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        대출금액
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        금리
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        상태
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {(!data?.recentContracts || data.recentContracts.length === 0) ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-8 px-4 text-gray-400 dark:text-gray-500"
                        >
                          최근 계약이 없습니다.
                        </td>
                      </tr>
                    ) : (
                      data.recentContracts.slice(0, 5).map((contract: LoanContract) => (
                        <tr
                          key={contract.id}
                          onClick={() => router.push(`/loans/contracts/${contract.id}`)}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                        >
                          <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                            {contract.contractNo}
                          </td>
                          <td className="px-6 py-4 font-mono text-gray-700 dark:text-gray-300">
                            {formatCurrency(contract.principalAmount)}
                          </td>
                          <td className="px-6 py-4 font-mono text-gray-700 dark:text-gray-300">
                            {formatPercent(contract.interestRate)}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={contract.status} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  최근 대출 신청
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  최근 접수된 대출 신청 목록
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        신청번호
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        신청금액
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        신청일
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        상태
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {(!data?.recentApplications || data.recentApplications.length === 0) ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-8 px-4 text-gray-400 dark:text-gray-500"
                        >
                          최근 신청이 없습니다.
                        </td>
                      </tr>
                    ) : (
                      data.recentApplications.slice(0, 5).map((app: LoanApplication) => (
                        <tr
                          key={app.id}
                          onClick={() => router.push(`/loans/applications/${app.id}`)}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                        >
                          <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                            {app.applicationNo}
                          </td>
                          <td className="px-6 py-4 font-mono text-gray-700 dark:text-gray-300">
                            {formatCurrency(app.requestedAmount)}
                          </td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                            {formatDate(app.createdAt)}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={app.status} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
