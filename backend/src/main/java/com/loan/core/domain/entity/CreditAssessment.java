package com.loan.core.domain.entity;

import com.loan.core.domain.enums.AssessmentResult;
import com.loan.core.domain.enums.CreditGrade;
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
public class CreditAssessment {

    private Long id;
    private Long applicationId;
    private Integer creditScore;
    private CreditGrade creditGrade;
    private BigDecimal dsrRatio;
    private BigDecimal approvedRate;
    private BigDecimal approvedAmount;
    private Integer approvedTermMonths;
    private AssessmentResult result;
    private String rejectionReason;
    private LocalDateTime assessedAt;
    private LocalDateTime createdAt;

    // For joined queries
    private String applicationNo;
}
