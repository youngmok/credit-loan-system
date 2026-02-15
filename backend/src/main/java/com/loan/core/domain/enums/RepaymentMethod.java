package com.loan.core.domain.enums;

import lombok.Getter;

@Getter
public enum RepaymentMethod {
    EQUAL_PRINCIPAL_AND_INTEREST("원리금균등"),
    EQUAL_PRINCIPAL("원금균등"),
    BULLET("만기일시");

    private final String description;

    RepaymentMethod(String description) {
        this.description = description;
    }
}
