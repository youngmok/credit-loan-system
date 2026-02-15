package com.loan.core.mapper;

import com.loan.core.domain.entity.LoanTransaction;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface LoanTransactionMapper {

    void insert(LoanTransaction transaction);

    List<LoanTransaction> findByContractId(Long contractId);
}
