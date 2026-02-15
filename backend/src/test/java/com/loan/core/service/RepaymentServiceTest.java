package com.loan.core.service;

import com.loan.core.domain.entity.LoanContract;
import com.loan.core.domain.entity.LoanTransaction;
import com.loan.core.domain.entity.RepaymentSchedule;
import com.loan.core.domain.enums.LoanStatus;
import com.loan.core.domain.enums.RepaymentStatus;
import com.loan.core.domain.enums.TransactionType;
import com.loan.core.exception.BusinessException;
import com.loan.core.exception.ResourceNotFoundException;
import com.loan.core.mapper.LoanContractMapper;
import com.loan.core.mapper.LoanTransactionMapper;
import com.loan.core.mapper.RepaymentScheduleMapper;
import com.loan.core.mapper.StatusHistoryMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RepaymentServiceTest {

    @Mock private LoanContractMapper contractMapper;
    @Mock private RepaymentScheduleMapper scheduleMapper;
    @Mock private LoanTransactionMapper transactionMapper;
    @Mock private StatusHistoryMapper statusHistoryMapper;

    @InjectMocks
    private RepaymentService repaymentService;

    private LoanContract activeContract(BigDecimal balance) {
        return LoanContract.builder()
                .id(1L).status(LoanStatus.ACTIVE)
                .outstandingBalance(balance)
                .totalInterestPaid(BigDecimal.ZERO)
                .build();
    }

    @Test
    @DisplayName("정상 상환: 잔액 감소 + PAID + 거래 기록")
    void repaySuccess() {
        LoanContract contract = activeContract(new BigDecimal("10000000"));
        RepaymentSchedule schedule = RepaymentSchedule.builder()
                .id(1L).installmentNo(1).status(RepaymentStatus.SCHEDULED)
                .principalAmount(new BigDecimal("800000"))
                .interestAmount(new BigDecimal("41667"))
                .totalAmount(new BigDecimal("841667"))
                .build();

        when(contractMapper.findById(1L)).thenReturn(contract);
        when(scheduleMapper.findByContractId(1L)).thenReturn(List.of(schedule));
        doNothing().when(scheduleMapper).updateStatus(any(), any(), any(), any());
        doNothing().when(contractMapper).updateBalance(any(), any(), any());
        doNothing().when(transactionMapper).insert(any());

        LoanTransaction tx = repaymentService.repay(1L, new BigDecimal("841667"));

        assertNotNull(tx);
        assertEquals(TransactionType.REPAYMENT, tx.getType());
        verify(scheduleMapper).updateStatus(eq(1L), eq("PAID"), any(), any());
        verify(contractMapper).updateBalance(eq(1L), any(), any());
    }

    @Test
    @DisplayName("마지막 회차 상환 시 COMPLETED 전환")
    void repayLastInstallmentCompletesLoan() {
        LoanContract contract = activeContract(new BigDecimal("800000"));
        RepaymentSchedule schedule = RepaymentSchedule.builder()
                .id(1L).installmentNo(12).status(RepaymentStatus.SCHEDULED)
                .principalAmount(new BigDecimal("800000"))
                .interestAmount(new BigDecimal("3333"))
                .totalAmount(new BigDecimal("803333"))
                .build();

        when(contractMapper.findById(1L)).thenReturn(contract);
        when(scheduleMapper.findByContractId(1L)).thenReturn(List.of(schedule));
        doNothing().when(scheduleMapper).updateStatus(any(), any(), any(), any());
        doNothing().when(contractMapper).updateBalance(any(), any(), any());
        doNothing().when(transactionMapper).insert(any());
        doNothing().when(contractMapper).updateStatus(any(), any());
        doNothing().when(statusHistoryMapper).insert(any());

        LoanTransaction tx = repaymentService.repay(1L, new BigDecimal("803333"));

        assertEquals(0, tx.getBalanceAfter().compareTo(BigDecimal.ZERO));
        verify(contractMapper).updateStatus(1L, LoanStatus.COMPLETED.name());
    }

    @Test
    @DisplayName("비활성 대출 상환 시 BusinessException")
    void repayInactiveContractThrows() {
        LoanContract contract = LoanContract.builder()
                .id(1L).status(LoanStatus.COMPLETED).build();
        when(contractMapper.findById(1L)).thenReturn(contract);

        assertThrows(BusinessException.class,
                () -> repaymentService.repay(1L, new BigDecimal("100000")));
    }

    @Test
    @DisplayName("예정된 스케줄 없을 때 BusinessException")
    void repayNoScheduledThrows() {
        LoanContract contract = activeContract(new BigDecimal("10000000"));
        RepaymentSchedule paidSchedule = RepaymentSchedule.builder()
                .id(1L).status(RepaymentStatus.PAID).build();

        when(contractMapper.findById(1L)).thenReturn(contract);
        when(scheduleMapper.findByContractId(1L)).thenReturn(List.of(paidSchedule));

        assertThrows(BusinessException.class,
                () -> repaymentService.repay(1L, new BigDecimal("100000")));
    }

    @Test
    @DisplayName("존재하지 않는 계약 상환 시 ResourceNotFoundException")
    void repayContractNotFound() {
        when(contractMapper.findById(999L)).thenReturn(null);

        assertThrows(ResourceNotFoundException.class,
                () -> repaymentService.repay(999L, new BigDecimal("100000")));
    }

    @Test
    @DisplayName("조기상환: 전액 + EARLY_REPAID + 거래 기록")
    void earlyRepaySuccess() {
        LoanContract contract = activeContract(new BigDecimal("5000000"));
        RepaymentSchedule s1 = RepaymentSchedule.builder()
                .id(1L).status(RepaymentStatus.SCHEDULED)
                .interestAmount(new BigDecimal("20000"))
                .totalAmount(new BigDecimal("520000"))
                .build();
        RepaymentSchedule s2 = RepaymentSchedule.builder()
                .id(2L).status(RepaymentStatus.SCHEDULED)
                .interestAmount(new BigDecimal("15000"))
                .totalAmount(new BigDecimal("515000"))
                .build();

        when(contractMapper.findById(1L)).thenReturn(contract);
        when(scheduleMapper.findByContractId(1L)).thenReturn(List.of(s1, s2));
        doNothing().when(scheduleMapper).updateStatus(any(), any(), any(), any());
        doNothing().when(contractMapper).updateBalance(any(), any(), any());
        doNothing().when(contractMapper).updateStatus(any(), any());
        doNothing().when(statusHistoryMapper).insert(any());
        doNothing().when(transactionMapper).insert(any());

        LoanTransaction tx = repaymentService.earlyRepay(1L);

        assertEquals(TransactionType.EARLY_REPAYMENT, tx.getType());
        assertEquals(0, tx.getAmount().compareTo(new BigDecimal("5000000")));
        assertEquals(0, tx.getBalanceAfter().compareTo(BigDecimal.ZERO));
        verify(contractMapper).updateStatus(1L, LoanStatus.EARLY_REPAID.name());
        verify(scheduleMapper, times(2)).updateStatus(any(), eq("PAID"), any(), any());
    }

    @Test
    @DisplayName("비활성 대출 조기상환 시 BusinessException")
    void earlyRepayInactiveThrows() {
        LoanContract contract = LoanContract.builder()
                .id(1L).status(LoanStatus.COMPLETED).build();
        when(contractMapper.findById(1L)).thenReturn(contract);

        assertThrows(BusinessException.class,
                () -> repaymentService.earlyRepay(1L));
    }
}
