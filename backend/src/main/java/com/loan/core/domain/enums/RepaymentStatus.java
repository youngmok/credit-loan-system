package com.loan.core.domain.enums;

import lombok.Getter;

@Getter
public enum RepaymentStatus {
    SCHEDULED("예정"),
    PAID("납부완료"),
    OVERDUE("연체"),
    PARTIALLY_PAID("부분납부");

    private final String description;

    RepaymentStatus(String description) {
        this.description = description;
    }
}
