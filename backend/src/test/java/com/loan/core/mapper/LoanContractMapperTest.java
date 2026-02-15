package com.loan.core.mapper;

import com.loan.core.config.TestDataSourceConfig;
import com.loan.core.domain.entity.Customer;
import com.loan.core.domain.entity.LoanApplication;
import com.loan.core.domain.entity.LoanContract;
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
class LoanContractMapperTest {

    @Autowired private LoanContractMapper contractMapper;
    @Autowired private LoanApplicationMapper applicationMapper;
    @Autowired private CustomerMapper customerMapper;

    private Long customerId;
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
        customerId = customer.getId();

        LoanApplication app = LoanApplication.builder()
                .applicationNo("APP202601010001")
                .customerId(customerId)
                .requestedAmount(new BigDecimal("10000000"))
                .requestedTermMonths(12)
                .repaymentMethod(RepaymentMethod.EQUAL_PRINCIPAL_AND_INTEREST)
                .existingLoanAmount(BigDecimal.ZERO)
                .status(LoanStatus.APPROVED)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        applicationMapper.insert(app);
        applicationId = app.getId();
    }

    private LoanContract createContract(String contractNo) {
        return LoanContract.builder()
                .contractNo(contractNo)
                .applicationId(applicationId)
                .customerId(customerId)
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
    }

    @Test
    @DisplayName("insert 후 ID 자동 생성")
    void insertGeneratesId() {
        LoanContract contract = createContract("CNT202601010001");
        contractMapper.insert(contract);
        assertNotNull(contract.getId());
    }

    @Test
    @DisplayName("findById - Customer + Application JOIN 포함")
    void findByIdWithJoins() {
        LoanContract contract = createContract("CNT202601010002");
        contractMapper.insert(contract);

        LoanContract found = contractMapper.findById(contract.getId());

        assertNotNull(found);
        assertEquals("테스트고객", found.getCustomerName());
        assertEquals("APP202601010001", found.getApplicationNo());
    }

    @Test
    @DisplayName("updateStatus로 상태 변경")
    void updateStatus() {
        LoanContract contract = createContract("CNT202601010003");
        contractMapper.insert(contract);

        contractMapper.updateStatus(contract.getId(), LoanStatus.COMPLETED.name());

        LoanContract found = contractMapper.findById(contract.getId());
        assertEquals(LoanStatus.COMPLETED, found.getStatus());
    }

    @Test
    @DisplayName("updateBalance로 잔액 및 이자 변경")
    void updateBalance() {
        LoanContract contract = createContract("CNT202601010004");
        contractMapper.insert(contract);

        contractMapper.updateBalance(contract.getId(), new BigDecimal("9200000"), new BigDecimal("41667"));

        LoanContract found = contractMapper.findById(contract.getId());
        assertEquals(0, found.getOutstandingBalance().compareTo(new BigDecimal("9200000")));
        assertEquals(0, found.getTotalInterestPaid().compareTo(new BigDecimal("41667")));
    }
}
