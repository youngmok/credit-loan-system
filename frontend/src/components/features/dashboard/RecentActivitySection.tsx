"use client";

import React from "react";
import { LoanApplication, LoanContract } from "@/types/loan";
import { formatCurrency, formatPercent, formatDate } from "@/lib/formatters";
import StatusBadge from "@/components/loan/StatusBadge";

interface RecentActivitySectionProps {
  recentContracts: LoanContract[];
  recentApplications: LoanApplication[];
  onContractClick: (id: number) => void;
  onApplicationClick: (id: number) => void;
}

export default function RecentActivitySection({
  recentContracts,
  recentApplications,
  onContractClick,
  onApplicationClick,
}: RecentActivitySectionProps) {
  return (
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
                  {(!recentContracts || recentContracts.length === 0) ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-8 px-4 text-gray-400 dark:text-gray-500"
                      >
                        최근 계약이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    recentContracts.slice(0, 5).map((contract: LoanContract) => (
                      <tr
                        key={contract.id}
                        onClick={() => onContractClick(contract.id)}
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
                  {(!recentApplications || recentApplications.length === 0) ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-8 px-4 text-gray-400 dark:text-gray-500"
                      >
                        최근 신청이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    recentApplications.slice(0, 5).map((app: LoanApplication) => (
                      <tr
                        key={app.id}
                        onClick={() => onApplicationClick(app.id)}
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
  );
}
