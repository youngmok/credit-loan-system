package com.loan.core.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;
import org.springframework.context.annotation.Import;

@TestConfiguration
@Import(DataSourceAutoConfiguration.class)
public class TestDataSourceConfig {
}
