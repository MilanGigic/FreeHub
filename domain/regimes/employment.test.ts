import { describe, it, expect } from "vitest";
import { calculateEmployment } from "./employment"; // adjust path

const baseParams = {
  nonTaxableMonthly: 34221,
  employeePioRate: 0.14,
  employeeHealthRate: 0.0515,
  employeeUnemploymentRate: 0.0075,
  employerPioRate: 0.1,
  employerHealthRate: 0.0515,
  incomeTaxRate: 0.1,
};

describe("calculateEmployment", () => {
  it("computes employee contributions correctly for a monthly salary", () => {
    const gross = 100000;
    const result = calculateEmployment({
      grossSalary: gross,
      periodType: "month",
      params: baseParams,
    });

    expect(result.pension).toBeCloseTo(gross * baseParams.employeePioRate);
    expect(result.health).toBeCloseTo(gross * baseParams.employeeHealthRate);
    expect(result.unemployment).toBeCloseTo(
      gross * baseParams.employeeUnemploymentRate,
    );
  });

  it("computes taxable base and income tax after non-taxable deduction", () => {
    const gross = 100000;
    const result = calculateEmployment({
      grossSalary: gross,
      periodType: "month",
      params: baseParams,
    });

    const expectedTaxableBase = gross - baseParams.nonTaxableMonthly;
    expect(result.taxableBase).toBeCloseTo(expectedTaxableBase);
    expect(result.incomeTax).toBeCloseTo(
      expectedTaxableBase * baseParams.incomeTaxRate,
    );
  });

  it("floors taxableBase at 0 when gross salary is below the non-taxable amount", () => {
    const result = calculateEmployment({
      grossSalary: 10000, // below 34221
      periodType: "month",
      params: baseParams,
    });

    expect(result.taxableBase).toBe(0);
    expect(result.incomeTax).toBe(0);
  });

  it("floors taxableBase at 0 when gross salary equals the non-taxable amount exactly", () => {
    const result = calculateEmployment({
      grossSalary: baseParams.nonTaxableMonthly,
      periodType: "month",
      params: baseParams,
    });

    expect(result.taxableBase).toBe(0);
    expect(result.incomeTax).toBe(0);
  });

  it("multiplies the non-taxable amount by 3 for quarterly periods", () => {
    const gross = 150000;
    const result = calculateEmployment({
      grossSalary: gross,
      periodType: "quarter",
      params: baseParams,
    });

    const expectedNonTaxable = baseParams.nonTaxableMonthly * 3;
    const expectedTaxableBase = Math.max(0, gross - expectedNonTaxable);
    expect(result.taxableBase).toBeCloseTo(expectedTaxableBase);
  });

  it("computes netSalary as gross minus employee contributions minus income tax", () => {
    const gross = 120000;
    const result = calculateEmployment({
      grossSalary: gross,
      periodType: "month",
      params: baseParams,
    });

    const employeeContributions =
      result.pension + result.health + result.unemployment;
    expect(result.netSalary).toBeCloseTo(
      gross - employeeContributions - result.incomeTax,
    );
  });

  it("computes totalEmployerCost as gross plus employer contributions", () => {
    const gross = 120000;
    const result = calculateEmployment({
      grossSalary: gross,
      periodType: "month",
      params: baseParams,
    });

    const employerContributions =
      gross * (baseParams.employerPioRate + baseParams.employerHealthRate);
    expect(result.totalEmployerCost).toBeCloseTo(gross + employerContributions);
  });

  it("computes totalTax as incomeTax plus total employee contributions", () => {
    const gross = 120000;
    const result = calculateEmployment({
      grossSalary: gross,
      periodType: "month",
      params: baseParams,
    });

    const employeeContributions =
      result.pension + result.health + result.unemployment;
    expect(result.totalTax).toBeCloseTo(
      result.incomeTax + employeeContributions,
    );
  });

  it("computes effectiveRate as totalTax / grossSalary", () => {
    const gross = 120000;
    const result = calculateEmployment({
      grossSalary: gross,
      periodType: "month",
      params: baseParams,
    });

    expect(result.effectiveRate).toBeCloseTo(result.totalTax / gross);
  });

  it("returns effectiveRate of 0 when grossSalary is 0 (avoids division by zero)", () => {
    const result = calculateEmployment({
      grossSalary: 0,
      periodType: "month",
      params: baseParams,
    });

    expect(result.effectiveRate).toBe(0);
    expect(result.netSalary).toBe(0);
  });

  it("always returns expensesDeducted 0 and an empty warnings array (current behavior)", () => {
    const result = calculateEmployment({
      grossSalary: 100000,
      periodType: "month",
      params: baseParams,
    });

    expect(result.expensesDeducted).toBe(0);
    expect(result.warnings).toEqual([]);
  });

  it("ignores isUnder40 since it is currently unused in the calculation", () => {
    const gross = 100000;
    const withFlag = calculateEmployment({
      grossSalary: gross,
      periodType: "month",
      isUnder40: true,
      params: baseParams,
    });
    const withoutFlag = calculateEmployment({
      grossSalary: gross,
      periodType: "month",
      isUnder40: false,
      params: baseParams,
    });

    expect(withFlag).toEqual(withoutFlag);
  });
});
