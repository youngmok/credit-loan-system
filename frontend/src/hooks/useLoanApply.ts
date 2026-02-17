"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { customerApi, applicationApi } from "@/lib/api";
import { Customer, RepaymentMethod, EmploymentType } from "@/types/loan";

export const steps = [
  { label: "고객 정보" },
  { label: "대출 조건" },
  { label: "시뮬레이션" },
  { label: "확인 및 제출" },
];

export const termOptions = [6, 12, 24, 36, 48, 60];

export const employmentTypes: EmploymentType[] = [
  "REGULAR",
  "CONTRACT",
  "SELF_EMPLOYED",
  "FREELANCE",
  "UNEMPLOYED",
];

export const ASSUMED_RATE = 5.5;

export const simulationMethods: RepaymentMethod[] = [
  "EQUAL_PRINCIPAL_AND_INTEREST",
  "EQUAL_PRINCIPAL",
  "BULLET",
];

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  annualIncome: number;
  employmentType: EmploymentType;
  company: string;
}

export interface LoanFormData {
  requestedAmount: number;
  requestedTermMonths: number;
  repaymentMethod: RepaymentMethod;
  existingLoanAmount: number;
  purpose: string;
}

export function useLoanApply(initialCustomers?: Customer[]) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [existingCustomers, setExistingCustomers] = useState<Customer[]>(initialCustomers ?? []);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [isNewCustomer, setIsNewCustomer] = useState(true);
  const [customerForm, setCustomerForm] = useState<CustomerFormData>({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    annualIncome: 0,
    employmentType: "REGULAR",
    company: "",
  });

  const [loanForm, setLoanForm] = useState<LoanFormData>({
    requestedAmount: 10000000,
    requestedTermMonths: 12,
    repaymentMethod: "EQUAL_PRINCIPAL_AND_INTEREST",
    existingLoanAmount: 0,
    purpose: "",
  });

  useEffect(() => {
    if (!initialCustomers) {
      customerApi.getAll().then(setExistingCustomers).catch(() => {});
    }
  }, []);

  function handleCustomerChange(field: string, value: string | number) {
    setCustomerForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleLoanChange(field: string, value: string | number) {
    setLoanForm((prev) => ({ ...prev, [field]: value }));
  }

  function selectNewCustomer() {
    setIsNewCustomer(true);
    setSelectedCustomerId(null);
  }

  function selectExistingCustomer() {
    setIsNewCustomer(false);
  }

  function nextStep() {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setError(null);
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  }

  function validateStep1(): boolean {
    if (!isNewCustomer) {
      if (!selectedCustomerId) {
        setError("고객을 선택해주세요.");
        return false;
      }
      return true;
    }
    if (!customerForm.name.trim()) {
      setError("이름을 입력해주세요.");
      return false;
    }
    if (!customerForm.email.trim()) {
      setError("이메일을 입력해주세요.");
      return false;
    }
    if (!customerForm.phone.trim()) {
      setError("연락처를 입력해주세요.");
      return false;
    }
    if (customerForm.annualIncome <= 0) {
      setError("연소득을 입력해주세요.");
      return false;
    }
    return true;
  }

  function validateStep2(): boolean {
    if (loanForm.requestedAmount < 1000000) {
      setError("대출 금액은 최소 100만원 이상이어야 합니다.");
      return false;
    }
    if (!loanForm.purpose.trim()) {
      setError("대출 용도를 입력해주세요.");
      return false;
    }
    return true;
  }

  function handleNext() {
    setError(null);
    if (currentStep === 0 && !validateStep1()) return;
    if (currentStep === 1 && !validateStep2()) return;
    nextStep();
  }

  async function handleSubmit() {
    try {
      setSubmitting(true);
      setError(null);

      let customerId = selectedCustomerId;

      if (isNewCustomer) {
        const customer = await customerApi.create({
          ...customerForm,
          annualIncome: Number(customerForm.annualIncome),
        });
        customerId = customer.id;
      }

      if (!customerId) {
        setError("고객 정보가 올바르지 않습니다.");
        return;
      }

      const application = await applicationApi.create({
        customerId,
        requestedAmount: loanForm.requestedAmount,
        requestedTermMonths: loanForm.requestedTermMonths,
        repaymentMethod: loanForm.repaymentMethod,
        existingLoanAmount: loanForm.existingLoanAmount,
        purpose: loanForm.purpose,
      });

      await applicationApi.submit(application.id);

      router.push(`/loans/applications/${application.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "신청 처리 중 오류가 발생했습니다."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const selectedCustomer = existingCustomers.find(
    (c) => c.id === selectedCustomerId
  );

  return {
    currentStep,
    submitting,
    error,
    existingCustomers,
    selectedCustomerId,
    setSelectedCustomerId,
    isNewCustomer,
    selectNewCustomer,
    selectExistingCustomer,
    customerForm,
    loanForm,
    selectedCustomer,
    handleCustomerChange,
    handleLoanChange,
    prevStep,
    handleNext,
    handleSubmit,
  };
}
