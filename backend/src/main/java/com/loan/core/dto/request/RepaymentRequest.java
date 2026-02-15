package com.loan.core.dto.request;

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
public class RepaymentRequest {

    @NotNull(message = "상환 금액은 필수입니다")
    @Positive(message = "상환 금액은 양수여야 합니다")
    private BigDecimal amount;
}
