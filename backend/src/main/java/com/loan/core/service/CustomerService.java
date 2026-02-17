package com.loan.core.service;

import com.loan.core.domain.entity.Customer;
import com.loan.core.domain.enums.EmploymentType;
import com.loan.core.dto.request.CustomerCreateRequest;
import com.loan.core.exception.ResourceNotFoundException;
import com.loan.core.mapper.CustomerMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomerService {

    private final CustomerMapper customerMapper;
    private static final AtomicLong CUSTOMER_SEQ = new AtomicLong(System.nanoTime() % 10000);

    @Transactional
    public Customer createCustomer(CustomerCreateRequest request) {
        log.info("Creating customer: name={}", request.getName());

        String customerNo = generateCustomerNo();

        Customer customer = Customer.builder()
                .customerNo(customerNo)
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .annualIncome(request.getAnnualIncome())
                .employmentType(EmploymentType.valueOf(request.getEmploymentType()))
                .company(request.getCompany())
                .birthDate(LocalDate.parse(request.getBirthDate(), DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        customerMapper.insert(customer);
        log.info("Customer created: customerNo={}, id={}", customerNo, customer.getId());

        return customer;
    }

    public Customer getCustomer(Long id) {
        Customer customer = customerMapper.findById(id);
        if (customer == null) {
            throw new ResourceNotFoundException("Customer", id);
        }
        return customer;
    }

    public List<Customer> getAllCustomers() {
        return customerMapper.findAll();
    }

    private String generateCustomerNo() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long seq = CUSTOMER_SEQ.incrementAndGet() % 10000;
        return String.format("CUS%s%04d", datePart, seq);
    }
}
