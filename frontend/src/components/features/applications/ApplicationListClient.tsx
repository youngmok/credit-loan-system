"use client";

import React from "react";
import Link from "next/link";
import { LoanApplication } from "@/types/loan";
import ErrorBanner from "@/components/ui/ErrorBanner";
import ApplicationFilterTabs from "./ApplicationFilterTabs";
import ApplicationTable from "./ApplicationTable";
import { useApplicationList, filterTabs } from "@/hooks/useApplicationList";

interface ApplicationListClientProps {
  applications: LoanApplication[];
  error?: string;
}

export default function ApplicationListClient({
  applications,
  error,
}: ApplicationListClientProps) {
  const {
    filteredApplications,
    activeTab,
    setActiveTab,
    getCountByTab,
    goToApplication,
  } = useApplicationList(applications);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            대출 신청 현황
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            총 {applications.length}건의 신청 내역
          </p>
        </div>
        <Link href="/loans/apply" className="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          새 대출 신청
        </Link>
      </div>

      {error && (
        <div style={{ marginBottom: "24px" }}>
          <ErrorBanner message={error} />
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div style={{ padding: "24px 24px 0" }}>
          <ApplicationFilterTabs
            activeTab={activeTab}
            tabs={filterTabs}
            getCount={getCountByTab}
            onTabChange={setActiveTab}
          />
        </div>
        <ApplicationTable
          applications={filteredApplications}
          activeTab={activeTab}
          onRowClick={goToApplication}
        />
      </div>
    </div>
  );
}
