package com.loan.core.dto.response;

import com.loan.core.domain.entity.Customer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponse {

    private Long id;
    private String customerNo;
    private String name;
    private String email;
    private String phone;
    private BigDecimal annualIncome;
    private String employmentType;
    private String employmentTypeLabel;
    private String company;
    private LocalDate birthDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CustomerResponse from(Customer customer) {
        if (customer == null) return null;
        return CustomerResponse.builder()
                .id(customer.getId())
                .customerNo(customer.getCustomerNo())
                .name(customer.getName())
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .annualIncome(customer.getAnnualIncome())
                .employmentType(customer.getEmploymentType() != null ? customer.getEmploymentType().name() : null)
                .employmentTypeLabel(customer.getEmploymentType() != null ? customer.getEmploymentType().getDescription() : null)
                .company(customer.getCompany())
                .birthDate(customer.getBirthDate())
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .build();
    }
}
