package com.loan.core.mapper;

import com.loan.core.domain.entity.RepaymentSchedule;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Mapper
public interface RepaymentScheduleMapper {

    void insertBatch(@Param("list") List<RepaymentSchedule> schedules);

    List<RepaymentSchedule> findByContractId(Long contractId);

    RepaymentSchedule findById(Long id);

    void updateStatus(@Param("id") Long id,
                      @Param("status") String status,
                      @Param("paidDate") LocalDate paidDate,
                      @Param("paidAmount") BigDecimal paidAmount);

    List<RepaymentSchedule> findOverdueSchedules(@Param("date") LocalDate date);
}
