import React from "react";
import { formatCurrency } from "@/lib/formatters";

interface StatCardsProps {
  activeLoans: number;
  pendingApplications: number;
  totalOutstanding: number;
  overdueCount: number;
}

export default function StatCards({
  activeLoans,
  pendingApplications,
  totalOutstanding,
  overdueCount,
}: StatCardsProps) {
  const stats = [
    {
      label: "활성 대출 수",
      value: activeLoans,
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
      value: pendingApplications,
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
      value: formatCurrency(totalOutstanding),
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
      value: overdueCount,
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
  );
}
