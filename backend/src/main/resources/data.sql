-- Demo customers
INSERT INTO customers (customer_no, name, email, phone, annual_income, employment_type, company, birth_date, created_at, updated_at)
VALUES ('CUS202601010001', '김철수', 'kim.cs@example.com', '010-1234-5678', 55000000.00, 'REGULAR', '삼성전자', '1985-03-15', NOW(), NOW())
ON CONFLICT (customer_no) DO NOTHING;

INSERT INTO customers (customer_no, name, email, phone, annual_income, employment_type, company, birth_date, created_at, updated_at)
VALUES ('CUS202601010002', '이영희', 'lee.yh@example.com', '010-2345-6789', 38000000.00, 'CONTRACT', 'LG화학', '1990-07-22', NOW(), NOW())
ON CONFLICT (customer_no) DO NOTHING;

INSERT INTO customers (customer_no, name, email, phone, annual_income, employment_type, company, birth_date, created_at, updated_at)
VALUES ('CUS202601010003', '박민수', 'park.ms@example.com', '010-3456-7890', 72000000.00, 'SELF_EMPLOYED', '민수네 가게', '1978-11-08', NOW(), NOW())
ON CONFLICT (customer_no) DO NOTHING;

-- Demo loan applications
INSERT INTO loan_applications (application_no, customer_id, requested_amount, requested_term_months, repayment_method, existing_loan_amount, purpose, status, applied_at, created_at, updated_at)
VALUES ('APP202601010001', 1, 30000000.00, 36, 'EQUAL_PRINCIPAL_AND_INTEREST', 5000000.00, '주택자금', 'APPROVED', NOW(), NOW(), NOW())
ON CONFLICT (application_no) DO NOTHING;

INSERT INTO loan_applications (application_no, customer_id, requested_amount, requested_term_months, repayment_method, existing_loan_amount, purpose, status, applied_at, created_at, updated_at)
VALUES ('APP202601010002', 2, 15000000.00, 24, 'EQUAL_PRINCIPAL', 0.00, '생활자금', 'APPLIED', NOW(), NOW(), NOW())
ON CONFLICT (application_no) DO NOTHING;

INSERT INTO loan_applications (application_no, customer_id, requested_amount, requested_term_months, repayment_method, existing_loan_amount, purpose, status, applied_at, created_at, updated_at)
VALUES ('APP202601010003', 3, 50000000.00, 48, 'BULLET', 10000000.00, '사업자금', 'DRAFT', NULL, NOW(), NOW())
ON CONFLICT (application_no) DO NOTHING;

-- Demo credit assessment for first application
INSERT INTO credit_assessments (application_id, credit_score, credit_grade, dsr_ratio, approved_rate, approved_amount, approved_term_months, result, rejection_reason, assessed_at, created_at)
VALUES (1, 875, 'GRADE_2', 22.50, 4.50, 30000000.00, 36, 'APPROVED', NULL, NOW(), NOW())
ON CONFLICT (application_id) DO NOTHING;

-- Demo loan contract
INSERT INTO loan_contracts (contract_no, application_id, customer_id, principal_amount, interest_rate, term_months, repayment_method, monthly_payment, outstanding_balance, total_interest_paid, status, start_date, end_date, executed_at, created_at, updated_at)
VALUES ('CNT202601010001', 1, 1, 30000000.00, 4.50, 36, 'EQUAL_PRINCIPAL_AND_INTEREST', 893044.00, 28500000.00, 337500.00, 'ACTIVE', '2026-01-01', '2029-01-01', NOW(), NOW(), NOW())
ON CONFLICT (contract_no) DO NOTHING;

-- Demo repayment schedules (first 3 installments)
INSERT INTO repayment_schedules (contract_id, installment_no, due_date, principal_amount, interest_amount, total_amount, outstanding_balance_after, status, paid_date, paid_amount, created_at, updated_at)
SELECT 1, 1, '2026-02-01', 780544.00, 112500.00, 893044.00, 29219456.00, 'PAID', '2026-02-01', 893044.00, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM loan_contracts WHERE contract_no = 'CNT202601010001')
AND NOT EXISTS (SELECT 1 FROM repayment_schedules WHERE contract_id = 1 AND installment_no = 1);

INSERT INTO repayment_schedules (contract_id, installment_no, due_date, principal_amount, interest_amount, total_amount, outstanding_balance_after, status, paid_date, paid_amount, created_at, updated_at)
SELECT 1, 2, '2026-03-01', 783472.00, 109573.00, 893045.00, 28435984.00, 'PAID', '2026-03-01', 893045.00, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM loan_contracts WHERE contract_no = 'CNT202601010001')
AND NOT EXISTS (SELECT 1 FROM repayment_schedules WHERE contract_id = 1 AND installment_no = 2);

INSERT INTO repayment_schedules (contract_id, installment_no, due_date, principal_amount, interest_amount, total_amount, outstanding_balance_after, status, paid_date, paid_amount, created_at, updated_at)
SELECT 1, 3, '2026-04-01', 786410.00, 106635.00, 893045.00, 27649574.00, 'SCHEDULED', NULL, NULL, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM loan_contracts WHERE contract_no = 'CNT202601010001')
AND NOT EXISTS (SELECT 1 FROM repayment_schedules WHERE contract_id = 1 AND installment_no = 3);

-- Demo loan transactions
INSERT INTO loan_transactions (transaction_no, contract_id, type, amount, balance_after, description, transacted_at, created_at)
SELECT 'TXN20260101000001', 1, 'DISBURSEMENT', 30000000.00, 30000000.00, '대출 실행: CNT202601010001', NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM loan_contracts WHERE contract_no = 'CNT202601010001')
AND NOT EXISTS (SELECT 1 FROM loan_transactions WHERE transaction_no = 'TXN20260101000001');

INSERT INTO loan_transactions (transaction_no, contract_id, type, amount, balance_after, description, transacted_at, created_at)
SELECT 'TXN20260201000001', 1, 'REPAYMENT', 893044.00, 29219456.00, '제1회차 상환', NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM loan_contracts WHERE contract_no = 'CNT202601010001')
AND NOT EXISTS (SELECT 1 FROM loan_transactions WHERE transaction_no = 'TXN20260201000001');

INSERT INTO loan_transactions (transaction_no, contract_id, type, amount, balance_after, description, transacted_at, created_at)
SELECT 'TXN20260301000001', 1, 'REPAYMENT', 893045.00, 28435984.00, '제2회차 상환', NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM loan_contracts WHERE contract_no = 'CNT202601010001')
AND NOT EXISTS (SELECT 1 FROM loan_transactions WHERE transaction_no = 'TXN20260301000001');

-- Demo status histories
INSERT INTO status_histories (entity_type, entity_id, from_status, to_status, changed_by, reason, changed_at)
SELECT 'LOAN_APPLICATION', 1, NULL, 'DRAFT', 'SYSTEM', '대출 신청서 생성', NOW()
WHERE NOT EXISTS (SELECT 1 FROM status_histories WHERE entity_type = 'LOAN_APPLICATION' AND entity_id = 1 AND to_status = 'DRAFT');

INSERT INTO status_histories (entity_type, entity_id, from_status, to_status, changed_by, reason, changed_at)
SELECT 'LOAN_APPLICATION', 1, 'DRAFT', 'APPLIED', 'SYSTEM', '대출 신청서 제출', NOW()
WHERE NOT EXISTS (SELECT 1 FROM status_histories WHERE entity_type = 'LOAN_APPLICATION' AND entity_id = 1 AND to_status = 'APPLIED');

INSERT INTO status_histories (entity_type, entity_id, from_status, to_status, changed_by, reason, changed_at)
SELECT 'LOAN_APPLICATION', 1, 'APPLIED', 'REVIEWING', 'SYSTEM', '심사 시작', NOW()
WHERE NOT EXISTS (SELECT 1 FROM status_histories WHERE entity_type = 'LOAN_APPLICATION' AND entity_id = 1 AND to_status = 'REVIEWING');

INSERT INTO status_histories (entity_type, entity_id, from_status, to_status, changed_by, reason, changed_at)
SELECT 'LOAN_APPLICATION', 1, 'REVIEWING', 'APPROVED', 'SYSTEM', '심사 승인', NOW()
WHERE NOT EXISTS (SELECT 1 FROM status_histories WHERE entity_type = 'LOAN_APPLICATION' AND entity_id = 1 AND to_status = 'APPROVED');
