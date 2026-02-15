package com.loan.core.dto.response;

import com.loan.core.domain.entity.LoanApplication;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoanApplicationResponse {

    private Long id;
    private String applicationNo;
    private Long customerId;
    private String customerName;
    private BigDecimal requestedAmount;
    private Integer requestedTermMonths;
    private String repaymentMethod;
    private String repaymentMethodLabel;
    private BigDecimal existingLoanAmount;
    private String purpose;
    private String status;
    private String statusLabel;
    private LocalDateTime appliedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static LoanApplicationResponse from(LoanApplication application) {
        if (application == null) return null;
        return LoanApplicationResponse.builder()
                .id(application.getId())
                .applicationNo(application.getApplicationNo())
                .customerId(application.getCustomerId())
                .customerName(application.getCustomer() != null ? application.getCustomer().getName() : null)
                .requestedAmount(application.getRequestedAmount())
                .requestedTermMonths(application.getRequestedTermMonths())
                .repaymentMethod(application.getRepaymentMethod() != null ? application.getRepaymentMethod().name() : null)
                .repaymentMethodLabel(application.getRepaymentMethod() != null ? application.getRepaymentMethod().getDescription() : null)
                .existingLoanAmount(application.getExistingLoanAmount())
                .purpose(application.getPurpose())
                .status(application.getStatus() != null ? application.getStatus().name() : null)
                .statusLabel(getStatusLabel(application.getStatus()))
                .appliedAt(application.getAppliedAt())
                .createdAt(application.getCreatedAt())
                .updatedAt(application.getUpdatedAt())
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
