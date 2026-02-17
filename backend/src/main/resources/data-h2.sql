-- Demo customers
MERGE INTO customers (id, customer_no, name, email, phone, annual_income, employment_type, company, birth_date, created_at, updated_at)
KEY (customer_no)
VALUES (1, 'CUS202601010001', '김철수', 'kim.cs@example.com', '010-1234-5678', 55000000.00, 'REGULAR', '삼성전자', DATE '1985-03-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

MERGE INTO customers (id, customer_no, name, email, phone, annual_income, employment_type, company, birth_date, created_at, updated_at)
KEY (customer_no)
VALUES (2, 'CUS202601010002', '이영희', 'lee.yh@example.com', '010-2345-6789', 38000000.00, 'CONTRACT', 'LG화학', DATE '1990-07-22', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

MERGE INTO customers (id, customer_no, name, email, phone, annual_income, employment_type, company, birth_date, created_at, updated_at)
KEY (customer_no)
VALUES (3, 'CUS202601010003', '박민수', 'park.ms@example.com', '010-3456-7890', 72000000.00, 'SELF_EMPLOYED', '민수네 가게', DATE '1978-11-08', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Demo loan applications
MERGE INTO loan_applications (id, application_no, customer_id, requested_amount, requested_term_months, repayment_method, existing_loan_amount, purpose, status, applied_at, created_at, updated_at)
KEY (application_no)
VALUES (1, 'APP202601010001', 1, 30000000.00, 36, 'EQUAL_PRINCIPAL_AND_INTEREST', 5000000.00, '주택자금', 'APPROVED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

MERGE INTO loan_applications (id, application_no, customer_id, requested_amount, requested_term_months, repayment_method, existing_loan_amount, purpose, status, applied_at, created_at, updated_at)
KEY (application_no)
VALUES (2, 'APP202601010002', 2, 15000000.00, 24, 'EQUAL_PRINCIPAL', 0.00, '생활자금', 'APPLIED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

MERGE INTO loan_applications (id, application_no, customer_id, requested_amount, requested_term_months, repayment_method, existing_loan_amount, purpose, status, applied_at, created_at, updated_at)
KEY (application_no)
VALUES (3, 'APP202601010003', 3, 50000000.00, 48, 'BULLET', 10000000.00, '사업자금', 'DRAFT', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Demo credit assessment for first application
MERGE INTO credit_assessments (id, application_id, credit_score, credit_grade, dsr_ratio, approved_rate, approved_amount, approved_term_months, result, rejection_reason, assessed_at, created_at)
KEY (application_id)
VALUES (1, 1, 875, 'GRADE_2', 22.50, 4.50, 30000000.00, 36, 'APPROVED', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Demo loan contract
MERGE INTO loan_contracts (id, contract_no, application_id, customer_id, principal_amount, interest_rate, term_months, repayment_method, monthly_payment, outstanding_balance, total_interest_paid, status, start_date, end_date, executed_at, created_at, updated_at)
KEY (contract_no)
VALUES (1, 'CNT202601010001', 1, 1, 30000000.00, 4.50, 36, 'EQUAL_PRINCIPAL_AND_INTEREST', 893044.00, 28500000.00, 337500.00, 'ACTIVE', DATE '2026-01-01', DATE '2029-01-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Demo repayment schedules (first 3 installments)
MERGE INTO repayment_schedules (id, contract_id, installment_no, due_date, principal_amount, interest_amount, total_amount, outstanding_balance_after, status, paid_date, paid_amount, created_at, updated_at)
KEY (id)
VALUES (1, 1, 1, DATE '2026-02-01', 780544.00, 112500.00, 893044.00, 29219456.00, 'PAID', DATE '2026-02-01', 893044.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

MERGE INTO repayment_schedules (id, contract_id, installment_no, due_date, principal_amount, interest_amount, total_amount, outstanding_balance_after, status, paid_date, paid_amount, created_at, updated_at)
KEY (id)
VALUES (2, 1, 2, DATE '2026-03-01', 783472.00, 109573.00, 893045.00, 28435984.00, 'PAID', DATE '2026-03-01', 893045.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

MERGE INTO repayment_schedules (id, contract_id, installment_no, due_date, principal_amount, interest_amount, total_amount, outstanding_balance_after, status, paid_date, paid_amount, created_at, updated_at)
KEY (id)
VALUES (3, 1, 3, DATE '2026-04-01', 786410.00, 106635.00, 893045.00, 27649574.00, 'SCHEDULED', NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Demo loan transactions
MERGE INTO loan_transactions (id, transaction_no, contract_id, type, amount, balance_after, description, transacted_at, created_at)
KEY (transaction_no)
VALUES (1, 'TXN20260101000001', 1, 'DISBURSEMENT', 30000000.00, 30000000.00, '대출 실행: CNT202601010001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

MERGE INTO loan_transactions (id, transaction_no, contract_id, type, amount, balance_after, description, transacted_at, created_at)
KEY (transaction_no)
VALUES (2, 'TXN20260201000001', 1, 'REPAYMENT', 893044.00, 29219456.00, '제1회차 상환', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

MERGE INTO loan_transactions (id, transaction_no, contract_id, type, amount, balance_after, description, transacted_at, created_at)
KEY (transaction_no)
VALUES (3, 'TXN20260301000001', 1, 'REPAYMENT', 893045.00, 28435984.00, '제2회차 상환', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Demo status histories
MERGE INTO status_histories (id, entity_type, entity_id, from_status, to_status, changed_by, reason, changed_at)
KEY (id)
VALUES (1, 'LOAN_APPLICATION', 1, NULL, 'DRAFT', 'SYSTEM', '대출 신청서 생성', CURRENT_TIMESTAMP);

MERGE INTO status_histories (id, entity_type, entity_id, from_status, to_status, changed_by, reason, changed_at)
KEY (id)
VALUES (2, 'LOAN_APPLICATION', 1, 'DRAFT', 'APPLIED', 'SYSTEM', '대출 신청서 제출', CURRENT_TIMESTAMP);

MERGE INTO status_histories (id, entity_type, entity_id, from_status, to_status, changed_by, reason, changed_at)
KEY (id)
VALUES (3, 'LOAN_APPLICATION', 1, 'APPLIED', 'REVIEWING', 'SYSTEM', '심사 시작', CURRENT_TIMESTAMP);

MERGE INTO status_histories (id, entity_type, entity_id, from_status, to_status, changed_by, reason, changed_at)
KEY (id)
VALUES (4, 'LOAN_APPLICATION', 1, 'REVIEWING', 'APPROVED', 'SYSTEM', '심사 승인', CURRENT_TIMESTAMP);

-- Reset identity sequences to avoid PK collision on new inserts
ALTER TABLE customers ALTER COLUMN id RESTART WITH 100;
ALTER TABLE loan_applications ALTER COLUMN id RESTART WITH 100;
ALTER TABLE credit_assessments ALTER COLUMN id RESTART WITH 100;
ALTER TABLE loan_contracts ALTER COLUMN id RESTART WITH 100;
ALTER TABLE repayment_schedules ALTER COLUMN id RESTART WITH 100;
ALTER TABLE loan_transactions ALTER COLUMN id RESTART WITH 100;
ALTER TABLE status_histories ALTER COLUMN id RESTART WITH 100;
