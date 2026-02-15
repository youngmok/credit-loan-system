import React from "react";
import { getLoanStatusLabel, getLoanStatusColor } from "@/lib/formatters";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  return (
    <span className={`badge ${getLoanStatusColor(status)} ${className}`}>
      {getLoanStatusLabel(status)}
    </span>
  );
}
