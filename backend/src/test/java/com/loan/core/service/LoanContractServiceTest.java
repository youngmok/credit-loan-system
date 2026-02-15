package com.loan.core.service;

import com.loan.core.domain.entity.*;
import com.loan.core.domain.enums.*;
import com.loan.core.exception.InvalidStatusTransitionException;
import com.loan.core.exception.ResourceNotFoundException;
import com.loan.core.mapper.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoanContractServiceTest {

    @Mock private LoanContractMapper contractMapper;
    @Mock private LoanApplicationMapper applicationMapper;
    @Mock private CreditAssessmentMapper assessmentMapper;
    @Mock private CustomerMapper customerMapper;
    @Mock private RepaymentScheduleMapper scheduleMapper;
    @Mock private LoanTransactionMapper transactionMapper;
    @Mock private StatusHistoryMapper statusHistoryMapper;

    @InjectMocks
    private LoanContractService contractService;

    @Test
    @DisplayName("정상 대출 실행: 계약 생성 + ACTIVE + 스케줄 + 거래 기록")
    void executeLoanSuccess() {
        LoanApplication app = LoanApplication.builder()
                .id(1L).customerId(1L).status(LoanStatus.APPROVED)
                .requestedAmount(new BigDecimal("10000000"))
                .requestedTermMonths(12)
                .repaymentMethod(RepaymentMethod.EQUAL_PRINCIPAL_AND_INTEREST)
                .applicationNo("APP202601010001")
                .build();
        CreditAssessment assessment = CreditAssessment.builder()
                .approvedAmount(new BigDecimal("10000000"))
                .approvedRate(new BigDecimal("5.0"))
                .approvedTermMonths(12)
                .build();
        Customer customer = Customer.builder().id(1L).name("홍길동").build();

        when(applicationMapper.findById(1L)).thenReturn(app);
        when(assessmentMapper.findByApplicationId(1L)).thenReturn(assessment);
        when(customerMapper.findById(1L)).thenReturn(customer);
        doNothing().when(contractMapper).insert(any());
        doNothing().when(applicationMapper).updateStatus(any(), any());
        doNothing().when(contractMapper).updateStatus(any(), any());
        doNothing().when(statusHistoryMapper).insert(any());
        doNothing().when(scheduleMapper).insertBatch(any());
        doNothing().when(transactionMapper).insert(any());

        LoanContract result = contractService.executeLoan(1L);

        assertNotNull(result);
        assertEquals(LoanStatus.ACTIVE, result.getStatus());
        assertTrue(result.getContractNo().startsWith("CNT"));
        verify(scheduleMapper).insertBatch(any());
        verify(transactionMapper).insert(any());
    }

    @Test
    @DisplayName("대출 실행 시 DISBURSEMENT 거래 기록 검증")
    void executeLoanDisbursementTransaction() {
        LoanApplication app = LoanApplication.builder()
                .id(1L).customerId(1L).status(LoanStatus.APPROVED)
                .requestedAmount(new BigDecimal("10000000"))
                .requestedTermMonths(12)
                .repaymentMethod(RepaymentMethod.EQUAL_PRINCIPAL_AND_INTEREST)
                .applicationNo("APP202601010001")
                .build();
        CreditAssessment assessment = CreditAssessment.builder()
                .approvedAmount(new BigDecimal("10000000"))
                .approvedRate(new BigDecimal("5.0"))
                .approvedTermMonths(12)
                .build();
        Customer customer = Customer.builder().id(1L).name("홍길동").build();

        when(applicationMapper.findById(1L)).thenReturn(app);
        when(assessmentMapper.findByApplicationId(1L)).thenReturn(assessment);
        when(customerMapper.findById(1L)).thenReturn(customer);
        doNothing().when(contractMapper).insert(any());
        doNothing().when(applicationMapper).updateStatus(any(), any());
        doNothing().when(contractMapper).updateStatus(any(), any());
        doNothing().when(statusHistoryMapper).insert(any());
        doNothing().when(scheduleMapper).insertBatch(any());
        doNothing().when(transactionMapper).insert(any());

        contractService.executeLoan(1L);

        ArgumentCaptor<LoanTransaction> txCaptor = ArgumentCaptor.forClass(LoanTransaction.class);
        verify(transactionMapper).insert(txCaptor.capture());
        LoanTransaction tx = txCaptor.getValue();
        assertEquals(TransactionType.DISBURSEMENT, tx.getType());
        assertEquals(0, tx.getAmount().compareTo(new BigDecimal("10000000")));
    }

    @Test
    @DisplayName("존재하지 않는 신청서로 대출 실행 시 ResourceNotFoundException")
    void executeLoanApplicationNotFound() {
        when(applicationMapper.findById(999L)).thenReturn(null);

        assertThrows(ResourceNotFoundException.class,
                () -> contractService.executeLoan(999L));
    }

    @Test
    @DisplayName("심사결과 없는 상태로 대출 실행 시 ResourceNotFoundException")
    void executeLoanAssessmentNotFound() {
        LoanApplication app = LoanApplication.builder()
                .id(1L).customerId(1L).status(LoanStatus.APPROVED).build();
        when(applicationMapper.findById(1L)).thenReturn(app);
        when(assessmentMapper.findByApplicationId(1L)).thenReturn(null);

        assertThrows(ResourceNotFoundException.class,
                () -> contractService.executeLoan(1L));
    }

    @Test
    @DisplayName("DRAFT 상태에서 대출 실행 시도 시 InvalidStatusTransitionException")
    void executeLoanDraftStatusThrows() {
        LoanApplication app = LoanApplication.builder()
                .id(1L).status(LoanStatus.DRAFT).build();
        when(applicationMapper.findById(1L)).thenReturn(app);

        assertThrows(InvalidStatusTransitionException.class,
                () -> contractService.executeLoan(1L));
    }

    @Test
    @DisplayName("월납입금 계산 검증 (outstandingBalance = principalAmount)")
    void monthlyPaymentCalculation() {
        LoanApplication app = LoanApplication.builder()
                .id(1L).customerId(1L).status(LoanStatus.APPROVED)
                .requestedAmount(new BigDecimal("10000000"))
                .requestedTermMonths(12)
                .repaymentMethod(RepaymentMethod.EQUAL_PRINCIPAL_AND_INTEREST)
                .applicationNo("APP202601010001")
                .build();
        CreditAssessment assessment = CreditAssessment.builder()
                .approvedAmount(new BigDecimal("10000000"))
                .approvedRate(new BigDecimal("5.0"))
                .approvedTermMonths(12)
                .build();
        Customer customer = Customer.builder().id(1L).name("홍길동").build();

        when(applicationMapper.findById(1L)).thenReturn(app);
        when(assessmentMapper.findByApplicationId(1L)).thenReturn(assessment);
        when(customerMapper.findById(1L)).thenReturn(customer);
        doNothing().when(contractMapper).insert(any());
        doNothing().when(applicationMapper).updateStatus(any(), any());
        doNothing().when(contractMapper).updateStatus(any(), any());
        doNothing().when(statusHistoryMapper).insert(any());
        doNothing().when(scheduleMapper).insertBatch(any());
        doNothing().when(transactionMapper).insert(any());

        LoanContract result = contractService.executeLoan(1L);

        assertEquals(0, result.getOutstandingBalance().compareTo(new BigDecimal("10000000")));
        assertTrue(result.getMonthlyPayment().compareTo(BigDecimal.ZERO) > 0);
        assertEquals(0, result.getTotalInterestPaid().compareTo(BigDecimal.ZERO));
    }
}
