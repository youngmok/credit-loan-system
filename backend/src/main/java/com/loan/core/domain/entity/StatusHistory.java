package com.loan.core.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatusHistory {

    private Long id;
    private String entityType;
    private Long entityId;
    private String fromStatus;
    private String toStatus;
    private String changedBy;
    private String reason;
    private LocalDateTime changedAt;
}
