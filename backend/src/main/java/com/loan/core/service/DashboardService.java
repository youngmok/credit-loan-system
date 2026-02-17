package com.loan.core.service;

import com.loan.core.domain.entity.LoanApplication;
import com.loan.core.domain.entity.LoanContract;
import com.loan.core.dto.response.DashboardResponse;
import com.loan.core.dto.response.LoanApplicationResponse;
import com.loan.core.dto.response.LoanContractResponse;
import com.loan.core.mapper.LoanApplicationMapper;
import com.loan.core.mapper.LoanContractMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final LoanContractMapper contractMapper;
    private final LoanApplicationMapper applicationMapper;

    public DashboardResponse getDashboard(Long customerId) {
        log.info("Building dashboard: customerId={}", customerId);

        List<LoanContract> contracts;
        List<LoanApplication> applications;

        if (customerId != null) {
            contracts = contractMapper.findByCustomerId(customerId);
            applications = applicationMapper.findByCustomerId(customerId);
        } else {
            contracts = contractMapper.findAll();
            applications = applicationMapper.findAll();
        }

        int activeLoans = (int) contracts.stream()
                .filter(c -> c.getStatus() != null && c.getStatus().name().equals("ACTIVE"))
                .count();

        int pendingApplications = (int) applications.stream()
                .filter(a -> a.getStatus() != null &&
                        (a.getStatus().name().equals("DRAFT") ||
                         a.getStatus().name().equals("APPLIED") ||
                         a.getStatus().name().equals("REVIEWING")))
                .count();

        BigDecimal totalOutstanding = contracts.stream()
                .filter(c -> c.getOutstandingBalance() != null)
                .map(LoanContract::getOutstandingBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int overdueCount = (int) contracts.stream()
                .filter(c -> c.getStatus() != null && c.getStatus().name().equals("OVERDUE"))
                .count();

        List<LoanContractResponse> recentContracts = contracts.stream()
                .sorted((a, b) -> {
                    if (a.getCreatedAt() == null || b.getCreatedAt() == null) return 0;
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .limit(5)
                .map(LoanContractResponse::from)
                .collect(Collectors.toList());

        List<LoanApplicationResponse> recentApplications = applications.stream()
                .sorted((a, b) -> {
                    if (a.getCreatedAt() == null || b.getCreatedAt() == null) return 0;
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .limit(5)
                .map(LoanApplicationResponse::from)
                .collect(Collectors.toList());

        return DashboardResponse.builder()
                .activeLoans(activeLoans)
                .pendingApplications(pendingApplications)
                .totalOutstanding(totalOutstanding)
                .overdueCount(overdueCount)
                .recentContracts(recentContracts)
                .recentApplications(recentApplications)
                .build();
    }
}
