CREATE TABLE IF NOT EXISTS customers (
    id BIGSERIAL PRIMARY KEY,
    customer_no VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(200),
    phone VARCHAR(20),
    annual_income NUMERIC(15, 2),
    employment_type VARCHAR(30),
    company VARCHAR(200),
    birth_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loan_applications (
    id BIGSERIAL PRIMARY KEY,
    application_no VARCHAR(20) UNIQUE NOT NULL,
    customer_id BIGINT NOT NULL REFERENCES customers(id),
    requested_amount NUMERIC(15, 2) NOT NULL,
    requested_term_months INT NOT NULL,
    repayment_method VARCHAR(50) NOT NULL,
    existing_loan_amount NUMERIC(15, 2) DEFAULT 0,
    purpose TEXT,
    status VARCHAR(20) NOT NULL,
    applied_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS credit_assessments (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES loan_applications(id) UNIQUE,
    credit_score INT,
    credit_grade VARCHAR(20),
    dsr_ratio NUMERIC(5, 2),
    approved_rate NUMERIC(5, 2),
    approved_amount NUMERIC(15, 2),
    approved_term_months INT,
    result VARCHAR(20) NOT NULL,
    rejection_reason TEXT,
    assessed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loan_contracts (
    id BIGSERIAL PRIMARY KEY,
    contract_no VARCHAR(20) UNIQUE NOT NULL,
    application_id BIGINT NOT NULL REFERENCES loan_applications(id),
    customer_id BIGINT NOT NULL REFERENCES customers(id),
    principal_amount NUMERIC(15, 2) NOT NULL,
    interest_rate NUMERIC(5, 2) NOT NULL,
    term_months INT NOT NULL,
    repayment_method VARCHAR(50) NOT NULL,
    monthly_payment NUMERIC(15, 2) NOT NULL,
    outstanding_balance NUMERIC(15, 2) NOT NULL,
    total_interest_paid NUMERIC(15, 2) DEFAULT 0,
    status VARCHAR(20) NOT NULL,
    start_date DATE,
    end_date DATE,
    executed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS repayment_schedules (
    id BIGSERIAL PRIMARY KEY,
    contract_id BIGINT NOT NULL REFERENCES loan_contracts(id),
    installment_no INT NOT NULL,
    due_date DATE NOT NULL,
    principal_amount NUMERIC(15, 2) NOT NULL,
    interest_amount NUMERIC(15, 2) NOT NULL,
    total_amount NUMERIC(15, 2) NOT NULL,
    outstanding_balance_after NUMERIC(15, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'SCHEDULED',
    paid_date DATE,
    paid_amount NUMERIC(15, 2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loan_transactions (
    id BIGSERIAL PRIMARY KEY,
    transaction_no VARCHAR(30) UNIQUE NOT NULL,
    contract_id BIGINT NOT NULL REFERENCES loan_contracts(id),
    type VARCHAR(30) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    balance_after NUMERIC(15, 2) NOT NULL,
    description TEXT,
    transacted_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS status_histories (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    from_status VARCHAR(20),
    to_status VARCHAR(20) NOT NULL,
    changed_by VARCHAR(100),
    reason TEXT,
    changed_at TIMESTAMP DEFAULT NOW()
);
