package com.loan.core.domain.entity;

import com.loan.core.domain.enums.LoanStatus;
import com.loan.core.domain.enums.RepaymentMethod;
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
public class LoanContract {

    private Long id;
    private String contractNo;
    private Long applicationId;
    private Long customerId;
    private BigDecimal principalAmount;
    private BigDecimal interestRate;
    private Integer termMonths;
    private RepaymentMethod repaymentMethod;
    private BigDecimal monthlyPayment;
    private BigDecimal outstandingBalance;
    private BigDecimal totalInterestPaid;
    private LoanStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime executedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // For joined queries
    private String customerName;
    private String applicationNo;
}
