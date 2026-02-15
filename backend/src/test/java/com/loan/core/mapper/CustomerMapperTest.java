package com.loan.core.mapper;

import com.loan.core.config.TestDataSourceConfig;
import com.loan.core.domain.entity.Customer;
import com.loan.core.domain.enums.EmploymentType;
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
class CustomerMapperTest {

    @Autowired
    private CustomerMapper customerMapper;

    private Customer createTestCustomer(String customerNo) {
        return Customer.builder()
                .customerNo(customerNo)
                .name("테스트고객")
                .email("test@test.com")
                .phone("010-1234-5678")
                .annualIncome(new BigDecimal("50000000"))
                .employmentType(EmploymentType.REGULAR)
                .company("테스트회사")
                .birthDate(LocalDate.of(1990, 1, 1))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("insert 후 ID 자동 생성")
    void insertGeneratesId() {
        Customer customer = createTestCustomer("CUS202601010001");
        customerMapper.insert(customer);
        assertNotNull(customer.getId());
    }

    @Test
    @DisplayName("findById로 조회")
    void findById() {
        Customer customer = createTestCustomer("CUS202601010002");
        customerMapper.insert(customer);

        Customer found = customerMapper.findById(customer.getId());

        assertNotNull(found);
        assertEquals("테스트고객", found.getName());
        assertEquals("test@test.com", found.getEmail());
    }

    @Test
    @DisplayName("findByCustomerNo로 조회")
    void findByCustomerNo() {
        Customer customer = createTestCustomer("CUS202601010003");
        customerMapper.insert(customer);

        Customer found = customerMapper.findByCustomerNo("CUS202601010003");

        assertNotNull(found);
        assertEquals(customer.getId(), found.getId());
    }

    @Test
    @DisplayName("findAll 전체 조회")
    void findAll() {
        customerMapper.insert(createTestCustomer("CUS202601010004"));
        customerMapper.insert(createTestCustomer("CUS202601010005"));

        List<Customer> all = customerMapper.findAll();

        assertEquals(2, all.size());
    }
}
