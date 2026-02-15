package com.loan.core.controller;

import com.loan.core.dto.response.ApiResponse;
import com.loan.core.dto.response.DashboardResponse;
import com.loan.core.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Slf4j
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ApiResponse<DashboardResponse> getDashboard(@RequestParam(required = false) Long customerId) {
        log.info("GET /api/v1/dashboard - customerId={}", customerId);
        DashboardResponse dashboard = dashboardService.getDashboard(customerId);
        return ApiResponse.ok(dashboard);
    }
}
