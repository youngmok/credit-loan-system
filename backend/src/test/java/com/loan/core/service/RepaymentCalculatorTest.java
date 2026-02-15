package com.loan.core.service;

import com.loan.core.domain.entity.RepaymentSchedule;
import com.loan.core.domain.enums.RepaymentMethod;
import com.loan.core.domain.enums.RepaymentStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class RepaymentCalculatorTest {

    private static final BigDecimal PRINCIPAL = new BigDecimal("10000000");
    private static final BigDecimal RATE = new BigDecimal("5.0");
    private static final int TERM = 12;
    private static final LocalDate START = LocalDate.of(2026, 1, 1);

    @Test
    @DisplayName("원리금균등 월납입금 계산 (PMT 공식)")
    void equalPrincipalAndInterestPayment() {
        BigDecimal monthly = RepaymentCalculator.calculateMonthlyPayment(
                PRINCIPAL, RATE, TERM, RepaymentMethod.EQUAL_PRINCIPAL_AND_INTEREST);
        // PMT formula: P * r * (1+r)^n / ((1+r)^n - 1) ≈ 856,075
        assertTrue(monthly.compareTo(new BigDecimal("850000")) > 0);
        assertTrue(monthly.compareTo(new BigDecimal("860000")) < 0);
    }

    @Test
    @DisplayName("원금균등 첫달 납입금 계산")
    void equalPrincipalFirstMonthPayment() {
        BigDecimal monthly = RepaymentCalculator.calculateMonthlyPayment(
                PRINCIPAL, RATE, TERM, RepaymentMethod.EQUAL_PRINCIPAL);
        // 원금(10M/12) + 이자(10M * 5%/12) ≈ 833,333 + 41,667 ≈ 875,000
        BigDecimal expectedPrincipal = PRINCIPAL.divide(new BigDecimal("12"), 2, java.math.RoundingMode.HALF_UP);
        assertTrue(monthly.compareTo(expectedPrincipal) > 0);
    }

    @Test
    @DisplayName("만기일시 월납입금 = 이자만")
    void bulletMonthlyPayment() {
        BigDecimal monthly = RepaymentCalculator.calculateMonthlyPayment(
                PRINCIPAL, RATE, TERM, RepaymentMethod.BULLET);
        // 10M * 5% / 12 ≈ 41,667
        BigDecimal expectedInterest = PRINCIPAL.multiply(RATE.divide(new BigDecimal("100"), 10, java.math.RoundingMode.HALF_UP))
                .divide(new BigDecimal("12"), 2, java.math.RoundingMode.HALF_UP);
        assertEquals(0, monthly.compareTo(expectedInterest));
    }

    @Test
    @DisplayName("원리금균등 스케줄 개수 = 기간(개월)")
    void equalPrincipalAndInterestScheduleCount() {
        List<RepaymentSchedule> schedules = RepaymentCalculator.generateSchedules(
                1L, PRINCIPAL, RATE, TERM, RepaymentMethod.EQUAL_PRINCIPAL_AND_INTEREST, START);
        assertEquals(TERM, schedules.size());
    }

    @Test
    @DisplayName("원리금균등 마지막 회차 잔액 0")
    void equalPrincipalAndInterestLastBalanceZero() {
        List<RepaymentSchedule> schedules = RepaymentCalculator.generateSchedules(
                1L, PRINCIPAL, RATE, TERM, RepaymentMethod.EQUAL_PRINCIPAL_AND_INTEREST, START);
        assertEquals(0, schedules.get(TERM - 1).getOutstandingBalanceAfter().compareTo(BigDecimal.ZERO));
    }

    @Test
    @DisplayName("원금균등 이자 감소 추세")
    void equalPrincipalInterestDecreasing() {
        List<RepaymentSchedule> schedules = RepaymentCalculator.generateSchedules(
                1L, PRINCIPAL, RATE, TERM, RepaymentMethod.EQUAL_PRINCIPAL, START);
        for (int i = 1; i < schedules.size(); i++) {
            assertTrue(schedules.get(i).getInterestAmount().compareTo(schedules.get(i - 1).getInterestAmount()) <= 0,
                    "회차 " + (i + 1) + " 이자가 이전 회차보다 크면 안됨");
        }
    }

    @Test
    @DisplayName("만기일시 중간회차 원금 0, 마지막회차 원금 전액")
    void bulletPrincipalOnlyOnLastInstallment() {
        List<RepaymentSchedule> schedules = RepaymentCalculator.generateSchedules(
                1L, PRINCIPAL, RATE, TERM, RepaymentMethod.BULLET, START);
        for (int i = 0; i < TERM - 1; i++) {
            assertEquals(0, schedules.get(i).getPrincipalAmount().compareTo(BigDecimal.ZERO),
                    "회차 " + (i + 1) + " 원금은 0이어야 함");
        }
        assertEquals(0, schedules.get(TERM - 1).getPrincipalAmount().compareTo(PRINCIPAL));
    }

    @Test
    @DisplayName("만기일시 마지막 회차 잔액 0")
    void bulletLastBalanceZero() {
        List<RepaymentSchedule> schedules = RepaymentCalculator.generateSchedules(
                1L, PRINCIPAL, RATE, TERM, RepaymentMethod.BULLET, START);
        assertEquals(0, schedules.get(TERM - 1).getOutstandingBalanceAfter().compareTo(BigDecimal.ZERO));
    }

    @Test
    @DisplayName("스케줄 날짜 = startDate + 회차 개월")
    void scheduleDatesAreMonthlyIncrements() {
        List<RepaymentSchedule> schedules = RepaymentCalculator.generateSchedules(
                1L, PRINCIPAL, RATE, TERM, RepaymentMethod.EQUAL_PRINCIPAL_AND_INTEREST, START);
        for (int i = 0; i < schedules.size(); i++) {
            assertEquals(START.plusMonths(i + 1), schedules.get(i).getDueDate());
            assertEquals(i + 1, schedules.get(i).getInstallmentNo());
            assertEquals(RepaymentStatus.SCHEDULED, schedules.get(i).getStatus());
        }
    }
}
