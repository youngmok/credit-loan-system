"use client";

import React from "react";

interface CreditScoreGaugeProps {
  score: number;
  maxScore?: number;
  grade: string;
}

function getScoreColor(score: number, max: number): string {
  const ratio = score / max;
  if (ratio >= 0.8) return "#16a34a";
  if (ratio >= 0.6) return "#65a30d";
  if (ratio >= 0.4) return "#d97706";
  if (ratio >= 0.2) return "#ea580c";
  return "#dc2626";
}

function getGradeDescription(grade: string): string {
  const descriptions: Record<string, string> = {
    AAA: "최우수",
    AA: "우수",
    A: "양호",
    BBB: "보통",
    BB: "보통이하",
    B: "주의",
    CCC: "위험",
    CC: "고위험",
    C: "매우위험",
    D: "부적격",
  };
  return descriptions[grade] || "";
}

export default function CreditScoreGauge({
  score,
  maxScore = 1000,
  grade,
}: CreditScoreGaugeProps) {
  const color = getScoreColor(score, maxScore);
  const percentage = (score / maxScore) * 100;
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference * 0.75;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <div className="gauge-container">
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle
            cx="90"
            cy="90"
            r="70"
            className="gauge-background"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeDashoffset={-circumference * 0.125}
            transform="rotate(135, 90, 90)"
          />
          <circle
            cx="90"
            cy="90"
            r="70"
            className="gauge-fill"
            stroke={color}
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(135, 90, 90)"
          />
        </svg>
        <div className="gauge-text">
          <span
            style={{
              fontSize: "32px",
              fontWeight: 800,
              color: color,
              lineHeight: 1.1,
            }}
          >
            {score}
          </span>
          <span
            style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              fontWeight: 500,
            }}
          >
            / {maxScore}
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontSize: "24px",
            fontWeight: 800,
            color: color,
          }}
        >
          {grade}
        </span>
        <span
          style={{
            fontSize: "14px",
            color: "var(--text-secondary)",
            fontWeight: 500,
          }}
        >
          {getGradeDescription(grade)}
        </span>
      </div>
    </div>
  );
}
