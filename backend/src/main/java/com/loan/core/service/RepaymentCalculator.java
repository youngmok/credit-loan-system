package com.loan.core.service;

import com.loan.core.domain.entity.RepaymentSchedule;
import com.loan.core.domain.enums.RepaymentMethod;
import com.loan.core.domain.enums.RepaymentStatus;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public final class RepaymentCalculator {

    private static final int SCALE = 2;
    private static final RoundingMode ROUNDING = RoundingMode.HALF_UP;
    private static final MathContext MC = new MathContext(20, ROUNDING);

    private RepaymentCalculator() {
        // utility class
    }

    /**
     * Calculate monthly payment amount based on repayment method.
     */
    public static BigDecimal calculateMonthlyPayment(BigDecimal principal,
                                                      BigDecimal annualRate,
                                                      int termMonths,
                                                      RepaymentMethod method) {
        BigDecimal monthlyRate = annualRate.divide(new BigDecimal("100"), 10, ROUNDING)
                .divide(new BigDecimal("12"), 10, ROUNDING);

        return switch (method) {
            case EQUAL_PRINCIPAL_AND_INTEREST -> calculateEqualPrincipalAndInterestPayment(principal, monthlyRate, termMonths);
            case EQUAL_PRINCIPAL -> {
                // First month payment (highest)
                BigDecimal monthlyPrincipal = principal.divide(new BigDecimal(termMonths), SCALE, ROUNDING);
                BigDecimal firstInterest = principal.multiply(monthlyRate).setScale(SCALE, ROUNDING);
                yield monthlyPrincipal.add(firstInterest);
            }
            case BULLET -> {
                // Monthly interest only
                yield principal.multiply(monthlyRate).setScale(SCALE, ROUNDING);
            }
        };
    }

    /**
     * Generate full repayment schedule.
     */
    public static List<RepaymentSchedule> generateSchedules(Long contractId,
                                                              BigDecimal principal,
                                                              BigDecimal annualRate,
                                                              int termMonths,
                                                              RepaymentMethod method,
                                                              LocalDate startDate) {
        return switch (method) {
            case EQUAL_PRINCIPAL_AND_INTEREST -> generateEqualPrincipalAndInterestSchedules(contractId, principal, annualRate, termMonths, startDate);
            case EQUAL_PRINCIPAL -> generateEqualPrincipalSchedules(contractId, principal, annualRate, termMonths, startDate);
            case BULLET -> generateBulletSchedules(contractId, principal, annualRate, termMonths, startDate);
        };
    }

    /**
     * PMT = P * r * (1+r)^n / ((1+r)^n - 1)
     */
    private static BigDecimal calculateEqualPrincipalAndInterestPayment(BigDecimal principal,
                                                                         BigDecimal monthlyRate,
                                                                         int termMonths) {
        if (monthlyRate.compareTo(BigDecimal.ZERO) == 0) {
            return principal.divide(new BigDecimal(termMonths), SCALE, ROUNDING);
        }

        // (1 + r)^n
        BigDecimal onePlusR = BigDecimal.ONE.add(monthlyRate);
        BigDecimal onePlusRPowN = onePlusR.pow(termMonths, MC);

        // P * r * (1+r)^n
        BigDecimal numerator = principal.multiply(monthlyRate, MC).multiply(onePlusRPowN, MC);

        // (1+r)^n - 1
        BigDecimal denominator = onePlusRPowN.subtract(BigDecimal.ONE);

        return numerator.divide(denominator, SCALE, ROUNDING);
    }

    private static List<RepaymentSchedule> generateEqualPrincipalAndInterestSchedules(Long contractId,
                                                                                        BigDecimal principal,
                                                                                        BigDecimal annualRate,
                                                                                        int termMonths,
                                                                                        LocalDate startDate) {
        List<RepaymentSchedule> schedules = new ArrayList<>();
        BigDecimal monthlyRate = annualRate.divide(new BigDecimal("100"), 10, ROUNDING)
                .divide(new BigDecimal("12"), 10, ROUNDING);
        BigDecimal monthlyPayment = calculateEqualPrincipalAndInterestPayment(principal, monthlyRate, termMonths);
        BigDecimal remainingBalance = principal;
        LocalDateTime now = LocalDateTime.now();

        for (int i = 1; i <= termMonths; i++) {
            BigDecimal interestAmount = remainingBalance.multiply(monthlyRate).setScale(SCALE, ROUNDING);
            BigDecimal principalAmount;

            if (i == termMonths) {
                // Last installment: pay off remaining balance
                principalAmount = remainingBalance;
                interestAmount = remainingBalance.multiply(monthlyRate).setScale(SCALE, ROUNDING);
            } else {
                principalAmount = monthlyPayment.subtract(interestAmount);
            }

            BigDecimal totalAmount = principalAmount.add(interestAmount);
            remainingBalance = remainingBalance.subtract(principalAmount);

            if (remainingBalance.compareTo(BigDecimal.ZERO) < 0) {
                remainingBalance = BigDecimal.ZERO;
            }

            schedules.add(RepaymentSchedule.builder()
                    .contractId(contractId)
                    .installmentNo(i)
                    .dueDate(startDate.plusMonths(i))
                    .principalAmount(principalAmount.setScale(SCALE, ROUNDING))
                    .interestAmount(interestAmount)
                    .totalAmount(totalAmount.setScale(SCALE, ROUNDING))
                    .outstandingBalanceAfter(remainingBalance.setScale(SCALE, ROUNDING))
                    .status(RepaymentStatus.SCHEDULED)
                    .createdAt(now)
                    .updatedAt(now)
                    .build());
        }

        return schedules;
    }

    private static List<RepaymentSchedule> generateEqualPrincipalSchedules(Long contractId,
                                                                             BigDecimal principal,
                                                                             BigDecimal annualRate,
                                                                             int termMonths,
                                                                             LocalDate startDate) {
        List<RepaymentSchedule> schedules = new ArrayList<>();
        BigDecimal monthlyRate = annualRate.divide(new BigDecimal("100"), 10, ROUNDING)
                .divide(new BigDecimal("12"), 10, ROUNDING);
        BigDecimal monthlyPrincipal = principal.divide(new BigDecimal(termMonths), SCALE, ROUNDING);
        BigDecimal remainingBalance = principal;
        LocalDateTime now = LocalDateTime.now();

        for (int i = 1; i <= termMonths; i++) {
            BigDecimal interestAmount = remainingBalance.multiply(monthlyRate).setScale(SCALE, ROUNDING);
            BigDecimal principalAmount;

            if (i == termMonths) {
                // Last installment: pay off remaining balance
                principalAmount = remainingBalance;
            } else {
                principalAmount = monthlyPrincipal;
            }

            BigDecimal totalAmount = principalAmount.add(interestAmount);
            remainingBalance = remainingBalance.subtract(principalAmount);

            if (remainingBalance.compareTo(BigDecimal.ZERO) < 0) {
                remainingBalance = BigDecimal.ZERO;
            }

            schedules.add(RepaymentSchedule.builder()
                    .contractId(contractId)
                    .installmentNo(i)
                    .dueDate(startDate.plusMonths(i))
                    .principalAmount(principalAmount.setScale(SCALE, ROUNDING))
                    .interestAmount(interestAmount)
                    .totalAmount(totalAmount.setScale(SCALE, ROUNDING))
                    .outstandingBalanceAfter(remainingBalance.setScale(SCALE, ROUNDING))
                    .status(RepaymentStatus.SCHEDULED)
                    .createdAt(now)
                    .updatedAt(now)
                    .build());
        }

        return schedules;
    }

    private static List<RepaymentSchedule> generateBulletSchedules(Long contractId,
                                                                     BigDecimal principal,
                                                                     BigDecimal annualRate,
                                                                     int termMonths,
                                                                     LocalDate startDate) {
        List<RepaymentSchedule> schedules = new ArrayList<>();
        BigDecimal monthlyRate = annualRate.divide(new BigDecimal("100"), 10, ROUNDING)
                .divide(new BigDecimal("12"), 10, ROUNDING);
        BigDecimal monthlyInterest = principal.multiply(monthlyRate).setScale(SCALE, ROUNDING);
        LocalDateTime now = LocalDateTime.now();

        for (int i = 1; i <= termMonths; i++) {
            BigDecimal principalAmount;
            BigDecimal totalAmount;
            BigDecimal outstandingAfter;

            if (i == termMonths) {
                // Last installment: principal + interest
                principalAmount = principal;
                totalAmount = principal.add(monthlyInterest);
                outstandingAfter = BigDecimal.ZERO.setScale(SCALE, ROUNDING);
            } else {
                // Interest only
                principalAmount = BigDecimal.ZERO.setScale(SCALE, ROUNDING);
                totalAmount = monthlyInterest;
                outstandingAfter = principal;
            }

            schedules.add(RepaymentSchedule.builder()
                    .contractId(contractId)
                    .installmentNo(i)
                    .dueDate(startDate.plusMonths(i))
                    .principalAmount(principalAmount)
                    .interestAmount(monthlyInterest)
                    .totalAmount(totalAmount.setScale(SCALE, ROUNDING))
                    .outstandingBalanceAfter(outstandingAfter)
                    .status(RepaymentStatus.SCHEDULED)
                    .createdAt(now)
                    .updatedAt(now)
                    .build());
        }

        return schedules;
    }
}
