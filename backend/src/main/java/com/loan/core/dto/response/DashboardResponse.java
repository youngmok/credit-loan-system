package com.loan.core.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private int activeLoans;
    private int pendingApplications;
    private BigDecimal totalOutstanding;
    private int overdueCount;
    private List<LoanContractResponse> recentContracts;
    private List<LoanApplicationResponse> recentApplications;
}
