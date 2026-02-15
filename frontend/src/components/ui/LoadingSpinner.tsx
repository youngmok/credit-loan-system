import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
}

export default function LoadingSpinner({
  size = "md",
  message,
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 20,
    md: 36,
    lg: 48,
  };

  const dimension = sizeMap[size];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: size === "lg" ? "60px 0" : "24px 0",
        gap: "12px",
      }}
    >
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animation: "spin 1s linear infinite" }}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="var(--border-primary)"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="#2563eb"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {message && (
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-secondary)",
            fontWeight: 500,
          }}
        >
          {message}
        </p>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
