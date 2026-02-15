package com.loan.core.mapper;

import com.loan.core.domain.entity.LoanApplication;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface LoanApplicationMapper {

    void insert(LoanApplication application);

    LoanApplication findById(Long id);

    LoanApplication findByApplicationNo(String applicationNo);

    List<LoanApplication> findByCustomerId(Long customerId);

    List<LoanApplication> findAll();

    void updateStatus(@Param("id") Long id, @Param("status") String status);

    void update(LoanApplication application);
}
