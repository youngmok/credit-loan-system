package com.loan.core.dto.response;

import com.loan.core.domain.entity.LoanTransaction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoanTransactionResponse {

    private Long id;
    private String transactionNo;
    private Long contractId;
    private String type;
    private String typeLabel;
    private BigDecimal amount;
    private BigDecimal balanceAfter;
    private String description;
    private LocalDateTime transactedAt;
    private LocalDateTime createdAt;

    public static LoanTransactionResponse from(LoanTransaction transaction) {
        if (transaction == null) return null;
        return LoanTransactionResponse.builder()
                .id(transaction.getId())
                .transactionNo(transaction.getTransactionNo())
                .contractId(transaction.getContractId())
                .type(transaction.getType() != null ? transaction.getType().name() : null)
                .typeLabel(transaction.getType() != null ? transaction.getType().getDescription() : null)
                .amount(transaction.getAmount())
                .balanceAfter(transaction.getBalanceAfter())
                .description(transaction.getDescription())
                .transactedAt(transaction.getTransactedAt())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
