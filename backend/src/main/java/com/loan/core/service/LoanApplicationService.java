package com.loan.core.service;

import com.loan.core.domain.entity.LoanApplication;
import com.loan.core.domain.entity.StatusHistory;
import com.loan.core.domain.enums.LoanStatus;
import com.loan.core.domain.enums.RepaymentMethod;
import com.loan.core.dto.request.LoanApplicationCreateRequest;
import com.loan.core.exception.InvalidStatusTransitionException;
import com.loan.core.exception.ResourceNotFoundException;
import com.loan.core.mapper.CustomerMapper;
import com.loan.core.mapper.LoanApplicationMapper;
import com.loan.core.mapper.StatusHistoryMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LoanApplicationService {

    private final LoanApplicationMapper applicationMapper;
    private final CustomerMapper customerMapper;
    private final StatusHistoryMapper statusHistoryMapper;
    private static final AtomicLong APP_SEQ = new AtomicLong(System.nanoTime() % 10000);

    @Transactional
    public LoanApplication createApplication(LoanApplicationCreateRequest request) {
        log.info("Creating loan application: customerId={}, amount={}", request.getCustomerId(), request.getRequestedAmount());

        // Validate customer exists
        if (customerMapper.findById(request.getCustomerId()) == null) {
            throw new ResourceNotFoundException("Customer", request.getCustomerId());
        }

        String applicationNo = generateApplicationNo();
        BigDecimal existingLoanAmount = request.getExistingLoanAmount() != null
                ? request.getExistingLoanAmount()
                : BigDecimal.ZERO;

        LoanApplication application = LoanApplication.builder()
                .applicationNo(applicationNo)
                .customerId(request.getCustomerId())
                .requestedAmount(request.getRequestedAmount())
                .requestedTermMonths(request.getRequestedTermMonths())
                .repaymentMethod(RepaymentMethod.valueOf(request.getRepaymentMethod()))
                .existingLoanAmount(existingLoanAmount)
                .purpose(request.getPurpose())
                .status(LoanStatus.DRAFT)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        applicationMapper.insert(application);

        // Record status history
        recordStatusHistory("LOAN_APPLICATION", application.getId(), null, LoanStatus.DRAFT.name(), "SYSTEM", "대출 신청서 생성");

        log.info("Loan application created: applicationNo={}, id={}", applicationNo, application.getId());
        return application;
    }

    @Transactional
    public LoanApplication submitApplication(Long id) {
        log.info("Submitting loan application: id={}", id);

        LoanApplication application = getApplication(id);
        validateStatusTransition(application.getStatus(), LoanStatus.APPLIED);

        LoanStatus fromStatus = application.getStatus();
        application.setStatus(LoanStatus.APPLIED);
        application.setAppliedAt(LocalDateTime.now());
        applicationMapper.update(application);

        recordStatusHistory("LOAN_APPLICATION", id, fromStatus.name(), LoanStatus.APPLIED.name(), "SYSTEM", "대출 신청서 제출");

        log.info("Loan application submitted: id={}", id);
        return application;
    }

    public LoanApplication getApplication(Long id) {
        LoanApplication application = applicationMapper.findById(id);
        if (application == null) {
            throw new ResourceNotFoundException("LoanApplication", id);
        }
        return application;
    }

    public List<LoanApplication> getApplicationsByCustomer(Long customerId) {
        return applicationMapper.findByCustomerId(customerId);
    }

    public List<LoanApplication> getAllApplications() {
        return applicationMapper.findAll();
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

    private String generateApplicationNo() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long seq = APP_SEQ.incrementAndGet() % 10000;
        return String.format("APP%s%04d", datePart, seq);
    }
}
