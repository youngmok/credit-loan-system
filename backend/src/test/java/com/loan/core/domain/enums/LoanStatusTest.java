package com.loan.core.domain.enums;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.*;

class LoanStatusTest {

    @Test
    @DisplayName("DRAFT -> APPLIED 전환 가능")
    void draftToApplied() {
        assertTrue(LoanStatus.DRAFT.canTransitionTo(LoanStatus.APPLIED));
    }

    @Test
    @DisplayName("APPLIED -> REVIEWING 전환 가능")
    void appliedToReviewing() {
        assertTrue(LoanStatus.APPLIED.canTransitionTo(LoanStatus.REVIEWING));
    }

    @Test
    @DisplayName("REVIEWING -> APPROVED/REJECTED 전환 가능")
    void reviewingToApprovedOrRejected() {
        assertTrue(LoanStatus.REVIEWING.canTransitionTo(LoanStatus.APPROVED));
        assertTrue(LoanStatus.REVIEWING.canTransitionTo(LoanStatus.REJECTED));
    }

    @Test
    @DisplayName("APPROVED -> EXECUTED/CANCELLED 전환 가능")
    void approvedToExecutedOrCancelled() {
        assertTrue(LoanStatus.APPROVED.canTransitionTo(LoanStatus.EXECUTED));
        assertTrue(LoanStatus.APPROVED.canTransitionTo(LoanStatus.CANCELLED));
    }

    @Test
    @DisplayName("EXECUTED -> ACTIVE 전환 가능")
    void executedToActive() {
        assertTrue(LoanStatus.EXECUTED.canTransitionTo(LoanStatus.ACTIVE));
    }

    @Test
    @DisplayName("ACTIVE -> COMPLETED/OVERDUE/EARLY_REPAID 전환 가능")
    void activeTransitions() {
        assertTrue(LoanStatus.ACTIVE.canTransitionTo(LoanStatus.COMPLETED));
        assertTrue(LoanStatus.ACTIVE.canTransitionTo(LoanStatus.OVERDUE));
        assertTrue(LoanStatus.ACTIVE.canTransitionTo(LoanStatus.EARLY_REPAID));
    }

    @Test
    @DisplayName("OVERDUE -> ACTIVE/DEFAULTED 전환 가능")
    void overdueTransitions() {
        assertTrue(LoanStatus.OVERDUE.canTransitionTo(LoanStatus.ACTIVE));
        assertTrue(LoanStatus.OVERDUE.canTransitionTo(LoanStatus.DEFAULTED));
    }

    @ParameterizedTest
    @DisplayName("무효 전환 차단")
    @CsvSource({
            "DRAFT, APPROVED",
            "DRAFT, COMPLETED",
            "APPLIED, APPROVED",
            "REVIEWING, EXECUTED",
            "APPROVED, ACTIVE",
    })
    void invalidTransitions(LoanStatus from, LoanStatus to) {
        assertFalse(from.canTransitionTo(to));
    }

    @ParameterizedTest
    @DisplayName("종료 상태에서는 어떤 전환도 불가")
    @CsvSource({
            "COMPLETED, ACTIVE",
            "REJECTED, APPLIED",
            "CANCELLED, APPROVED",
            "DEFAULTED, ACTIVE",
            "EARLY_REPAID, ACTIVE",
    })
    void terminalStatesCannotTransition(LoanStatus from, LoanStatus to) {
        assertFalse(from.canTransitionTo(to));
    }
}
