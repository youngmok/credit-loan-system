package com.loan.core.domain.enums;

import lombok.Getter;

@Getter
public enum CreditGrade {
    GRADE_1(900, 1000, 3.5),
    GRADE_2(850, 899, 4.5),
    GRADE_3(800, 849, 5.5),
    GRADE_4(750, 799, 6.5),
    GRADE_5(700, 749, 7.5),
    GRADE_6(650, 699, 9.0),
    GRADE_7(600, 649, 10.5),
    GRADE_8(550, 599, 12.0),
    GRADE_9(500, 549, 13.5),
    GRADE_10(0, 499, 15.0);

    private final int minScore;
    private final int maxScore;
    private final double baseRate;

    CreditGrade(int minScore, int maxScore, double baseRate) {
        this.minScore = minScore;
        this.maxScore = maxScore;
        this.baseRate = baseRate;
    }

    public static CreditGrade fromScore(int score) {
        for (CreditGrade grade : values()) {
            if (score >= grade.minScore && score <= grade.maxScore) {
                return grade;
            }
        }
        return GRADE_10;
    }
}
