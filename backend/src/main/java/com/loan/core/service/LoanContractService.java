package com.loan.core.service;

import com.loan.core.domain.entity.*;
import com.loan.core.domain.enums.LoanStatus;
import com.loan.core.domain.enums.TransactionType;
import com.loan.core.exception.InvalidStatusTransitionException;
import com.loan.core.exception.ResourceNotFoundException;
import com.loan.core.mapper.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@Slf4j
@RequiredArgsConstructor
public class LoanContractService {

    private final LoanContractMapper contractMapper;
    private final LoanApplicationMapper applicationMapper;
    private final CreditAssessmentMapper assessmentMapper;
    private final CustomerMapper customerMapper;
    private final RepaymentScheduleMapper scheduleMapper;
    private final LoanTransactionMapper transactionMapper;
    private final StatusHistoryMapper statusHistoryMapper;
    private static final AtomicInteger CONTRACT_SEQ = new AtomicInteger(0);

    public LoanContract executeLoan(Long applicationId) {
        log.info("Executing loan: applicationId={}", applicationId);

        // 1. Get application + assessment, validate status
        LoanApplication application = applicationMapper.findById(applicationId);
        if (application == null) {
            throw new ResourceNotFoundException("LoanApplication", applicationId);
        }

        validateStatusTransition(application.getStatus(), LoanStatus.EXECUTED);

        CreditAssessment assessment = assessmentMapper.findByApplicationId(applicationId);
        if (assessment == null) {
            throw new ResourceNotFoundException("CreditAssessment", "applicationId=" + applicationId);
        }

        Customer customer = customerMapper.findById(application.getCustomerId());
        if (customer == null) {
            throw new ResourceNotFoundException("Customer", application.getCustomerId());
        }

        // 2. Generate contractNo
        String contractNo = generateContractNo();

        // 3. Calculate monthly payment
        BigDecimal principalAmount = assessment.getApprovedAmount();
        BigDecimal interestRate = assessment.getApprovedRate();
        int termMonths = assessment.getApprovedTermMonths();
        BigDecimal monthlyPayment = RepaymentCalculator.calculateMonthlyPayment(
                principalAmount, interestRate, termMonths, application.getRepaymentMethod());

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusMonths(termMonths);
        LocalDateTime now = LocalDateTime.now();

        // 4. Create contract with EXECUTED status
        LoanContract contract = LoanContract.builder()
                .contractNo(contractNo)
                .applicationId(applicationId)
                .customerId(application.getCustomerId())
                .principalAmount(principalAmount)
                .interestRate(interestRate)
                .termMonths(termMonths)
                .repaymentMethod(application.getRepaymentMethod())
                .monthlyPayment(monthlyPayment)
                .outstandingBalance(principalAmount)
                .totalInterestPaid(BigDecimal.ZERO)
                .status(LoanStatus.EXECUTED)
                .startDate(startDate)
                .endDate(endDate)
                .executedAt(now)
                .createdAt(now)
                .updatedAt(now)
                .customerName(customer.getName())
                .applicationNo(application.getApplicationNo())
                .build();

        contractMapper.insert(contract);

        // Update application status to EXECUTED
        applicationMapper.updateStatus(applicationId, LoanStatus.EXECUTED.name());
        recordStatusHistory("LOAN_APPLICATION", applicationId, LoanStatus.APPROVED.name(), LoanStatus.EXECUTED.name(), "SYSTEM", "대출 실행");

        // Transition contract to ACTIVE
        contractMapper.updateStatus(contract.getId(), LoanStatus.ACTIVE.name());
        contract.setStatus(LoanStatus.ACTIVE);
        recordStatusHistory("LOAN_CONTRACT", contract.getId(), LoanStatus.EXECUTED.name(), LoanStatus.ACTIVE.name(), "SYSTEM", "대출 활성화");

        // 5. Generate repayment schedules
        List<RepaymentSchedule> schedules = RepaymentCalculator.generateSchedules(
                contract.getId(), principalAmount, interestRate, termMonths,
                application.getRepaymentMethod(), startDate);
        if (!schedules.isEmpty()) {
            scheduleMapper.insertBatch(schedules);
        }

        // 6. Record disbursement transaction
        String txNo = generateTransactionNo();
        LoanTransaction disbursement = LoanTransaction.builder()
                .transactionNo(txNo)
                .contractId(contract.getId())
                .type(TransactionType.DISBURSEMENT)
                .amount(principalAmount)
                .balanceAfter(principalAmount)
                .description("대출 실행: " + contractNo + ", 금액: " + principalAmount)
                .transactedAt(now)
                .createdAt(now)
                .build();
        transactionMapper.insert(disbursement);

        log.info("Loan executed: contractNo={}, amount={}, rate={}", contractNo, principalAmount, interestRate);
        return contract;
    }

    public LoanContract getContract(Long id) {
        LoanContract contract = contractMapper.findById(id);
        if (contract == null) {
            throw new ResourceNotFoundException("LoanContract", id);
        }
        return contract;
    }

    public List<LoanContract> getContractsByCustomer(Long customerId) {
        return contractMapper.findByCustomerId(customerId);
    }

    public List<LoanContract> getAllContracts() {
        return contractMapper.findAll();
    }

    public List<RepaymentSchedule> getSchedules(Long contractId) {
        // Validate contract exists
        getContract(contractId);
        return scheduleMapper.findByContractId(contractId);
    }

    public List<LoanTransaction> getTransactions(Long contractId) {
        // Validate contract exists
        getContract(contractId);
        return transactionMapper.findByContractId(contractId);
    }

    private void validateStatusTransition(LoanStatus current, LoanStatus target) {
        if (!current.canTransitionTo(target)) {
            throw new InvalidStatusTransitionException(current, target);
        }
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

    private String generateContractNo() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int seq = CONTRACT_SEQ.incrementAndGet() % 10000;
        return String.format("CNT%s%04d", datePart, seq);
    }

    private String generateTransactionNo() {
        long timestamp = System.currentTimeMillis();
        int random = (int) (Math.random() * 10000);
        return String.format("TXN%d%04d", timestamp, random);
    }
}
