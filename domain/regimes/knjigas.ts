import { clampContributionBase } from "../shared/contributions";
import { RegimeResult } from "../types";

interface KnjigasInput {
  // Period data
  revenue: number; // total income in the period
  businessExpenses: number; // deductible expenses
  personalSalaryGross: number | null; // optional

  // Profile
  isUnder40: boolean;
  primaryHealthInsuredElsewhere: boolean;

  // Parameters
  params: {
    nonTaxableMonthly: number;
    pioRateSelfEmployed: number; // 0.24
    healthRateSelfEmployed: number; // 0.103
    unemploymentRate: number; // 0.0075
    incomeTaxRate: number; // 0.10
    contributionBaseMinMonthly: number;
    contributionBaseMaxMonthly: number;
  };
}

export function calculateKnjigas(input: KnjigasInput): RegimeResult {
  const {
    revenue,
    businessExpenses,
    primaryHealthInsuredElsewhere,
    personalSalaryGross,
    params,
  } = input;
  const salary = personalSalaryGross ?? 0;

  const remainingProfit = Math.max(0, revenue - businessExpenses - salary);

  const profitTax = remainingProfit * params.incomeTaxRate;

  let salaryIncomeTax = 0;
  let pension = 0;
  let health = 0;
  let unemployment = 0;

  const minBase = params.contributionBaseMinMonthly * 3;
  const maxBase = params.contributionBaseMaxMonthly * 3;

  if (salary > 0) {
    // ===== WITH personal salary =====
    // Non-taxable amount (monthly -> adjust if period is quarterly)
    const nonTaxable = params.nonTaxableMonthly * 3;

    const taxableSalary = Math.max(0, salary - nonTaxable);
    salaryIncomeTax = taxableSalary * 0.1;

    // Contributions on salary (use self-employed rates or employee rates?
    // Most knjigaš use the self-employed rates when they are the only "employee")
    const minBase = params.contributionBaseMinMonthly * 3;
    const maxBase = params.contributionBaseMaxMonthly * 3;
    const contributionBase = clampContributionBase(salary, minBase, maxBase);

    pension = contributionBase * params.pioRateSelfEmployed;
    health = primaryHealthInsuredElsewhere
      ? 0
      : contributionBase * params.healthRateSelfEmployed;
    unemployment = contributionBase * params.unemploymentRate;
  } else {
    // ===== NO personal salary (original logic) =====
    const contributionBase = clampContributionBase(
      remainingProfit,
      minBase,
      maxBase,
    );

    pension = contributionBase * params.pioRateSelfEmployed;
    health = primaryHealthInsuredElsewhere
      ? 0
      : contributionBase * params.healthRateSelfEmployed;
    unemployment = contributionBase * params.unemploymentRate;
  }

  const incomeTax = salaryIncomeTax + profitTax;
  const totalTax = incomeTax + pension + health + unemployment;

  return {
    incomeTax,
    pension,
    health,
    unemployment,
    totalTax,
    taxableBase:
      remainingProfit +
      (salary > 0 ? Math.max(0, salary - params.nonTaxableMonthly * 3) : 0),
    expensesDeducted: businessExpenses,
    effectiveRate: revenue > 0 ? totalTax / revenue : 0,
    warnings: [],
  };
}
