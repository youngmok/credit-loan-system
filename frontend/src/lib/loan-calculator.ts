import { RepaymentMethod } from "@/types/loan";

export interface AmortizationEntry {
  installmentNumber: number;
  principalAmount: number;
  interestAmount: number;
  totalAmount: number;
  remainingBalance: number;
}

/**
 * Calculate monthly payment
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termMonths: number,
  method: RepaymentMethod
): number {
  const monthlyRate = annualRate / 100 / 12;

  switch (method) {
    case "EQUAL_PRINCIPAL_AND_INTEREST": {
      if (monthlyRate === 0) return principal / termMonths;
      const factor = Math.pow(1 + monthlyRate, termMonths);
      return Math.round((principal * monthlyRate * factor) / (factor - 1));
    }
    case "EQUAL_PRINCIPAL": {
      // First month payment (highest)
      const principalPart = Math.round(principal / termMonths);
      const interestPart = Math.round(principal * monthlyRate);
      return principalPart + interestPart;
    }
    case "BULLET": {
      // Monthly interest only
      return Math.round(principal * monthlyRate);
    }
    default:
      return 0;
  }
}

/**
 * Calculate total interest over the loan term
 */
export function calculateTotalInterest(
  principal: number,
  annualRate: number,
  termMonths: number,
  method: RepaymentMethod
): number {
  const schedule = generateAmortizationSchedule(
    principal,
    annualRate,
    termMonths,
    method
  );
  return schedule.reduce((sum, entry) => sum + entry.interestAmount, 0);
}

/**
 * Generate full amortization schedule
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  termMonths: number,
  method: RepaymentMethod
): AmortizationEntry[] {
  const monthlyRate = annualRate / 100 / 12;
  const schedule: AmortizationEntry[] = [];
  let remainingBalance = principal;

  switch (method) {
    case "EQUAL_PRINCIPAL_AND_INTEREST": {
      if (monthlyRate === 0) {
        const monthly = Math.round(principal / termMonths);
        for (let i = 1; i <= termMonths; i++) {
          const principalAmount =
            i === termMonths ? remainingBalance : monthly;
          remainingBalance -= principalAmount;
          schedule.push({
            installmentNumber: i,
            principalAmount,
            interestAmount: 0,
            totalAmount: principalAmount,
            remainingBalance: Math.max(0, remainingBalance),
          });
        }
      } else {
        const factor = Math.pow(1 + monthlyRate, termMonths);
        const monthlyPayment = Math.round(
          (principal * monthlyRate * factor) / (factor - 1)
        );

        for (let i = 1; i <= termMonths; i++) {
          const interestAmount = Math.round(remainingBalance * monthlyRate);
          let principalAmount = monthlyPayment - interestAmount;

          if (i === termMonths) {
            principalAmount = remainingBalance;
          }

          remainingBalance -= principalAmount;
          const totalAmount = principalAmount + interestAmount;

          schedule.push({
            installmentNumber: i,
            principalAmount,
            interestAmount,
            totalAmount,
            remainingBalance: Math.max(0, Math.round(remainingBalance)),
          });
        }
      }
      break;
    }

    case "EQUAL_PRINCIPAL": {
      const principalPerMonth = Math.round(principal / termMonths);

      for (let i = 1; i <= termMonths; i++) {
        const interestAmount = Math.round(remainingBalance * monthlyRate);
        const principalAmount =
          i === termMonths ? remainingBalance : principalPerMonth;

        remainingBalance -= principalAmount;
        const totalAmount = principalAmount + interestAmount;

        schedule.push({
          installmentNumber: i,
          principalAmount,
          interestAmount,
          totalAmount,
          remainingBalance: Math.max(0, Math.round(remainingBalance)),
        });
      }
      break;
    }

    case "BULLET": {
      for (let i = 1; i <= termMonths; i++) {
        const interestAmount = Math.round(remainingBalance * monthlyRate);
        const isLast = i === termMonths;
        const principalAmount = isLast ? principal : 0;

        if (isLast) {
          remainingBalance = 0;
        }

        schedule.push({
          installmentNumber: i,
          principalAmount,
          interestAmount,
          totalAmount: principalAmount + interestAmount,
          remainingBalance: Math.round(remainingBalance),
        });
      }
      break;
    }
  }

  return schedule;
}

/**
 * Calculate total repayment (principal + total interest)
 */
export function calculateTotalRepayment(
  principal: number,
  annualRate: number,
  termMonths: number,
  method: RepaymentMethod
): number {
  return (
    principal +
    calculateTotalInterest(principal, annualRate, termMonths, method)
  );
}
