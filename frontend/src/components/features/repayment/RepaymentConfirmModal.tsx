"use client";

import React from "react";
import { formatCurrency } from "@/lib/formatters";
import { RepaymentOption } from "@/hooks/useRepayment";
import Modal from "@/components/ui/Modal";

interface RepaymentConfirmModalProps {
  isOpen: boolean;
  repayOption: RepaymentOption;
  amount: number;
  outstandingBalance: number;
  processing: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function RepaymentConfirmModal({
  isOpen,
  repayOption,
  amount,
  outstandingBalance,
  processing,
  onConfirm,
  onClose,
}: RepaymentConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="상환 확인"
      footer={
        <>
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={processing}
          >
            취소
          </button>
          <button
            className={`btn ${repayOption === "early" ? "btn-success" : "btn-primary"}`}
            onClick={onConfirm}
            disabled={processing}
          >
            {processing ? "처리 중..." : "확인"}
          </button>
        </>
      }
    >
      <div style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
        {repayOption === "early" ? (
          <>
            <p style={{ marginBottom: "12px" }}>
              <strong>조기상환</strong>을 진행합니다.
            </p>
            <div
              style={{
                padding: "12px 16px",
                background: "rgba(22, 163, 74, 0.08)",
                borderRadius: "12px",
                border: "1px solid rgba(22, 163, 74, 0.2)",
              }}
            >
              <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                상환 금액
              </div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "#16a34a" }} className="font-mono">
                {formatCurrency(outstandingBalance)}
              </div>
            </div>
            <p style={{ marginTop: "12px", fontSize: "13px", color: "var(--text-muted)" }}>
              조기상환 후 대출이 완료 처리됩니다.
            </p>
          </>
        ) : (
          <>
            <p style={{ marginBottom: "12px" }}>
              <strong>정기상환</strong>을 진행합니다.
            </p>
            <div
              style={{
                padding: "12px 16px",
                background: "rgba(59, 130, 246, 0.08)",
                borderRadius: "12px",
                border: "1px solid rgba(59, 130, 246, 0.2)",
              }}
            >
              <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                상환 금액
              </div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "#1d4ed8" }} className="font-mono">
                {formatCurrency(amount)}
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
