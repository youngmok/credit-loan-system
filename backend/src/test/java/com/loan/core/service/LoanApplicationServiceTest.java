package com.loan.core.service;

import com.loan.core.domain.entity.Customer;
import com.loan.core.domain.entity.LoanApplication;
import com.loan.core.domain.enums.LoanStatus;
import com.loan.core.domain.enums.RepaymentMethod;
import com.loan.core.dto.request.LoanApplicationCreateRequest;
import com.loan.core.exception.InvalidStatusTransitionException;
import com.loan.core.exception.ResourceNotFoundException;
import com.loan.core.mapper.CustomerMapper;
import com.loan.core.mapper.LoanApplicationMapper;
import com.loan.core.mapper.StatusHistoryMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoanApplicationServiceTest {

    @Mock
    private LoanApplicationMapper applicationMapper;
    @Mock
    private CustomerMapper customerMapper;
    @Mock
    private StatusHistoryMapper statusHistoryMapper;

    @InjectMocks
    private LoanApplicationService applicationService;

    @Test
    @DisplayName("DRAFT 상태로 신청서 생성")
    void createApplication() {
        when(customerMapper.findById(1L)).thenReturn(Customer.builder().id(1L).build());
        doNothing().when(applicationMapper).insert(any());
        doNothing().when(statusHistoryMapper).insert(any());

        LoanApplicationCreateRequest request = LoanApplicationCreateRequest.builder()
                .customerId(1L)
                .requestedAmount(new BigDecimal("10000000"))
                .requestedTermMonths(12)
                .repaymentMethod("EQUAL_PRINCIPAL_AND_INTEREST")
                .build();

        LoanApplication result = applicationService.createApplication(request);

        assertNotNull(result);
        assertEquals(LoanStatus.DRAFT, result.getStatus());
        assertTrue(result.getApplicationNo().startsWith("APP"));
        verify(statusHistoryMapper).insert(any());
    }

    @Test
    @DisplayName("DRAFT -> APPLIED 제출 성공")
    void submitApplication() {
        LoanApplication app = LoanApplication.builder()
                .id(1L).status(LoanStatus.DRAFT).build();
        when(applicationMapper.findById(1L)).thenReturn(app);
        doNothing().when(applicationMapper).update(any());
        doNothing().when(statusHistoryMapper).insert(any());

        LoanApplication result = applicationService.submitApplication(1L);

        assertEquals(LoanStatus.APPLIED, result.getStatus());
        assertNotNull(result.getAppliedAt());
        verify(applicationMapper, never()).updateStatus(any(), any());
        verify(applicationMapper).update(any());
    }

    @Test
    @DisplayName("이미 APPLIED 상태에서 재제출 시 InvalidStatusTransitionException")
    void submitAlreadyAppliedThrows() {
        LoanApplication app = LoanApplication.builder()
                .id(1L).status(LoanStatus.APPLIED).build();
        when(applicationMapper.findById(1L)).thenReturn(app);

        assertThrows(InvalidStatusTransitionException.class,
                () -> applicationService.submitApplication(1L));
    }

    @Test
    @DisplayName("존재하지 않는 고객으로 신청 시 ResourceNotFoundException")
    void createApplicationCustomerNotFound() {
        when(customerMapper.findById(999L)).thenReturn(null);

        LoanApplicationCreateRequest request = LoanApplicationCreateRequest.builder()
                .customerId(999L)
                .requestedAmount(new BigDecimal("10000000"))
                .requestedTermMonths(12)
                .repaymentMethod("EQUAL_PRINCIPAL_AND_INTEREST")
                .build();

        assertThrows(ResourceNotFoundException.class,
                () -> applicationService.createApplication(request));
    }

    @Test
    @DisplayName("존재하지 않는 신청서 조회 시 ResourceNotFoundException")
    void getApplicationNotFound() {
        when(applicationMapper.findById(999L)).thenReturn(null);

        assertThrows(ResourceNotFoundException.class,
                () -> applicationService.getApplication(999L));
    }

    @Test
    @DisplayName("상태이력 기록 검증")
    void statusHistoryRecorded() {
        when(customerMapper.findById(1L)).thenReturn(Customer.builder().id(1L).build());
        doNothing().when(applicationMapper).insert(any());
        doNothing().when(statusHistoryMapper).insert(any());

        LoanApplicationCreateRequest request = LoanApplicationCreateRequest.builder()
                .customerId(1L)
                .requestedAmount(new BigDecimal("10000000"))
                .requestedTermMonths(12)
                .repaymentMethod("EQUAL_PRINCIPAL_AND_INTEREST")
                .build();

        applicationService.createApplication(request);

        verify(statusHistoryMapper, times(1)).insert(any());
    }
}
