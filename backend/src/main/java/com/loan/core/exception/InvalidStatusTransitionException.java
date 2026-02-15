package com.loan.core.exception;

import com.loan.core.domain.enums.LoanStatus;

public class InvalidStatusTransitionException extends BusinessException {

    public InvalidStatusTransitionException(LoanStatus from, LoanStatus to) {
        super(String.format("상태 전환이 불가합니다: %s -> %s", from, to));
    }

    public InvalidStatusTransitionException(String message) {
        super(message);
    }
}
