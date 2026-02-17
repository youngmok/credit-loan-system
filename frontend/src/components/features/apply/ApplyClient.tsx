"use client";

import React from "react";
import { Customer } from "@/types/loan";
import StepIndicator from "@/components/ui/StepIndicator";
import ErrorBanner from "@/components/ui/ErrorBanner";
import CustomerInfoStep from "./CustomerInfoStep";
import LoanTermsStep from "./LoanTermsStep";
import SimulationStep from "./SimulationStep";
import ReviewStep from "./ReviewStep";
import StepNavigation from "./StepNavigation";
import { useLoanApply, steps } from "@/hooks/useLoanApply";

interface ApplyClientProps {
  initialCustomers: Customer[];
}

export default function ApplyClient({ initialCustomers }: ApplyClientProps) {
  const {
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
  } = useLoanApply(initialCustomers);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          대출 신청
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          아래 단계를 따라 대출을 신청하세요.
        </p>
      </div>

      <div className="mb-12">
        <StepIndicator steps={steps} currentStep={currentStep} />
      </div>

      {error && (
        <div style={{ marginBottom: "24px" }}>
          <ErrorBanner message={error} />
        </div>
      )}

      <div className="space-y-10">
        {currentStep === 0 && (
          <CustomerInfoStep
            isNewCustomer={isNewCustomer}
            existingCustomers={existingCustomers}
            selectedCustomerId={selectedCustomerId}
            selectedCustomer={selectedCustomer}
            customerForm={customerForm}
            onSelectNew={selectNewCustomer}
            onSelectExisting={selectExistingCustomer}
            onSelectCustomerId={setSelectedCustomerId}
            onCustomerChange={handleCustomerChange}
          />
        )}
        {currentStep === 1 && (
          <LoanTermsStep loanForm={loanForm} onLoanChange={handleLoanChange} />
        )}
        {currentStep === 2 && <SimulationStep loanForm={loanForm} />}
        {currentStep === 3 && (
          <ReviewStep
            isNewCustomer={isNewCustomer}
            customerForm={customerForm}
            selectedCustomer={selectedCustomer}
            loanForm={loanForm}
          />
        )}

        <StepNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          submitting={submitting}
          onPrev={prevStep}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
