import React from "react";

interface ErrorBannerProps {
  message: string;
}

export default function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div
      style={{
        padding: "12px 16px",
        background: "rgba(239, 68, 68, 0.08)",
        borderRadius: "12px",
        color: "#dc2626",
        fontSize: "14px",
        border: "1px solid rgba(239, 68, 68, 0.2)",
      }}
    >
      {message}
    </div>
  );
}
