package com.loan.core.dto.response;

import com.loan.core.domain.entity.LoanContract;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoanContractResponse {

    private Long id;
    private String contractNo;
    private Long applicationId;
    private Long customerId;
    private String customerName;
    private String applicationNo;
    private BigDecimal principalAmount;
    private BigDecimal interestRate;
    private Integer termMonths;
    private String repaymentMethod;
    private String repaymentMethodLabel;
    private BigDecimal monthlyPayment;
    private BigDecimal outstandingBalance;
    private BigDecimal totalInterestPaid;
    private String status;
    private String statusLabel;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime executedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static LoanContractResponse from(LoanContract contract) {
        if (contract == null) return null;
        return LoanContractResponse.builder()
                .id(contract.getId())
                .contractNo(contract.getContractNo())
                .applicationId(contract.getApplicationId())
                .customerId(contract.getCustomerId())
                .customerName(contract.getCustomerName())
                .applicationNo(contract.getApplicationNo())
                .principalAmount(contract.getPrincipalAmount())
                .interestRate(contract.getInterestRate())
                .termMonths(contract.getTermMonths())
                .repaymentMethod(contract.getRepaymentMethod() != null ? contract.getRepaymentMethod().name() : null)
                .repaymentMethodLabel(contract.getRepaymentMethod() != null ? contract.getRepaymentMethod().getDescription() : null)
                .monthlyPayment(contract.getMonthlyPayment())
                .outstandingBalance(contract.getOutstandingBalance())
                .totalInterestPaid(contract.getTotalInterestPaid())
                .status(contract.getStatus() != null ? contract.getStatus().name() : null)
                .statusLabel(getStatusLabel(contract.getStatus()))
                .startDate(contract.getStartDate())
                .endDate(contract.getEndDate())
                .executedAt(contract.getExecutedAt())
                .createdAt(contract.getCreatedAt())
                .updatedAt(contract.getUpdatedAt())
                .build();
    }

    private static String getStatusLabel(com.loan.core.domain.enums.LoanStatus status) {
        if (status == null) return null;
        return switch (status) {
            case DRAFT -> "임시저장";
            case APPLIED -> "신청완료";
            case REVIEWING -> "심사중";
            case APPROVED -> "승인";
            case REJECTED -> "거절";
            case EXECUTED -> "실행";
            case CANCELLED -> "취소";
            case ACTIVE -> "진행중";
            case COMPLETED -> "완료";
            case OVERDUE -> "연체";
            case DEFAULTED -> "부도";
            case EARLY_REPAID -> "조기상환완료";
        };
    }
}
