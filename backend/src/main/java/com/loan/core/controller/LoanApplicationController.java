package com.loan.core.controller;

import com.loan.core.domain.entity.CreditAssessment;
import com.loan.core.domain.entity.LoanApplication;
import com.loan.core.domain.entity.StatusHistory;
import com.loan.core.dto.request.LoanApplicationCreateRequest;
import com.loan.core.dto.response.ApiResponse;
import com.loan.core.dto.response.CreditAssessmentResponse;
import com.loan.core.dto.response.LoanApplicationResponse;
import com.loan.core.mapper.StatusHistoryMapper;
import com.loan.core.service.CreditAssessmentService;
import com.loan.core.service.LoanApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/loans/applications")
@RequiredArgsConstructor
@Slf4j
public class LoanApplicationController {

    private final LoanApplicationService applicationService;
    private final CreditAssessmentService assessmentService;
    private final StatusHistoryMapper statusHistoryMapper;

    @PostMapping
    public ApiResponse<LoanApplicationResponse> createApplication(@Valid @RequestBody LoanApplicationCreateRequest request) {
        log.info("POST /api/v1/loans/applications - customerId={}", request.getCustomerId());
        LoanApplication application = applicationService.createApplication(request);
        return ApiResponse.ok(LoanApplicationResponse.from(application), "대출 신청서가 생성되었습니다");
    }

    @PostMapping("/{id}/submit")
    public ApiResponse<LoanApplicationResponse> submitApplication(@PathVariable Long id) {
        log.info("POST /api/v1/loans/applications/{}/submit", id);
        LoanApplication application = applicationService.submitApplication(id);
        return ApiResponse.ok(LoanApplicationResponse.from(application), "대출 신청서가 제출되었습니다");
    }

    @PostMapping("/{id}/assess")
    public ApiResponse<CreditAssessmentResponse> assessApplication(@PathVariable Long id) {
        log.info("POST /api/v1/loans/applications/{}/assess", id);
        CreditAssessment assessment = assessmentService.assessApplication(id);
        return ApiResponse.ok(CreditAssessmentResponse.from(assessment), "심사가 완료되었습니다");
    }

    @GetMapping("/{id}")
    public ApiResponse<LoanApplicationResponse> getApplication(@PathVariable Long id) {
        log.info("GET /api/v1/loans/applications/{}", id);
        LoanApplication application = applicationService.getApplication(id);
        return ApiResponse.ok(LoanApplicationResponse.from(application));
    }

    @GetMapping
    public ApiResponse<List<LoanApplicationResponse>> getAllApplications(@RequestParam(required = false) Long customerId) {
        log.info("GET /api/v1/loans/applications - customerId={}", customerId);
        List<LoanApplication> applications;
        if (customerId != null) {
            applications = applicationService.getApplicationsByCustomer(customerId);
        } else {
            applications = applicationService.getAllApplications();
        }
        List<LoanApplicationResponse> responses = applications.stream()
                .map(LoanApplicationResponse::from)
                .collect(Collectors.toList());
        return ApiResponse.ok(responses);
    }

    @GetMapping("/{id}/assessment")
    public ApiResponse<CreditAssessmentResponse> getAssessment(@PathVariable Long id) {
        log.info("GET /api/v1/loans/applications/{}/assessment", id);
        CreditAssessment assessment = assessmentService.getAssessmentByApplicationId(id);
        return ApiResponse.ok(CreditAssessmentResponse.from(assessment));
    }

    @GetMapping("/{id}/history")
    public ApiResponse<List<StatusHistory>> getStatusHistory(@PathVariable Long id) {
        log.info("GET /api/v1/loans/applications/{}/history", id);
        // Validate application exists
        applicationService.getApplication(id);
        List<StatusHistory> history = statusHistoryMapper.findByEntity("LOAN_APPLICATION", id);
        return ApiResponse.ok(history);
    }
}
