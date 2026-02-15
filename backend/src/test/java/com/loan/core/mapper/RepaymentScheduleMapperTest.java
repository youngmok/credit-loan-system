package com.loan.core.mapper;

import com.loan.core.config.TestDataSourceConfig;
import com.loan.core.domain.entity.Customer;
import com.loan.core.domain.entity.LoanApplication;
import com.loan.core.domain.entity.LoanContract;
import com.loan.core.domain.entity.RepaymentSchedule;
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
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@MybatisTest
@Import(TestDataSourceConfig.class)
@Sql("classpath:schema-h2.sql")
class RepaymentScheduleMapperTest {

    @Autowired private RepaymentScheduleMapper scheduleMapper;
    @Autowired private LoanContractMapper contractMapper;
    @Autowired private LoanApplicationMapper applicationMapper;
    @Autowired private CustomerMapper customerMapper;

    private Long contractId;

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
                .status(LoanStatus.APPROVED)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        applicationMapper.insert(app);

        LoanContract contract = LoanContract.builder()
                .contractNo("CNT202601010001")
                .applicationId(app.getId())
                .customerId(customer.getId())
                .principalAmount(new BigDecimal("10000000"))
                .interestRate(new BigDecimal("5.00"))
                .termMonths(12)
                .repaymentMethod(RepaymentMethod.EQUAL_PRINCIPAL_AND_INTEREST)
                .monthlyPayment(new BigDecimal("856075"))
                .outstandingBalance(new BigDecimal("10000000"))
                .totalInterestPaid(BigDecimal.ZERO)
                .status(LoanStatus.ACTIVE)
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusMonths(12))
                .executedAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        contractMapper.insert(contract);
        contractId = contract.getId();
    }

    private List<RepaymentSchedule> createSchedules() {
        LocalDateTime now = LocalDateTime.now();
        return List.of(
                RepaymentSchedule.builder()
                        .contractId(contractId).installmentNo(1)
                        .dueDate(LocalDate.now().plusMonths(1))
                        .principalAmount(new BigDecimal("814408"))
                        .interestAmount(new BigDecimal("41667"))
                        .totalAmount(new BigDecimal("856075"))
                        .outstandingBalanceAfter(new BigDecimal("9185592"))
                        .status(RepaymentStatus.SCHEDULED)
                        .createdAt(now).updatedAt(now)
                        .build(),
                RepaymentSchedule.builder()
                        .contractId(contractId).installmentNo(2)
                        .dueDate(LocalDate.now().plusMonths(2))
                        .principalAmount(new BigDecimal("817802"))
                        .interestAmount(new BigDecimal("38273"))
                        .totalAmount(new BigDecimal("856075"))
                        .outstandingBalanceAfter(new BigDecimal("8367790"))
                        .status(RepaymentStatus.SCHEDULED)
                        .createdAt(now).updatedAt(now)
                        .build()
        );
    }

    @Test
    @DisplayName("insertBatch로 일괄 삽입")
    void insertBatch() {
        List<RepaymentSchedule> schedules = createSchedules();
        scheduleMapper.insertBatch(schedules);

        List<RepaymentSchedule> found = scheduleMapper.findByContractId(contractId);
        assertEquals(2, found.size());
    }

    @Test
    @DisplayName("findByContractId - 회차순 정렬")
    void findByContractIdOrderedByInstallment() {
        scheduleMapper.insertBatch(createSchedules());

        List<RepaymentSchedule> found = scheduleMapper.findByContractId(contractId);

        assertEquals(1, found.get(0).getInstallmentNo());
        assertEquals(2, found.get(1).getInstallmentNo());
    }

    @Test
    @DisplayName("updateStatus - PAID 처리")
    void updateStatusToPaid() {
        scheduleMapper.insertBatch(createSchedules());
        List<RepaymentSchedule> schedules = scheduleMapper.findByContractId(contractId);
        Long firstId = schedules.get(0).getId();

        scheduleMapper.updateStatus(firstId, RepaymentStatus.PAID.name(), LocalDate.now(), new BigDecimal("856075"));

        RepaymentSchedule found = scheduleMapper.findById(firstId);
        assertEquals(RepaymentStatus.PAID, found.getStatus());
        assertNotNull(found.getPaidDate());
    }

    @Test
    @DisplayName("빈 contractId로 조회 시 빈 리스트")
    void findByNonExistentContractId() {
        List<RepaymentSchedule> found = scheduleMapper.findByContractId(999L);
        assertTrue(found.isEmpty());
    }
}
