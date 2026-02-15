package com.loan.core.controller;

import com.loan.core.domain.entity.Customer;
import com.loan.core.dto.request.CustomerCreateRequest;
import com.loan.core.dto.response.ApiResponse;
import com.loan.core.dto.response.CustomerResponse;
import com.loan.core.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
@Slf4j
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    public ApiResponse<CustomerResponse> createCustomer(@Valid @RequestBody CustomerCreateRequest request) {
        log.info("POST /api/v1/customers - Creating customer: {}", request.getName());
        Customer customer = customerService.createCustomer(request);
        return ApiResponse.ok(CustomerResponse.from(customer), "고객이 등록되었습니다");
    }

    @GetMapping("/{id}")
    public ApiResponse<CustomerResponse> getCustomer(@PathVariable Long id) {
        log.info("GET /api/v1/customers/{}", id);
        Customer customer = customerService.getCustomer(id);
        return ApiResponse.ok(CustomerResponse.from(customer));
    }

    @GetMapping
    public ApiResponse<List<CustomerResponse>> getAllCustomers() {
        log.info("GET /api/v1/customers");
        List<CustomerResponse> customers = customerService.getAllCustomers().stream()
                .map(CustomerResponse::from)
                .collect(Collectors.toList());
        return ApiResponse.ok(customers);
    }
}
