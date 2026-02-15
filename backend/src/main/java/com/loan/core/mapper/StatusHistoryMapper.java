package com.loan.core.mapper;

import com.loan.core.domain.entity.StatusHistory;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface StatusHistoryMapper {

    void insert(StatusHistory history);

    List<StatusHistory> findByEntity(@Param("entityType") String entityType,
                                     @Param("entityId") Long entityId);
}
