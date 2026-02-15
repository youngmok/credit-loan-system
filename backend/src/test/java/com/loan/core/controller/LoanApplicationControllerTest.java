package com.loan.core.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loan.core.domain.entity.CreditAssessment;
import com.loan.core.domain.entity.LoanApplication;
import com.loan.core.domain.enums.*;
import com.loan.core.dto.request.LoanApplicationCreateRequest;
import com.loan.core.mapper.StatusHistoryMapper;
import com.loan.core.service.CreditAssessmentService;
import com.loan.core.service.LoanApplicationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(LoanApplicationController.class)
class LoanApplicationControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockitoBean private LoanApplicationService applicationService;
    @MockitoBean private CreditAssessmentService assessmentService;
    @MockitoBean private StatusHistoryMapper statusHistoryMapper;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @DisplayName("POST /api/v1/loans/applications - 정상 생성")
    void createApplicationSuccess() throws Exception {
        LoanApplication app = LoanApplication.builder()
                .id(1L).applicationNo("APP202601010001").customerId(1L)
                .requestedAmount(new BigDecimal("10000000")).requestedTermMonths(12)
                .repaymentMethod(RepaymentMethod.EQUAL_PRINCIPAL_AND_INTEREST)
                .status(LoanStatus.DRAFT)
                .createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now())
                .build();
        when(applicationService.createApplication(any())).thenReturn(app);

        LoanApplicationCreateRequest request = LoanApplicationCreateRequest.builder()
                .customerId(1L).requestedAmount(new BigDecimal("10000000"))
                .requestedTermMonths(12).repaymentMethod("EQUAL_PRINCIPAL_AND_INTEREST")
                .build();

        mockMvc.perform(post("/api/v1/loans/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.applicationNo").value("APP202601010001"))
                .andExpect(jsonPath("$.data.status").value("DRAFT"));
    }

    @Test
    @DisplayName("POST /api/v1/loans/applications/{id}/submit - 제출 성공")
    void submitApplicationSuccess() throws Exception {
        LoanApplication app = LoanApplication.builder()
                .id(1L).applicationNo("APP202601010001").customerId(1L)
                .requestedAmount(new BigDecimal("10000000")).requestedTermMonths(12)
                .repaymentMethod(RepaymentMethod.EQUAL_PRINCIPAL_AND_INTEREST)
                .status(LoanStatus.APPLIED)
                .appliedAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now())
                .build();
        when(applicationService.submitApplication(1L)).thenReturn(app);

        mockMvc.perform(post("/api/v1/loans/applications/1/submit"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("APPLIED"));
    }

    @Test
    @DisplayName("POST /api/v1/loans/applications/{id}/assess - 심사 성공")
    void assessApplicationSuccess() throws Exception {
        CreditAssessment assessment = CreditAssessment.builder()
                .id(1L).applicationId(1L).creditScore(850)
                .creditGrade(CreditGrade.GRADE_2)
                .dsrRatio(new BigDecimal("25.00"))
                .approvedRate(new BigDecimal("4.50"))
                .approvedAmount(new BigDecimal("10000000"))
                .approvedTermMonths(12)
                .result(AssessmentResult.APPROVED)
                .assessedAt(LocalDateTime.now()).createdAt(LocalDateTime.now())
                .build();
        when(assessmentService.assessApplication(1L)).thenReturn(assessment);

        mockMvc.perform(post("/api/v1/loans/applications/1/assess"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.result").value("APPROVED"))
                .andExpect(jsonPath("$.data.creditScore").value(850));
    }

    @Test
    @DisplayName("GET /api/v1/loans/applications/{id} - 조회 성공")
    void getApplicationSuccess() throws Exception {
        LoanApplication app = LoanApplication.builder()
                .id(1L).applicationNo("APP202601010001").customerId(1L)
                .requestedAmount(new BigDecimal("10000000")).requestedTermMonths(12)
                .repaymentMethod(RepaymentMethod.EQUAL_PRINCIPAL_AND_INTEREST)
                .status(LoanStatus.DRAFT)
                .createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now())
                .build();
        when(applicationService.getApplication(1L)).thenReturn(app);

        mockMvc.perform(get("/api/v1/loans/applications/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.applicationNo").value("APP202601010001"));
    }
}
