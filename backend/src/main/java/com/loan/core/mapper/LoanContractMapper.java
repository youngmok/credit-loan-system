package com.loan.core.mapper;

import com.loan.core.domain.entity.LoanContract;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.math.BigDecimal;
import java.util.List;

@Mapper
public interface LoanContractMapper {

    void insert(LoanContract contract);

    LoanContract findById(Long id);

    LoanContract findByContractNo(String contractNo);

    List<LoanContract> findByCustomerId(Long customerId);

    List<LoanContract> findAll();

    void updateStatus(@Param("id") Long id, @Param("status") String status);

    void updateBalance(@Param("id") Long id,
                       @Param("outstandingBalance") BigDecimal balance,
                       @Param("totalInterestPaid") BigDecimal totalInterestPaid);

    int countByStatus(@Param("status") String status);

    BigDecimal sumOutstandingBalance(@Param("customerId") Long customerId);
}
