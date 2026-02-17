import { ApiResponse } from "@/types/api";
import {
  Customer,
  LoanApplication,
  CreditAssessment,
  LoanContract,
  RepaymentSchedule,
  LoanTransaction,
  StatusHistory,
  DashboardData,
} from "@/types/loan";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const BASE_URL = `${API_BASE_URL}/api/v1`;

async function serverFetch<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const errorBody = await res.json();
      message = errorBody.message || message;
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }

  const result: ApiResponse<T> = await res.json();

  if (!result.success) {
    throw new Error(result.message || "요청 처리 중 오류가 발생했습니다.");
  }

  return result.data;
}

export const serverDashboardApi = {
  get(): Promise<DashboardData> {
    return serverFetch<DashboardData>("/dashboard");
  },
};

export const serverCustomerApi = {
  getAll(): Promise<Customer[]> {
    return serverFetch<Customer[]>("/customers");
  },
  getById(id: number): Promise<Customer> {
    return serverFetch<Customer>(`/customers/${id}`);
  },
};

export const serverApplicationApi = {
  getAll(): Promise<LoanApplication[]> {
    return serverFetch<LoanApplication[]>("/loans/applications");
  },
  getById(id: number): Promise<LoanApplication> {
    return serverFetch<LoanApplication>(`/loans/applications/${id}`);
  },
  getAssessment(id: number): Promise<CreditAssessment> {
    return serverFetch<CreditAssessment>(`/loans/applications/${id}/assessment`);
  },
  getHistory(id: number): Promise<StatusHistory[]> {
    return serverFetch<StatusHistory[]>(`/loans/applications/${id}/history`);
  },
};

export const serverContractApi = {
  getAll(): Promise<LoanContract[]> {
    return serverFetch<LoanContract[]>("/loans/contracts");
  },
  getById(id: number): Promise<LoanContract> {
    return serverFetch<LoanContract>(`/loans/contracts/${id}`);
  },
  getSchedules(id: number): Promise<RepaymentSchedule[]> {
    return serverFetch<RepaymentSchedule[]>(`/loans/contracts/${id}/schedules`);
  },
  getTransactions(id: number): Promise<LoanTransaction[]> {
    return serverFetch<LoanTransaction[]>(`/loans/contracts/${id}/transactions`);
  },
};
