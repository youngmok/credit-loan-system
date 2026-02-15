package com.loan.core.mapper;

import com.loan.core.domain.entity.CreditAssessment;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CreditAssessmentMapper {

    void insert(CreditAssessment assessment);

    CreditAssessment findByApplicationId(Long applicationId);
}
