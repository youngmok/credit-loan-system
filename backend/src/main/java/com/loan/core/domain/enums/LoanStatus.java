package com.loan.core.domain.enums;

public enum LoanStatus {
    DRAFT,
    APPLIED,
    REVIEWING,
    APPROVED,
    REJECTED,
    EXECUTED,
    CANCELLED,
    ACTIVE,
    COMPLETED,
    OVERDUE,
    DEFAULTED,
    EARLY_REPAID;

    public boolean canTransitionTo(LoanStatus target) {
        return switch (this) {
            case DRAFT -> target == APPLIED;
            case APPLIED -> target == REVIEWING;
            case REVIEWING -> target == APPROVED || target == REJECTED;
            case APPROVED -> target == EXECUTED || target == CANCELLED;
            case EXECUTED -> target == ACTIVE;
            case ACTIVE -> target == COMPLETED || target == OVERDUE || target == EARLY_REPAID;
            case OVERDUE -> target == ACTIVE || target == DEFAULTED;
            default -> false;
        };
    }
}
