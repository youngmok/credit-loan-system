package com.loan.core.mapper;

import com.loan.core.config.TestDataSourceConfig;
import com.loan.core.domain.entity.CreditAssessment;
import com.loan.core.domain.entity.Customer;
import com.loan.core.domain.entity.LoanApplication;
import com.loan.core.domain.enums.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.jdbc.Sql;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@MybatisTest
@Import(TestDataSourceConfig.class)
@Sql("classpath:schema-h2.sql")
class CreditAssessmentMapperTest {

    @Autowired private CreditAssessmentMapper assessmentMapper;
    @Autowired private LoanApplicationMapper applicationMapper;
    @Autowired private CustomerMapper customerMapper;

    private Long applicationId;

    @BeforeEach
    void setUp() {
        Customer customer = Customer.builder()
                .customerNo("CUS202601010001")
                .name("테스트고객")
                .email("test@test.com")
                .phone("010-1234-5678")
                .annualIncome(new BigDecimal("50000000"))
                .employmentType(EmploymentType.REGULAR)
                .birthDate(LocalDate.of(1990, 1, 1))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        customerMapper.insert(customer);

        LoanApplication app = LoanApplication.builder()
                .applicationNo("APP202601010001")
                .customerId(customer.getId())
                .requestedAmount(new BigDecimal("10000000"))
                .requestedTermMonths(12)
                .repaymentMethod(RepaymentMethod.EQUAL_PRINCIPAL_AND_INTEREST)
                .existingLoanAmount(BigDecimal.ZERO)
                .status(LoanStatus.APPLIED)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        applicationMapper.insert(app);
        applicationId = app.getId();
    }

    @Test
    @DisplayName("insert 후 findByApplicationId 조회")
    void insertAndFindByApplicationId() {
        CreditAssessment assessment = CreditAssessment.builder()
                .applicationId(applicationId)
                .creditScore(750)
                .creditGrade(CreditGrade.GRADE_4)
                .dsrRatio(new BigDecimal("25.50"))
                .approvedRate(new BigDecimal("6.50"))
                .approvedAmount(new BigDecimal("10000000"))
                .approvedTermMonths(12)
                .result(AssessmentResult.APPROVED)
                .assessedAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .build();
        assessmentMapper.insert(assessment);

        CreditAssessment found = assessmentMapper.findByApplicationId(applicationId);

        assertNotNull(found);
        assertEquals(750, found.getCreditScore());
        assertEquals(AssessmentResult.APPROVED, found.getResult());
        assertEquals("APP202601010001", found.getApplicationNo());
    }

    @Test
    @DisplayName("거절 심사 insert 및 조회")
    void insertRejectedAssessment() {
        CreditAssessment assessment = CreditAssessment.builder()
                .applicationId(applicationId)
                .creditScore(400)
                .creditGrade(CreditGrade.GRADE_10)
                .dsrRatio(new BigDecimal("55.00"))
                .result(AssessmentResult.REJECTED)
                .rejectionReason("신용점수 부족")
                .assessedAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .build();
        assessmentMapper.insert(assessment);

        CreditAssessment found = assessmentMapper.findByApplicationId(applicationId);

        assertEquals(AssessmentResult.REJECTED, found.getResult());
        assertNotNull(found.getRejectionReason());
    }

    @Test
    @DisplayName("존재하지 않는 applicationId 조회 시 null 반환")
    void findByNonExistentApplicationId() {
        CreditAssessment found = assessmentMapper.findByApplicationId(999L);
        assertNull(found);
    }
}
