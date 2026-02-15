package com.loan.core.dto.response;

import com.loan.core.domain.entity.CreditAssessment;
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
public class CreditAssessmentResponse {

    private Long id;
    private Long applicationId;
    private String applicationNo;
    private Integer creditScore;
    private String creditGrade;
    private BigDecimal dsrRatio;
    private BigDecimal approvedRate;
    private BigDecimal approvedAmount;
    private Integer approvedTermMonths;
    private String result;
    private String resultLabel;
    private String rejectionReason;
    private LocalDateTime assessedAt;
    private LocalDateTime createdAt;

    public static CreditAssessmentResponse from(CreditAssessment assessment) {
        if (assessment == null) return null;
        return CreditAssessmentResponse.builder()
                .id(assessment.getId())
                .applicationId(assessment.getApplicationId())
                .applicationNo(assessment.getApplicationNo())
                .creditScore(assessment.getCreditScore())
                .creditGrade(assessment.getCreditGrade() != null ? assessment.getCreditGrade().name() : null)
                .dsrRatio(assessment.getDsrRatio())
                .approvedRate(assessment.getApprovedRate())
                .approvedAmount(assessment.getApprovedAmount())
                .approvedTermMonths(assessment.getApprovedTermMonths())
                .result(assessment.getResult() != null ? assessment.getResult().name() : null)
                .resultLabel(assessment.getResult() != null ? assessment.getResult().getDescription() : null)
                .rejectionReason(assessment.getRejectionReason())
                .assessedAt(assessment.getAssessedAt())
                .createdAt(assessment.getCreatedAt())
                .build();
    }
}
