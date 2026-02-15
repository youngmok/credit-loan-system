package com.loan.core.controller;

import com.loan.core.domain.entity.LoanContract;
import com.loan.core.domain.entity.LoanTransaction;
import com.loan.core.domain.entity.RepaymentSchedule;
import com.loan.core.dto.response.ApiResponse;
import com.loan.core.dto.response.LoanContractResponse;
import com.loan.core.dto.response.LoanTransactionResponse;
import com.loan.core.dto.response.RepaymentScheduleResponse;
import com.loan.core.service.LoanContractService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/loans/contracts")
@RequiredArgsConstructor
@Slf4j
public class LoanContractController {

    private final LoanContractService contractService;

    @PostMapping("/execute/{applicationId}")
    public ApiResponse<LoanContractResponse> executeLoan(@PathVariable Long applicationId) {
        log.info("POST /api/v1/loans/contracts/execute/{}", applicationId);
        LoanContract contract = contractService.executeLoan(applicationId);
        return ApiResponse.ok(LoanContractResponse.from(contract), "대출이 실행되었습니다");
    }

    @GetMapping
    public ApiResponse<List<LoanContractResponse>> getAllContracts(@RequestParam(required = false) Long customerId) {
        log.info("GET /api/v1/loans/contracts - customerId={}", customerId);
        List<LoanContract> contracts;
        if (customerId != null) {
            contracts = contractService.getContractsByCustomer(customerId);
        } else {
            contracts = contractService.getAllContracts();
        }
        List<LoanContractResponse> responses = contracts.stream()
                .map(LoanContractResponse::from)
                .collect(Collectors.toList());
        return ApiResponse.ok(responses);
    }

    @GetMapping("/{id}")
    public ApiResponse<LoanContractResponse> getContract(@PathVariable Long id) {
        log.info("GET /api/v1/loans/contracts/{}", id);
        LoanContract contract = contractService.getContract(id);
        return ApiResponse.ok(LoanContractResponse.from(contract));
    }

    @GetMapping("/{id}/schedules")
    public ApiResponse<List<RepaymentScheduleResponse>> getSchedules(@PathVariable Long id) {
        log.info("GET /api/v1/loans/contracts/{}/schedules", id);
        List<RepaymentSchedule> schedules = contractService.getSchedules(id);
        List<RepaymentScheduleResponse> responses = schedules.stream()
                .map(RepaymentScheduleResponse::from)
                .collect(Collectors.toList());
        return ApiResponse.ok(responses);
    }

    @GetMapping("/{id}/transactions")
    public ApiResponse<List<LoanTransactionResponse>> getTransactions(@PathVariable Long id) {
        log.info("GET /api/v1/loans/contracts/{}/transactions", id);
        List<LoanTransaction> transactions = contractService.getTransactions(id);
        List<LoanTransactionResponse> responses = transactions.stream()
                .map(LoanTransactionResponse::from)
                .collect(Collectors.toList());
        return ApiResponse.ok(responses);
    }
}
