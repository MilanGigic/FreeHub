interface EmploymentInput {
  grossSalary: number; // monthly or quarterly
  periodType: "month" | "quarter";
  isUnder40?: boolean;
  params: {
    nonTaxableMonthly: number; // 34221
    employeePioRate: number; // 0.14
    employeeHealthRate: number; // 0.0515
    employeeUnemploymentRate: number; // 0.0075
    employerPioRate: number; // 0.10
    employerHealthRate: number; // 0.0515
    incomeTaxRate: number; // 0.10
  };
}

export function calculateEmployment(input: EmploymentInput) {
  const { grossSalary, params, periodType } = input;

  const months = periodType === "quarter" ? 3 : 1;
  const nonTaxable = params.nonTaxableMonthly * months;

  // 1. Employee contributions
  const employeePio = grossSalary * params.employeePioRate;
  const employeeHealth = grossSalary * params.employeeHealthRate;
  const employeeUnemployment = grossSalary * params.employeeUnemploymentRate;
  const totalEmployeeContributions =
    employeePio + employeeHealth + employeeUnemployment;

  // 2. Taxable base for income tax
  const taxableBase = Math.max(0, grossSalary - nonTaxable);
  const incomeTax = taxableBase * params.incomeTaxRate;

  // 3. Net salary
  const netSalary = grossSalary - totalEmployeeContributions - incomeTax;

  // 4. Employer cost (optional)
  const employerContributions =
    grossSalary * (params.employerPioRate + params.employerHealthRate);
  const totalEmployerCost = grossSalary + employerContributions;

  const totalTax = incomeTax + totalEmployeeContributions;

  return {
    incomeTax,
    pension: employeePio,
    health: employeeHealth,
    unemployment: employeeUnemployment,
    totalTax,
    netSalary,
    totalEmployerCost,
    taxableBase,
    expensesDeducted: 0,
    effectiveRate: grossSalary > 0 ? totalTax / grossSalary : 0,
    warnings: [],
  };
}
