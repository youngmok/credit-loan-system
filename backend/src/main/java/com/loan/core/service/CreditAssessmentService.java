package com.loan.core.service;

import com.loan.core.domain.entity.CreditAssessment;
import com.loan.core.domain.entity.Customer;
import com.loan.core.domain.entity.LoanApplication;
import com.loan.core.domain.entity.StatusHistory;
import com.loan.core.domain.enums.AssessmentResult;
import com.loan.core.domain.enums.CreditGrade;
import com.loan.core.domain.enums.EmploymentType;
import com.loan.core.domain.enums.LoanStatus;
import com.loan.core.exception.BusinessException;
import com.loan.core.exception.InvalidStatusTransitionException;
import com.loan.core.exception.ResourceNotFoundException;
import com.loan.core.mapper.CreditAssessmentMapper;
import com.loan.core.mapper.CustomerMapper;
import com.loan.core.mapper.LoanApplicationMapper;
import com.loan.core.mapper.StatusHistoryMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class CreditAssessmentService {

    private final CreditAssessmentMapper assessmentMapper;
    private final LoanApplicationMapper applicationMapper;
    private final CustomerMapper customerMapper;
    private final StatusHistoryMapper statusHistoryMapper;

    private static final BigDecimal TEN_MILLION = new BigDecimal("10000000");
    private static final BigDecimal INCOME_FACTOR_MULTIPLIER = new BigDecimal("50");
    private static final int MAX_INCOME_FACTOR = 300;
    private static final int BASE_SCORE = 500;
    private static final int MIN_APPROVAL_SCORE = 500;
    private static final BigDecimal MAX_DSR_RATIO = new BigDecimal("40");

    public CreditAssessment assessApplication(Long applicationId) {
        log.info("Starting credit assessment: applicationId={}", applicationId);

        // 1. Get application and validate status transition
        LoanApplication application = applicationMapper.findById(applicationId);
        if (application == null) {
            throw new ResourceNotFoundException("LoanApplication", applicationId);
        }

        // Check if already assessed
        CreditAssessment existing = assessmentMapper.findByApplicationId(applicationId);
        if (existing != null) {
            throw new BusinessException("이미 심사가 완료된 신청입니다: applicationId=" + applicationId);
        }

        validateStatusTransition(application.getStatus(), LoanStatus.REVIEWING);
        applicationMapper.updateStatus(applicationId, LoanStatus.REVIEWING.name());
        recordStatusHistory("LOAN_APPLICATION", applicationId, application.getStatus().name(), LoanStatus.REVIEWING.name(), "SYSTEM", "심사 시작");

        // 2. Get customer
        Customer customer = customerMapper.findById(application.getCustomerId());
        if (customer == null) {
            throw new ResourceNotFoundException("Customer", application.getCustomerId());
        }

        // 3. Simulate credit score
        int creditScore = calculateCreditScore(customer);
        log.info("Credit score calculated: score={}, customerId={}", creditScore, customer.getId());

        // 4. Get credit grade
        CreditGrade creditGrade = CreditGrade.fromScore(creditScore);

        // 5. Calculate DSR
        BigDecimal dsrRatio = calculateDsrRatio(application, customer);
        log.info("DSR ratio calculated: dsr={}%, customerId={}", dsrRatio, customer.getId());

        // 6-8. Determine result
        AssessmentResult result;
        String rejectionReason = null;
        BigDecimal approvedRate = null;
        BigDecimal approvedAmount = null;
        Integer approvedTermMonths = null;
        List<String> rejectionReasons = new ArrayList<>();

        if (creditScore < MIN_APPROVAL_SCORE) {
            rejectionReasons.add("신용점수 부족 (현재: " + creditScore + ", 최소: " + MIN_APPROVAL_SCORE + ")");
        }
        if (dsrRatio.compareTo(MAX_DSR_RATIO) > 0) {
            rejectionReasons.add("DSR 비율 초과 (현재: " + dsrRatio + "%, 최대: " + MAX_DSR_RATIO + "%)");
        }

        if (!rejectionReasons.isEmpty()) {
            result = AssessmentResult.REJECTED;
            rejectionReason = String.join("; ", rejectionReasons);
        } else {
            result = AssessmentResult.APPROVED;
            approvedRate = BigDecimal.valueOf(creditGrade.getBaseRate());
            approvedAmount = application.getRequestedAmount();
            approvedTermMonths = application.getRequestedTermMonths();
        }

        // 9. Update application status
        LoanStatus newStatus = result == AssessmentResult.APPROVED ? LoanStatus.APPROVED : LoanStatus.REJECTED;
        applicationMapper.updateStatus(applicationId, newStatus.name());
        recordStatusHistory("LOAN_APPLICATION", applicationId, LoanStatus.REVIEWING.name(), newStatus.name(), "SYSTEM",
                result == AssessmentResult.APPROVED ? "심사 승인" : "심사 거절: " + rejectionReason);

        // 10. Insert assessment
        CreditAssessment assessment = CreditAssessment.builder()
                .applicationId(applicationId)
                .creditScore(creditScore)
                .creditGrade(creditGrade)
                .dsrRatio(dsrRatio)
                .approvedRate(approvedRate)
                .approvedAmount(approvedAmount)
                .approvedTermMonths(approvedTermMonths)
                .result(result)
                .rejectionReason(rejectionReason)
                .assessedAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .build();

        assessmentMapper.insert(assessment);
        log.info("Credit assessment completed: applicationId={}, result={}, score={}", applicationId, result, creditScore);

        return assessment;
    }

    public CreditAssessment getAssessmentByApplicationId(Long applicationId) {
        CreditAssessment assessment = assessmentMapper.findByApplicationId(applicationId);
        if (assessment == null) {
            throw new ResourceNotFoundException("CreditAssessment", "applicationId=" + applicationId);
        }
        return assessment;
    }

    private int calculateCreditScore(Customer customer) {
        int score = BASE_SCORE;

        // Income factor: annualIncome / 10,000,000 * 50, max 300
        if (customer.getAnnualIncome() != null && customer.getAnnualIncome().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal incomeFactor = customer.getAnnualIncome()
                    .divide(TEN_MILLION, 2, RoundingMode.HALF_UP)
                    .multiply(INCOME_FACTOR_MULTIPLIER);
            int incomePoints = Math.min(incomeFactor.intValue(), MAX_INCOME_FACTOR);
            score += incomePoints;
        }

        // Employment factor
        if (customer.getEmploymentType() != null) {
            score += getEmploymentScore(customer.getEmploymentType());
        }

        // Cap at 0-1000
        return Math.max(0, Math.min(1000, score));
    }

    private int getEmploymentScore(EmploymentType employmentType) {
        return switch (employmentType) {
            case REGULAR -> 100;
            case CONTRACT -> 50;
            case SELF_EMPLOYED -> 30;
            case FREELANCE -> 10;
            case UNEMPLOYED -> -50;
        };
    }

    private BigDecimal calculateDsrRatio(LoanApplication application, Customer customer) {
        if (customer.getAnnualIncome() == null || customer.getAnnualIncome().compareTo(BigDecimal.ZERO) <= 0) {
            return new BigDecimal("100.00");
        }

        // Existing loan annual repayment (assumption: 12 equal payments, approximate)
        BigDecimal existingAnnualRepayment = BigDecimal.ZERO;
        if (application.getExistingLoanAmount() != null && application.getExistingLoanAmount().compareTo(BigDecimal.ZERO) > 0) {
            // Assume existing loans have roughly equal annual payments over assumed remaining term
            existingAnnualRepayment = application.getExistingLoanAmount()
                    .multiply(new BigDecimal("0.12"));
        }

        // New loan annual repayment (approximate: requestedAmount / termMonths * 12)
        BigDecimal newAnnualRepayment = application.getRequestedAmount()
                .divide(new BigDecimal(application.getRequestedTermMonths()), 2, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("12"));

        // DSR = (existing + new) / annualIncome * 100
        BigDecimal totalAnnualRepayment = existingAnnualRepayment.add(newAnnualRepayment);
        return totalAnnualRepayment
                .divide(customer.getAnnualIncome(), 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"))
                .setScale(2, RoundingMode.HALF_UP);
    }

    private void validateStatusTransition(LoanStatus current, LoanStatus target) {
        if (!current.canTransitionTo(target)) {
            throw new InvalidStatusTransitionException(current, target);
        }
    }

    private void recordStatusHistory(String entityType, Long entityId, String fromStatus, String toStatus, String changedBy, String reason) {
        StatusHistory history = StatusHistory.builder()
                .entityType(entityType)
                .entityId(entityId)
                .fromStatus(fromStatus)
                .toStatus(toStatus)
                .changedBy(changedBy)
                .reason(reason)
                .changedAt(LocalDateTime.now())
                .build();
        statusHistoryMapper.insert(history);
    }
}
