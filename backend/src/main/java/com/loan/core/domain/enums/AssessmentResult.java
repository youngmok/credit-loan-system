package com.loan.core.domain.enums;

import lombok.Getter;

@Getter
public enum AssessmentResult {
    APPROVED("승인"),
    REJECTED("거절"),
    MANUAL_REVIEW("수동심사");

    private final String description;

    AssessmentResult(String description) {
        this.description = description;
    }
}
