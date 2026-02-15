package com.loan.core.domain.enums;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CreditGradeTest {

    @Test
    @DisplayName("900점 이상은 GRADE_1")
    void score900IsGrade1() {
        assertEquals(CreditGrade.GRADE_1, CreditGrade.fromScore(900));
        assertEquals(CreditGrade.GRADE_1, CreditGrade.fromScore(1000));
    }

    @Test
    @DisplayName("899점은 GRADE_2")
    void score899IsGrade2() {
        assertEquals(CreditGrade.GRADE_2, CreditGrade.fromScore(899));
        assertEquals(CreditGrade.GRADE_2, CreditGrade.fromScore(850));
    }

    @Test
    @DisplayName("500점은 GRADE_9")
    void score500IsGrade9() {
        assertEquals(CreditGrade.GRADE_9, CreditGrade.fromScore(500));
    }

    @Test
    @DisplayName("499점 이하는 GRADE_10")
    void score499IsGrade10() {
        assertEquals(CreditGrade.GRADE_10, CreditGrade.fromScore(499));
        assertEquals(CreditGrade.GRADE_10, CreditGrade.fromScore(0));
    }

    @Test
    @DisplayName("음수 및 범위 밖 점수는 GRADE_10")
    void negativeScoreIsGrade10() {
        assertEquals(CreditGrade.GRADE_10, CreditGrade.fromScore(-1));
        assertEquals(CreditGrade.GRADE_10, CreditGrade.fromScore(-100));
    }

    @Test
    @DisplayName("각 등급별 기준 금리 검증")
    void baseRateByGrade() {
        assertEquals(3.5, CreditGrade.GRADE_1.getBaseRate());
        assertEquals(4.5, CreditGrade.GRADE_2.getBaseRate());
        assertEquals(7.5, CreditGrade.GRADE_5.getBaseRate());
        assertEquals(15.0, CreditGrade.GRADE_10.getBaseRate());
    }
}
