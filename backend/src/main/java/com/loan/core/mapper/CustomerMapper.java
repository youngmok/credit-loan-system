package com.loan.core.mapper;

import com.loan.core.domain.entity.Customer;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CustomerMapper {

    void insert(Customer customer);

    Customer findById(Long id);

    Customer findByCustomerNo(String customerNo);

    List<Customer> findAll();

    void update(Customer customer);
}
