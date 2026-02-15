package com.loan.core.dto.response;

import com.loan.core.domain.entity.RepaymentSchedule;
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
public class RepaymentScheduleResponse {

    private Long id;
    private Long contractId;
    private Integer installmentNo;
    private LocalDate dueDate;
    private BigDecimal principalAmount;
    private BigDecimal interestAmount;
    private BigDecimal totalAmount;
    private BigDecimal outstandingBalanceAfter;
    private String status;
    private String statusLabel;
    private LocalDate paidDate;
    private BigDecimal paidAmount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static RepaymentScheduleResponse from(RepaymentSchedule schedule) {
        if (schedule == null) return null;
        return RepaymentScheduleResponse.builder()
                .id(schedule.getId())
                .contractId(schedule.getContractId())
                .installmentNo(schedule.getInstallmentNo())
                .dueDate(schedule.getDueDate())
                .principalAmount(schedule.getPrincipalAmount())
                .interestAmount(schedule.getInterestAmount())
                .totalAmount(schedule.getTotalAmount())
                .outstandingBalanceAfter(schedule.getOutstandingBalanceAfter())
                .status(schedule.getStatus() != null ? schedule.getStatus().name() : null)
                .statusLabel(schedule.getStatus() != null ? schedule.getStatus().getDescription() : null)
                .paidDate(schedule.getPaidDate())
                .paidAmount(schedule.getPaidAmount())
                .createdAt(schedule.getCreatedAt())
                .updatedAt(schedule.getUpdatedAt())
                .build();
    }
}
