package com.loan.core.domain.entity;

import com.loan.core.domain.enums.LoanStatus;
import com.loan.core.domain.enums.RepaymentMethod;
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
public class LoanApplication {

    private Long id;
    private String applicationNo;
    private Long customerId;
    private BigDecimal requestedAmount;
    private Integer requestedTermMonths;
    private RepaymentMethod repaymentMethod;
    private BigDecimal existingLoanAmount;
    private String purpose;
    private LoanStatus status;
    private LocalDateTime appliedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // For joined queries
    private Customer customer;
}
