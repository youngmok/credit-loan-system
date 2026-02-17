import React from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";

interface DashboardHeroProps {
  totalOutstanding: number;
}

export default function DashboardHero({ totalOutstanding }: DashboardHeroProps) {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
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
              <line x1="60" y1="60" x2="460" y2="60" className="stroke-gray-100 dark:stroke-gray-800" strokeWidth="1" />
              <line x1="60" y1="120" x2="460" y2="120" className="stroke-gray-100 dark:stroke-gray-800" strokeWidth="1" />
              <line x1="60" y1="180" x2="460" y2="180" className="stroke-gray-100 dark:stroke-gray-800" strokeWidth="1" />
              <line x1="60" y1="240" x2="460" y2="240" className="stroke-gray-100 dark:stroke-gray-800" strokeWidth="1" />
              <line x1="60" y1="300" x2="460" y2="300" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" />
              <rect x="80" y="180" width="50" height="120" rx="8" fill="url(#bar1)" opacity="0.7" />
              <rect x="160" y="120" width="50" height="180" rx="8" fill="url(#bar2)" opacity="0.7" />
              <rect x="240" y="160" width="50" height="140" rx="8" fill="url(#bar1)" opacity="0.6" />
              <rect x="320" y="100" width="50" height="200" rx="8" fill="url(#bar2)" opacity="0.8" />
              <rect x="400" y="80" width="50" height="220" rx="8" fill="url(#bar1)" opacity="0.9" />
              <path d="M105,170 L185,110 L265,145 L345,85 L425,65 L425,300 L105,300 Z" fill="url(#areaFill)" />
              <path d="M105,170 L185,110 L265,145 L345,85 L425,65" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="105" cy="170" r="5" className="fill-white dark:fill-gray-950" stroke="#6366f1" strokeWidth="2.5" />
              <circle cx="185" cy="110" r="5" className="fill-white dark:fill-gray-950" stroke="#6366f1" strokeWidth="2.5" />
              <circle cx="265" cy="145" r="5" className="fill-white dark:fill-gray-950" stroke="#6366f1" strokeWidth="2.5" />
              <circle cx="345" cy="85" r="5" className="fill-white dark:fill-gray-950" stroke="#6366f1" strokeWidth="2.5" />
              <circle cx="425" cy="65" r="5" className="fill-white dark:fill-gray-950" stroke="#6366f1" strokeWidth="2.5" />
              <rect x="330" y="15" width="140" height="55" rx="12" className="fill-white dark:fill-gray-900 stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" />
              <text x="348" y="37" fontSize="11" className="fill-gray-500 dark:fill-gray-400" fontFamily="sans-serif">총 대출잔액</text>
              <text x="348" y="57" fontSize="16" fontWeight="bold" className="fill-gray-900 dark:fill-gray-100" fontFamily="sans-serif">
                {formatCurrency(totalOutstanding)}
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
