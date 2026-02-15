package com.loan.core.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerCreateRequest {

    @NotBlank(message = "이름은 필수입니다")
    private String name;

    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "유효한 이메일 형식이 아닙니다")
    private String email;

    @NotBlank(message = "전화번호는 필수입니다")
    private String phone;

    @NotNull(message = "연소득은 필수입니다")
    private BigDecimal annualIncome;

    @NotBlank(message = "고용형태는 필수입니다")
    private String employmentType;

    private String company;

    @NotBlank(message = "생년월일은 필수입니다")
    private String birthDate;
}
