package com.loan.core.mapper;

import com.loan.core.config.TestDataSourceConfig;
import com.loan.core.domain.entity.Customer;
import com.loan.core.domain.entity.LoanApplication;
import com.loan.core.domain.enums.EmploymentType;
import com.loan.core.domain.enums.LoanStatus;
import com.loan.core.domain.enums.RepaymentMethod;
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
class LoanApplicationMapperTest {

    @Autowired private LoanApplicationMapper applicationMapper;
    @Autowired private CustomerMapper customerMapper;

    private Long customerId;

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
    }

    private LoanApplication createApp(String appNo) {
        return LoanApplication.builder()
                .applicationNo(appNo)
                .customerId(customerId)
                .requestedAmount(new BigDecimal("10000000"))
                .requestedTermMonths(12)
                .repaymentMethod(RepaymentMethod.EQUAL_PRINCIPAL_AND_INTEREST)
                .existingLoanAmount(BigDecimal.ZERO)
                .purpose("테스트")
                .status(LoanStatus.DRAFT)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("insert 후 ID 자동 생성")
    void insertGeneratesId() {
        LoanApplication app = createApp("APP202601010001");
        applicationMapper.insert(app);
        assertNotNull(app.getId());
    }

    @Test
    @DisplayName("findById - Customer JOIN 포함")
    void findByIdWithCustomerJoin() {
        LoanApplication app = createApp("APP202601010002");
        applicationMapper.insert(app);

        LoanApplication found = applicationMapper.findById(app.getId());

        assertNotNull(found);
        assertEquals("APP202601010002", found.getApplicationNo());
        assertNotNull(found.getCustomer());
        assertEquals("테스트고객", found.getCustomer().getName());
    }

    @Test
    @DisplayName("updateStatus로 상태 변경")
    void updateStatus() {
        LoanApplication app = createApp("APP202601010003");
        applicationMapper.insert(app);

        applicationMapper.updateStatus(app.getId(), LoanStatus.APPLIED.name());

        LoanApplication found = applicationMapper.findById(app.getId());
        assertEquals(LoanStatus.APPLIED, found.getStatus());
    }

    @Test
    @DisplayName("findByCustomerId - 고객별 조회")
    void findByCustomerId() {
        applicationMapper.insert(createApp("APP202601010004"));
        applicationMapper.insert(createApp("APP202601010005"));

        List<LoanApplication> apps = applicationMapper.findByCustomerId(customerId);

        assertEquals(2, apps.size());
    }

    @Test
    @DisplayName("findAll 전체 조회")
    void findAll() {
        applicationMapper.insert(createApp("APP202601010006"));

        List<LoanApplication> all = applicationMapper.findAll();

        assertFalse(all.isEmpty());
    }
}
