package com.loan.core.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoanApplicationCreateRequest {

    @NotNull(message = "고객 ID는 필수입니다")
    private Long customerId;

    @NotNull(message = "대출 요청 금액은 필수입니다")
    @Positive(message = "대출 요청 금액은 양수여야 합니다")
    private BigDecimal requestedAmount;

    @NotNull(message = "대출 기간은 필수입니다")
    @Positive(message = "대출 기간은 양수여야 합니다")
    private Integer requestedTermMonths;

    @NotBlank(message = "상환 방식은 필수입니다")
    private String repaymentMethod;

    @Builder.Default
    private BigDecimal existingLoanAmount = BigDecimal.ZERO;

    private String purpose;
}
