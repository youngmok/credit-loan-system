"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DashboardData } from "@/types/loan";
import DashboardHero from "./DashboardHero";
import StatCards from "./StatCards";
import RecentActivitySection from "./RecentActivitySection";

interface DashboardClientProps {
  data: DashboardData | null;
  error?: string;
}

export default function DashboardClient({ data, error }: DashboardClientProps) {
  const router = useRouter();

  if (error || !data) {
    return (
      <div className="text-center py-16 px-5">
        <div className="mb-4 flex justify-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <p className="text-red-600 text-base mb-4">{error}</p>
        <button className="btn btn-primary" onClick={() => router.refresh()}>
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div>
      <DashboardHero totalOutstanding={data.totalOutstanding} />
      <StatCards
        activeLoans={data.activeLoans}
        pendingApplications={data.pendingApplications}
        totalOutstanding={data.totalOutstanding}
        overdueCount={data.overdueCount}
      />
      <RecentActivitySection
        recentContracts={data.recentContracts ?? []}
        recentApplications={data.recentApplications ?? []}
        onContractClick={(id) => router.push(`/loans/contracts/${id}`)}
        onApplicationClick={(id) => router.push(`/loans/applications/${id}`)}
      />
    </div>
  );
}
