package com.loan.core.domain.enums;

import lombok.Getter;

@Getter
public enum TransactionType {
    DISBURSEMENT("대출실행"),
    REPAYMENT("상환"),
    INTEREST_PAYMENT("이자납부"),
    EARLY_REPAYMENT("조기상환"),
    OVERDUE_INTEREST("연체이자"),
    FEE("수수료");

    private final String description;

    TransactionType(String description) {
        this.description = description;
    }
}
