package com.loan.core.service;

import com.loan.core.domain.entity.Customer;
import com.loan.core.dto.request.CustomerCreateRequest;
import com.loan.core.exception.ResourceNotFoundException;
import com.loan.core.mapper.CustomerMapper;
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
class CustomerServiceTest {

    @Mock
    private CustomerMapper customerMapper;

    @InjectMocks
    private CustomerService customerService;

    @Test
    @DisplayName("정상 고객 생성 - 고객번호 CUSyyyyMMddNNNN 형식")
    void createCustomer() {
        CustomerCreateRequest request = CustomerCreateRequest.builder()
                .name("홍길동")
                .email("hong@test.com")
                .phone("010-1234-5678")
                .annualIncome(new BigDecimal("50000000"))
                .employmentType("REGULAR")
                .company("테스트회사")
                .birthDate("1990-01-15")
                .build();

        doNothing().when(customerMapper).insert(any(Customer.class));

        Customer result = customerService.createCustomer(request);

        assertNotNull(result);
        assertTrue(result.getCustomerNo().startsWith("CUS"));
        assertEquals(15, result.getCustomerNo().length()); // CUS + yyyyMMdd(8) + NNNN(4) = 15
        assertEquals("홍길동", result.getName());
        verify(customerMapper).insert(any(Customer.class));
    }

    @Test
    @DisplayName("존재하는 고객 조회")
    void getExistingCustomer() {
        Customer customer = Customer.builder().id(1L).name("홍길동").build();
        when(customerMapper.findById(1L)).thenReturn(customer);

        Customer result = customerService.getCustomer(1L);

        assertEquals("홍길동", result.getName());
    }

    @Test
    @DisplayName("존재하지 않는 고객 조회 시 ResourceNotFoundException")
    void getCustomerNotFound() {
        when(customerMapper.findById(999L)).thenReturn(null);

        assertThrows(ResourceNotFoundException.class, () -> customerService.getCustomer(999L));
    }

    @Test
    @DisplayName("전체 고객 조회")
    void getAllCustomers() {
        when(customerMapper.findAll()).thenReturn(List.of(
                Customer.builder().id(1L).name("A").build(),
                Customer.builder().id(2L).name("B").build()
        ));

        List<Customer> result = customerService.getAllCustomers();

        assertEquals(2, result.size());
    }
}
