package com.loan.core.domain.enums;

import lombok.Getter;

@Getter
public enum EmploymentType {
    REGULAR("정규직", 1.0),
    CONTRACT("계약직", 0.8),
    SELF_EMPLOYED("자영업", 0.7),
    FREELANCE("프리랜서", 0.5),
    UNEMPLOYED("무직", 0.0);

    private final String description;
    private final double incomeWeight;

    EmploymentType(String description, double incomeWeight) {
        this.description = description;
        this.incomeWeight = incomeWeight;
    }
}
