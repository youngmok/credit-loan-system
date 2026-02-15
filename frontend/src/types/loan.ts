// Enum types as string unions (matching backend enums)
export type LoanStatus =
  | "DRAFT"
  | "APPLIED"
  | "REVIEWING"
  | "APPROVED"
  | "REJECTED"
  | "EXECUTED"
  | "CANCELLED"
  | "ACTIVE"
  | "COMPLETED"
  | "OVERDUE"
  | "DEFAULTED"
  | "EARLY_REPAID";

export type RepaymentMethod =
  | "EQUAL_PRINCIPAL_AND_INTEREST"
  | "EQUAL_PRINCIPAL"
  | "BULLET";

export type CreditGrade =
  | "GRADE_1"
  | "GRADE_2"
  | "GRADE_3"
  | "GRADE_4"
  | "GRADE_5"
  | "GRADE_6"
  | "GRADE_7"
  | "GRADE_8"
  | "GRADE_9"
  | "GRADE_10";

export type EmploymentType =
  | "REGULAR"
  | "CONTRACT"
  | "SELF_EMPLOYED"
  | "FREELANCE"
  | "UNEMPLOYED";

export type TransactionType =
  | "DISBURSEMENT"
  | "REPAYMENT"
  | "INTEREST_PAYMENT"
  | "EARLY_REPAYMENT"
  | "OVERDUE_INTEREST"
  | "FEE";

export type RepaymentStatus =
  | "SCHEDULED"
  | "PAID"
  | "OVERDUE"
  | "PARTIALLY_PAID";

export type AssessmentResult =
  | "APPROVED"
  | "REJECTED"
  | "MANUAL_REVIEW";

// Entity interfaces (matching backend Response DTOs)
export interface Customer {
  id: number;
  customerNo: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  annualIncome: number;
  employmentType: string;
  employmentTypeLabel: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoanApplication {
  id: number;
  applicationNo: string;
  customerId: number;
  customerName?: string;
  requestedAmount: number;
  requestedTermMonths: number;
  repaymentMethod: string;
  repaymentMethodLabel: string;
  existingLoanAmount: number;
  purpose: string;
  status: LoanStatus;
  statusLabel: string;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreditAssessment {
  id: number;
  applicationId: number;
  applicationNo: string;
  creditScore: number;
  creditGrade: string;
  dsrRatio: number;
  approvedRate: number;
  approvedAmount: number;
  approvedTermMonths: number;
  result: string;
  resultLabel: string;
  rejectionReason?: string;
  assessedAt: string;
  createdAt: string;
}

export interface LoanContract {
  id: number;
  contractNo: string;
  applicationId: number;
  customerId: number;
  customerName?: string;
  applicationNo: string;
  principalAmount: number;
  interestRate: number;
  termMonths: number;
  repaymentMethod: string;
  repaymentMethodLabel: string;
  monthlyPayment: number;
  outstandingBalance: number;
  totalInterestPaid: number;
  status: LoanStatus;
  statusLabel: string;
  startDate: string;
  endDate: string;
  executedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface RepaymentSchedule {
  id: number;
  contractId: number;
  installmentNo: number;
  dueDate: string;
  principalAmount: number;
  interestAmount: number;
  totalAmount: number;
  outstandingBalanceAfter: number;
  status: string;
  statusLabel: string;
  paidDate?: string;
  paidAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoanTransaction {
  id: number;
  transactionNo: string;
  contractId: number;
  type: string;
  typeLabel: string;
  amount: number;
  balanceAfter: number;
  description: string;
  transactedAt: string;
  createdAt: string;
}

export interface StatusHistory {
  id: number;
  entityType: string;
  entityId: number;
  fromStatus: string | null;
  toStatus: string;
  changedBy: string;
  reason?: string;
  changedAt: string;
}

export interface DashboardData {
  activeLoans: number;
  pendingApplications: number;
  totalOutstanding: number;
  overdueCount: number;
  recentContracts: LoanContract[];
  recentApplications: LoanApplication[];
}
