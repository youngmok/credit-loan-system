export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface CustomerCreateRequest {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  annualIncome: number;
  employmentType: string;
  company: string;
}

export interface LoanApplicationCreateRequest {
  customerId: number;
  requestedAmount: number;
  requestedTermMonths: number;
  repaymentMethod: string;
  existingLoanAmount: number;
  purpose: string;
}

export interface RepaymentRequest {
  amount: number;
}
