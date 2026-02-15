import React from "react";
import { StatusHistory } from "@/types/loan";
import { getLoanStatusLabel, formatDateTime } from "@/lib/formatters";

interface StatusTimelineProps {
  history: StatusHistory[];
}

function getStatusDotColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: "#94a3b8",
    APPLIED: "#3b82f6",
    REVIEWING: "#f59e0b",
    APPROVED: "#22c55e",
    REJECTED: "#ef4444",
    EXECUTED: "#2563eb",
    ACTIVE: "#3b82f6",
    COMPLETED: "#16a34a",
    OVERDUE: "#dc2626",
    CANCELLED: "#6b7280",
  };
  return colors[status] || "#94a3b8";
}

export default function StatusTimeline({ history }: StatusTimelineProps) {
  if (!history || history.length === 0) {
    return (
      <p style={{ color: "var(--text-muted)", fontSize: "14px", padding: "16px 0" }}>
        상태 변경 이력이 없습니다.
      </p>
    );
  }

  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
  );

  return (
    <div className="timeline">
      {sortedHistory.map((item, index) => (
        <div key={item.id || index} className="timeline-item">
          <div
            className="timeline-dot"
            style={{ backgroundColor: getStatusDotColor(item.toStatus) }}
          />
          <div className="timeline-content">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--text-heading)",
                }}
              >
                {getLoanStatusLabel(item.toStatus)}
              </span>
              {item.fromStatus && (
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  ({getLoanStatusLabel(item.fromStatus)}에서 변경)
                </span>
              )}
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                marginBottom: "2px",
              }}
            >
              {formatDateTime(item.changedAt)}
            </div>
            {item.changedBy && (
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                처리자: {item.changedBy}
              </div>
            )}
            {item.reason && (
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  marginTop: "4px",
                  padding: "6px 10px",
                  background: "var(--bg-secondary)",
                  borderRadius: "6px",
                  borderLeft: "3px solid var(--border-primary)",
                }}
              >
                {item.reason}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
