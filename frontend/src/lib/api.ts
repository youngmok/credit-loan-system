import { ApiResponse, CustomerCreateRequest, LoanApplicationCreateRequest, RepaymentRequest } from "@/types/api";
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

const BASE_URL = "/api/v1";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const errorBody = await response.json();
      message = errorBody.message || message;
    } catch {
      // ignore parse error
    }
    throw new ApiError(message, response.status);
  }

  const result: ApiResponse<T> = await response.json();

  if (!result.success) {
    throw new ApiError(result.message || "요청 처리 중 오류가 발생했습니다.", 400);
  }

  return result.data;
}

// Customer API
export const customerApi = {
  create(data: CustomerCreateRequest): Promise<Customer> {
    return request<Customer>("/customers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getById(id: number): Promise<Customer> {
    return request<Customer>(`/customers/${id}`);
  },

  getAll(): Promise<Customer[]> {
    return request<Customer[]>("/customers");
  },
};

// Loan Application API
export const applicationApi = {
  create(data: LoanApplicationCreateRequest): Promise<LoanApplication> {
    return request<LoanApplication>("/loans/applications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  submit(id: number): Promise<LoanApplication> {
    return request<LoanApplication>(`/loans/applications/${id}/submit`, {
      method: "POST",
    });
  },

  assess(id: number): Promise<CreditAssessment> {
    return request<CreditAssessment>(`/loans/applications/${id}/assess`, {
      method: "POST",
    });
  },

  getById(id: number): Promise<LoanApplication> {
    return request<LoanApplication>(`/loans/applications/${id}`);
  },

  getAll(customerId?: number): Promise<LoanApplication[]> {
    const params = customerId ? `?customerId=${customerId}` : "";
    return request<LoanApplication[]>(`/loans/applications${params}`);
  },

  getAssessment(id: number): Promise<CreditAssessment> {
    return request<CreditAssessment>(`/loans/applications/${id}/assessment`);
  },

  getHistory(id: number): Promise<StatusHistory[]> {
    return request<StatusHistory[]>(`/loans/applications/${id}/history`);
  },
};

// Loan Contract API
export const contractApi = {
  execute(applicationId: number): Promise<LoanContract> {
    return request<LoanContract>(`/loans/contracts/execute/${applicationId}`, {
      method: "POST",
    });
  },

  getById(id: number): Promise<LoanContract> {
    return request<LoanContract>(`/loans/contracts/${id}`);
  },

  getAll(customerId?: number): Promise<LoanContract[]> {
    const params = customerId ? `?customerId=${customerId}` : "";
    return request<LoanContract[]>(`/loans/contracts${params}`);
  },

  getSchedules(id: number): Promise<RepaymentSchedule[]> {
    return request<RepaymentSchedule[]>(`/loans/contracts/${id}/schedules`);
  },

  getTransactions(id: number): Promise<LoanTransaction[]> {
    return request<LoanTransaction[]>(`/loans/contracts/${id}/transactions`);
  },
};

// Repayment API
export const repaymentApi = {
  repay(contractId: number, data: RepaymentRequest): Promise<LoanTransaction> {
    return request<LoanTransaction>(`/loans/contracts/${contractId}/repay`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  earlyRepay(contractId: number): Promise<LoanTransaction> {
    return request<LoanTransaction>(
      `/loans/contracts/${contractId}/early-repay`,
      {
        method: "POST",
      }
    );
  },
};

// Dashboard API
export const dashboardApi = {
  get(customerId?: number): Promise<DashboardData> {
    const params = customerId ? `?customerId=${customerId}` : "";
    return request<DashboardData>(`/dashboard${params}`);
  },
};

export { ApiError };
