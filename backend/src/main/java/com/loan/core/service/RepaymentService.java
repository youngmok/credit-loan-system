package com.loan.core.service;

import com.loan.core.domain.entity.LoanContract;
import com.loan.core.domain.entity.LoanTransaction;
import com.loan.core.domain.entity.RepaymentSchedule;
import com.loan.core.domain.entity.StatusHistory;
import com.loan.core.domain.enums.LoanStatus;
import com.loan.core.domain.enums.RepaymentStatus;
import com.loan.core.domain.enums.TransactionType;
import com.loan.core.exception.BusinessException;
import com.loan.core.exception.ResourceNotFoundException;
import com.loan.core.mapper.LoanContractMapper;
import com.loan.core.mapper.LoanTransactionMapper;
import com.loan.core.mapper.RepaymentScheduleMapper;
import com.loan.core.mapper.StatusHistoryMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class RepaymentService {

    private final LoanContractMapper contractMapper;
    private final RepaymentScheduleMapper scheduleMapper;
    private final LoanTransactionMapper transactionMapper;
    private final StatusHistoryMapper statusHistoryMapper;

    public LoanTransaction repay(Long contractId, BigDecimal amount) {
        log.info("Processing repayment: contractId={}, amount={}", contractId, amount);

        // 1. Get contract, validate ACTIVE status
        LoanContract contract = contractMapper.findById(contractId);
        if (contract == null) {
            throw new ResourceNotFoundException("LoanContract", contractId);
        }

        if (contract.getStatus() != LoanStatus.ACTIVE) {
            throw new BusinessException("활성 상태의 대출만 상환 가능합니다. 현재 상태: " + contract.getStatus());
        }

        // 2. Find next SCHEDULED repayment
        List<RepaymentSchedule> schedules = scheduleMapper.findByContractId(contractId);
        RepaymentSchedule nextSchedule = schedules.stream()
                .filter(s -> s.getStatus() == RepaymentStatus.SCHEDULED)
                .findFirst()
                .orElseThrow(() -> new BusinessException("예정된 상환 스케줄이 없습니다"));

        // 3. Mark schedule as PAID
        scheduleMapper.updateStatus(nextSchedule.getId(), RepaymentStatus.PAID.name(), LocalDate.now(), amount);

        // 4. Update contract outstandingBalance
        BigDecimal newBalance = contract.getOutstandingBalance().subtract(nextSchedule.getPrincipalAmount());
        if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
            newBalance = BigDecimal.ZERO;
        }
        BigDecimal newTotalInterestPaid = contract.getTotalInterestPaid().add(nextSchedule.getInterestAmount());
        contractMapper.updateBalance(contractId, newBalance, newTotalInterestPaid);

        // 5. Record REPAYMENT transaction
        String txNo = generateTransactionNo();
        LoanTransaction transaction = LoanTransaction.builder()
                .transactionNo(txNo)
                .contractId(contractId)
                .type(TransactionType.REPAYMENT)
                .amount(amount)
                .balanceAfter(newBalance)
                .description(String.format("제%d회차 상환, 원금: %s, 이자: %s",
                        nextSchedule.getInstallmentNo(),
                        nextSchedule.getPrincipalAmount(),
                        nextSchedule.getInterestAmount()))
                .transactedAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .build();
        transactionMapper.insert(transaction);

        // 6. If outstandingBalance == 0, transition to COMPLETED
        if (newBalance.compareTo(BigDecimal.ZERO) == 0) {
            contractMapper.updateStatus(contractId, LoanStatus.COMPLETED.name());
            recordStatusHistory("LOAN_CONTRACT", contractId, LoanStatus.ACTIVE.name(), LoanStatus.COMPLETED.name(), "SYSTEM", "상환 완료");
            log.info("Loan completed: contractId={}", contractId);
        }

        log.info("Repayment processed: contractId={}, installmentNo={}, newBalance={}", contractId, nextSchedule.getInstallmentNo(), newBalance);
        return transaction;
    }

    public LoanTransaction earlyRepay(Long contractId) {
        log.info("Processing early repayment: contractId={}", contractId);

        // 1. Get contract, validate ACTIVE
        LoanContract contract = contractMapper.findById(contractId);
        if (contract == null) {
            throw new ResourceNotFoundException("LoanContract", contractId);
        }

        if (contract.getStatus() != LoanStatus.ACTIVE) {
            throw new BusinessException("활성 상태의 대출만 조기상환 가능합니다. 현재 상태: " + contract.getStatus());
        }

        BigDecimal repayAmount = contract.getOutstandingBalance();

        // 2. Mark all remaining schedules as PAID
        List<RepaymentSchedule> schedules = scheduleMapper.findByContractId(contractId);
        BigDecimal totalInterestOnRemaining = BigDecimal.ZERO;
        for (RepaymentSchedule schedule : schedules) {
            if (schedule.getStatus() == RepaymentStatus.SCHEDULED) {
                scheduleMapper.updateStatus(schedule.getId(), RepaymentStatus.PAID.name(), LocalDate.now(), schedule.getTotalAmount());
                totalInterestOnRemaining = totalInterestOnRemaining.add(schedule.getInterestAmount());
            }
        }

        // 3. Update contract: outstanding = 0
        BigDecimal newTotalInterestPaid = contract.getTotalInterestPaid().add(totalInterestOnRemaining);
        contractMapper.updateBalance(contractId, BigDecimal.ZERO, newTotalInterestPaid);

        // 4. Transition to EARLY_REPAID
        contractMapper.updateStatus(contractId, LoanStatus.EARLY_REPAID.name());
        recordStatusHistory("LOAN_CONTRACT", contractId, LoanStatus.ACTIVE.name(), LoanStatus.EARLY_REPAID.name(), "SYSTEM", "조기상환 완료");

        // 5. Record transaction
        String txNo = generateTransactionNo();
        LoanTransaction transaction = LoanTransaction.builder()
                .transactionNo(txNo)
                .contractId(contractId)
                .type(TransactionType.EARLY_REPAYMENT)
                .amount(repayAmount)
                .balanceAfter(BigDecimal.ZERO)
                .description("조기상환: 잔액 " + repayAmount + " 전액 상환")
                .transactedAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .build();
        transactionMapper.insert(transaction);

        log.info("Early repayment completed: contractId={}, amount={}", contractId, repayAmount);
        return transaction;
    }

    private void recordStatusHistory(String entityType, Long entityId, String fromStatus, String toStatus, String changedBy, String reason) {
        StatusHistory history = StatusHistory.builder()
                .entityType(entityType)
                .entityId(entityId)
                .fromStatus(fromStatus)
                .toStatus(toStatus)
                .changedBy(changedBy)
                .reason(reason)
                .changedAt(LocalDateTime.now())
                .build();
        statusHistoryMapper.insert(history);
    }

    private String generateTransactionNo() {
        long timestamp = System.currentTimeMillis();
        int random = (int) (Math.random() * 10000);
        return String.format("TXN%d%04d", timestamp, random);
    }
}
