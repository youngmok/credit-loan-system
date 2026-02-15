package com.loan.core.controller;

import com.loan.core.domain.entity.LoanTransaction;
import com.loan.core.dto.request.RepaymentRequest;
import com.loan.core.dto.response.ApiResponse;
import com.loan.core.dto.response.LoanTransactionResponse;
import com.loan.core.service.RepaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/loans/contracts")
@RequiredArgsConstructor
@Slf4j
public class RepaymentController {

    private final RepaymentService repaymentService;

    @PostMapping("/{id}/repay")
    public ApiResponse<LoanTransactionResponse> repay(@PathVariable Long id,
                                                       @Valid @RequestBody RepaymentRequest request) {
        log.info("POST /api/v1/loans/contracts/{}/repay - amount={}", id, request.getAmount());
        LoanTransaction transaction = repaymentService.repay(id, request.getAmount());
        return ApiResponse.ok(LoanTransactionResponse.from(transaction), "상환이 완료되었습니다");
    }

    @PostMapping("/{id}/early-repay")
    public ApiResponse<LoanTransactionResponse> earlyRepay(@PathVariable Long id) {
        log.info("POST /api/v1/loans/contracts/{}/early-repay", id);
        LoanTransaction transaction = repaymentService.earlyRepay(id);
        return ApiResponse.ok(LoanTransactionResponse.from(transaction), "조기상환이 완료되었습니다");
    }
}
