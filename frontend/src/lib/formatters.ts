/**
 * Format a number as Korean Won currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number as percentage
 */
export function formatPercent(rate: number): string {
  return `${rate.toFixed(2)}%`;
}

/**
 * Format a date string as YYYY.MM.DD
 */
export function formatDate(date: string): string {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

/**
 * Format a date string as YYYY.MM.DD HH:mm
 */
export function formatDateTime(date: string): string {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

/**
 * Get Korean label for loan status
 */
export function getLoanStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    DRAFT: "임시저장",
    APPLIED: "심사대기",
    REVIEWING: "심사중",
    APPROVED: "승인",
    REJECTED: "거절",
    EXECUTED: "실행",
    CANCELLED: "취소",
    ACTIVE: "진행중",
    COMPLETED: "완료",
    OVERDUE: "연체",
    DEFAULTED: "부도",
    EARLY_REPAID: "조기상환완료",
  };
  return labels[status] || status;
}

/**
 * Get Tailwind color classes for loan status badges
 */
export function getLoanStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: "badge-neutral",
    APPLIED: "badge-info",
    REVIEWING: "badge-warning",
    APPROVED: "badge-success",
    REJECTED: "badge-danger",
    EXECUTED: "badge-info",
    CANCELLED: "badge-neutral",
    ACTIVE: "badge-info",
    COMPLETED: "badge-success",
    OVERDUE: "badge-danger",
    DEFAULTED: "badge-danger",
    EARLY_REPAID: "badge-success",
  };
  return colors[status] || "badge-default";
}

/**
 * Get Korean label for repayment method
 */
export function getRepaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    EQUAL_PRINCIPAL_AND_INTEREST: "원리금균등상환",
    EQUAL_PRINCIPAL: "원금균등상환",
    BULLET: "만기일시상환",
  };
  return labels[method] || method;
}

/**
 * Get Korean label for employment type
 */
export function getEmploymentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    REGULAR: "정규직",
    CONTRACT: "계약직",
    SELF_EMPLOYED: "자영업",
    FREELANCE: "프리랜서",
    UNEMPLOYED: "무직",
    RETIRED: "은퇴",
    OTHER: "기타",
  };
  return labels[type] || type;
}

/**
 * Get Korean label for transaction type
 */
export function getTransactionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    DISBURSEMENT: "대출실행",
    REPAYMENT: "상환",
    EARLY_REPAYMENT: "조기상환",
    INTEREST_PAYMENT: "이자납부",
    FEE: "수수료",
    OVERDUE_INTEREST: "연체이자",
  };
  return labels[type] || type;
}

/**
 * Get Korean label for repayment status
 */
export function getRepaymentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    SCHEDULED: "예정",
    PAID: "납부완료",
    OVERDUE: "연체",
    PARTIALLY_PAID: "부분납부",
  };
  return labels[status] || status;
}

/**
 * Get Korean label for credit grade
 */
export function getCreditGradeLabel(grade: string): string {
  return grade;
}

/**
 * Get Korean label for assessment result
 */
export function getAssessmentResultLabel(result: string): string {
  const labels: Record<string, string> = {
    APPROVED: "승인",
    REJECTED: "거절",
    MANUAL_REVIEW: "수동심사",
  };
  return labels[result] || result;
}

/**
 * Format a large number with 만/억 units
 */
export function formatAmountShort(amount: number): string {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)}억원`;
  }
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(0)}만원`;
  }
  return `${amount.toLocaleString("ko-KR")}원`;
}
