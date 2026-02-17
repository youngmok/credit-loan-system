"use client";

import React from "react";

interface ApplicationActionsProps {
  status: string;
  actionLoading: boolean;
  onAction: (action: string) => void;
}

export default function ApplicationActions({
  status,
  actionLoading,
  onAction,
}: ApplicationActionsProps) {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {status === "DRAFT" && (
        <button
          className="btn btn-primary"
          onClick={() => onAction("submit")}
          disabled={actionLoading}
        >
          신청 제출
        </button>
      )}
      {status === "APPLIED" && (
        <button
          className="btn btn-primary"
          onClick={() => onAction("assess")}
          disabled={actionLoading}
        >
          심사 실행
        </button>
      )}
      {status === "APPROVED" && (
        <button
          className="btn btn-success"
          onClick={() => onAction("execute")}
          disabled={actionLoading}
        >
          대출 실행
        </button>
      )}
    </div>
  );
}
