package com.loan.core.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loan.core.domain.entity.Customer;
import com.loan.core.domain.enums.EmploymentType;
import com.loan.core.dto.request.CustomerCreateRequest;
import com.loan.core.exception.ResourceNotFoundException;
import com.loan.core.service.CustomerService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CustomerController.class)
class CustomerControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockitoBean private CustomerService customerService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @DisplayName("POST /api/v1/customers - 정상 생성")
    void createCustomerSuccess() throws Exception {
        Customer customer = Customer.builder()
                .id(1L).customerNo("CUS202601010001").name("홍길동")
                .email("hong@test.com").phone("010-1234-5678")
                .annualIncome(new BigDecimal("50000000"))
                .employmentType(EmploymentType.REGULAR)
                .birthDate(LocalDate.of(1990, 1, 15))
                .createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now())
                .build();
        when(customerService.createCustomer(any())).thenReturn(customer);

        CustomerCreateRequest request = CustomerCreateRequest.builder()
                .name("홍길동").email("hong@test.com").phone("010-1234-5678")
                .annualIncome(new BigDecimal("50000000")).employmentType("REGULAR")
                .company("테스트회사").birthDate("1990-01-15")
                .build();

        mockMvc.perform(post("/api/v1/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("홍길동"))
                .andExpect(jsonPath("$.data.customerNo").value("CUS202601010001"));
    }

    @Test
    @DisplayName("POST /api/v1/customers - 이름 누락 시 400")
    void createCustomerNameMissing() throws Exception {
        CustomerCreateRequest request = CustomerCreateRequest.builder()
                .email("hong@test.com").phone("010-1234-5678")
                .annualIncome(new BigDecimal("50000000")).employmentType("REGULAR")
                .birthDate("1990-01-15")
                .build();

        mockMvc.perform(post("/api/v1/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/v1/customers/{id} - 정상 조회")
    void getCustomerSuccess() throws Exception {
        Customer customer = Customer.builder()
                .id(1L).customerNo("CUS202601010001").name("홍길동")
                .email("hong@test.com").employmentType(EmploymentType.REGULAR)
                .createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now())
                .build();
        when(customerService.getCustomer(1L)).thenReturn(customer);

        mockMvc.perform(get("/api/v1/customers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("홍길동"));
    }

    @Test
    @DisplayName("GET /api/v1/customers/{id} - 비존재 시 404")
    void getCustomerNotFound() throws Exception {
        when(customerService.getCustomer(999L))
                .thenThrow(new ResourceNotFoundException("Customer", 999L));

        mockMvc.perform(get("/api/v1/customers/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }
}
