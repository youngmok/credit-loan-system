package com.loan.core.service;

import com.loan.core.domain.entity.CreditAssessment;
import com.loan.core.domain.entity.Customer;
import com.loan.core.domain.entity.LoanApplication;
import com.loan.core.domain.enums.*;
import com.loan.core.exception.BusinessException;
import com.loan.core.exception.InvalidStatusTransitionException;
import com.loan.core.mapper.CreditAssessmentMapper;
import com.loan.core.mapper.CustomerMapper;
import com.loan.core.mapper.LoanApplicationMapper;
import com.loan.core.mapper.StatusHistoryMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreditAssessmentServiceTest {

    @Mock
    private CreditAssessmentMapper assessmentMapper;
    @Mock
    private LoanApplicationMapper applicationMapper;
    @Mock
    private CustomerMapper customerMapper;
    @Mock
    private StatusHistoryMapper statusHistoryMapper;

    @InjectMocks
    private CreditAssessmentService assessmentService;

    private LoanApplication createApplication(LoanStatus status, BigDecimal amount, int termMonths, BigDecimal existingLoan) {
        return LoanApplication.builder()
                .id(1L)
                .customerId(1L)
                .status(status)
                .requestedAmount(amount)
                .requestedTermMonths(termMonths)
                .repaymentMethod(RepaymentMethod.EQUAL_PRINCIPAL_AND_INTEREST)
                .existingLoanAmount(existingLoan)
                .build();
    }

    private Customer createCustomer(BigDecimal income, EmploymentType empType) {
        return Customer.builder()
                .id(1L)
                .annualIncome(income)
                .employmentType(empType)
                .build();
    }

    @Test
    @DisplayName("정규직 + 고소득 고객 승인 (score>=500, DSR<=40%)")
    void approveHighIncomeRegularEmployee() {
        LoanApplication app = createApplication(LoanStatus.APPLIED, new BigDecimal("10000000"), 24, BigDecimal.ZERO);
        Customer customer = createCustomer(new BigDecimal("80000000"), EmploymentType.REGULAR);

        when(applicationMapper.findById(1L)).thenReturn(app);
        when(assessmentMapper.findByApplicationId(1L)).thenReturn(null);
        when(customerMapper.findById(1L)).thenReturn(customer);
        doNothing().when(applicationMapper).updateStatus(any(), any());
        doNothing().when(statusHistoryMapper).insert(any());
        doNothing().when(assessmentMapper).insert(any());

        CreditAssessment result = assessmentService.assessApplication(1L);

        assertEquals(AssessmentResult.APPROVED, result.getResult());
        assertNotNull(result.getApprovedRate());
        assertNotNull(result.getApprovedAmount());
        assertTrue(result.getCreditScore() >= 500);
    }

    @Test
    @DisplayName("무직 + 저소득 고객 거절 (score<500)")
    void rejectUnemployedLowIncome() {
        LoanApplication app = createApplication(LoanStatus.APPLIED, new BigDecimal("10000000"), 12, BigDecimal.ZERO);
        Customer customer = createCustomer(new BigDecimal("1000000"), EmploymentType.UNEMPLOYED);

        when(applicationMapper.findById(1L)).thenReturn(app);
        when(assessmentMapper.findByApplicationId(1L)).thenReturn(null);
        when(customerMapper.findById(1L)).thenReturn(customer);
        doNothing().when(applicationMapper).updateStatus(any(), any());
        doNothing().when(statusHistoryMapper).insert(any());
        doNothing().when(assessmentMapper).insert(any());

        CreditAssessment result = assessmentService.assessApplication(1L);

        assertEquals(AssessmentResult.REJECTED, result.getResult());
        assertNotNull(result.getRejectionReason());
        assertTrue(result.getRejectionReason().contains("신용점수 부족"));
    }

    @Test
    @DisplayName("DSR 초과 거절 (DSR > 40%)")
    void rejectHighDsr() {
        // 연소득 30M, 대출 50M/12개월 → 연상환 50M → DSR = 50M/30M*100 ≈ 166%
        LoanApplication app = createApplication(LoanStatus.APPLIED, new BigDecimal("50000000"), 12, BigDecimal.ZERO);
        Customer customer = createCustomer(new BigDecimal("30000000"), EmploymentType.REGULAR);

        when(applicationMapper.findById(1L)).thenReturn(app);
        when(assessmentMapper.findByApplicationId(1L)).thenReturn(null);
        when(customerMapper.findById(1L)).thenReturn(customer);
        doNothing().when(applicationMapper).updateStatus(any(), any());
        doNothing().when(statusHistoryMapper).insert(any());
        doNothing().when(assessmentMapper).insert(any());

        CreditAssessment result = assessmentService.assessApplication(1L);

        assertEquals(AssessmentResult.REJECTED, result.getResult());
        assertTrue(result.getRejectionReason().contains("DSR"));
    }

    @Test
    @DisplayName("이미 심사 완료된 신청서에 대해 BusinessException")
    void alreadyAssessedThrows() {
        LoanApplication app = createApplication(LoanStatus.APPLIED, new BigDecimal("10000000"), 12, BigDecimal.ZERO);
        when(applicationMapper.findById(1L)).thenReturn(app);
        when(assessmentMapper.findByApplicationId(1L)).thenReturn(CreditAssessment.builder().id(1L).build());

        assertThrows(BusinessException.class,
                () -> assessmentService.assessApplication(1L));
    }

    @Test
    @DisplayName("DRAFT 상태에서 심사 시도 시 InvalidStatusTransitionException")
    void assessDraftStatusThrows() {
        LoanApplication app = createApplication(LoanStatus.DRAFT, new BigDecimal("10000000"), 12, BigDecimal.ZERO);
        when(applicationMapper.findById(1L)).thenReturn(app);
        when(assessmentMapper.findByApplicationId(1L)).thenReturn(null);

        assertThrows(InvalidStatusTransitionException.class,
                () -> assessmentService.assessApplication(1L));
    }

    @Test
    @DisplayName("존재하지 않는 신청서 심사 시 ResourceNotFoundException")
    void assessNonExistentApplication() {
        when(applicationMapper.findById(999L)).thenReturn(null);

        assertThrows(com.loan.core.exception.ResourceNotFoundException.class,
                () -> assessmentService.assessApplication(999L));
    }

    @Test
    @DisplayName("승인 시 등급 기반 금리 설정 검증")
    void approvedRateMatchesCreditGrade() {
        // 고소득 정규직: score = 500(base) + 300(income) + 100(regular) = 900 → GRADE_1 → 3.5%
        LoanApplication app = createApplication(LoanStatus.APPLIED, new BigDecimal("5000000"), 24, BigDecimal.ZERO);
        Customer customer = createCustomer(new BigDecimal("80000000"), EmploymentType.REGULAR);

        when(applicationMapper.findById(1L)).thenReturn(app);
        when(assessmentMapper.findByApplicationId(1L)).thenReturn(null);
        when(customerMapper.findById(1L)).thenReturn(customer);
        doNothing().when(applicationMapper).updateStatus(any(), any());
        doNothing().when(statusHistoryMapper).insert(any());
        doNothing().when(assessmentMapper).insert(any());

        CreditAssessment result = assessmentService.assessApplication(1L);

        assertEquals(AssessmentResult.APPROVED, result.getResult());
        CreditGrade expectedGrade = CreditGrade.fromScore(result.getCreditScore());
        assertEquals(BigDecimal.valueOf(expectedGrade.getBaseRate()), result.getApprovedRate());
    }

    @Test
    @DisplayName("기존 대출이 있는 경우 DSR 계산에 반영")
    void existingLoanAffectsDsr() {
        // 연소득 50M, 기존대출 100M (연상환=12M), 신규 10M/12개월 (연상환=10M) → DSR = 22M/50M*100 = 44%
        LoanApplication app = createApplication(LoanStatus.APPLIED, new BigDecimal("10000000"), 12, new BigDecimal("100000000"));
        Customer customer = createCustomer(new BigDecimal("50000000"), EmploymentType.REGULAR);

        when(applicationMapper.findById(1L)).thenReturn(app);
        when(assessmentMapper.findByApplicationId(1L)).thenReturn(null);
        when(customerMapper.findById(1L)).thenReturn(customer);
        doNothing().when(applicationMapper).updateStatus(any(), any());
        doNothing().when(statusHistoryMapper).insert(any());
        doNothing().when(assessmentMapper).insert(any());

        CreditAssessment result = assessmentService.assessApplication(1L);

        assertTrue(result.getDsrRatio().compareTo(new BigDecimal("40")) > 0);
        assertEquals(AssessmentResult.REJECTED, result.getResult());
    }
}
