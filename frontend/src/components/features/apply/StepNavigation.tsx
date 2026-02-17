"use client";

import React from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  submitting: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export default function StepNavigation({
  currentStep,
  totalSteps,
  submitting,
  onPrev,
  onNext,
  onSubmit,
}: StepNavigationProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        paddingTop: "8px",
      }}
    >
      <button
        className="btn btn-secondary"
        onClick={onPrev}
        disabled={currentStep === 0}
        style={{ visibility: currentStep === 0 ? "hidden" : "visible" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        이전
      </button>

      {currentStep < totalSteps - 1 ? (
        <button className="btn btn-primary" onClick={onNext}>
          다음
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      ) : (
        <button
          className="btn btn-success btn-lg"
          onClick={onSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <LoadingSpinner size="sm" />
              처리 중...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              대출 신청 제출
            </>
          )}
        </button>
      )}
    </div>
  );
}
