import { describe, it, expect } from "vitest";
import { calculateKnjigas } from "./knjigas";

describe("calculateKnjigas (no salary)", () => {
  const baseParams = {
    nonTaxableMonthly: 34221,
    contributionBaseMinMonthly: 51297,
    contributionBaseMaxMonthly: 732820,
    pioRateSelfEmployed: 0.24,
    healthRateSelfEmployed: 0.103,
    unemploymentRate: 0.0075,
    incomeTaxRate: 0.1,
  };

  const MIN_QUARTERLY = 51297 * 3; // 153_891
  const MAX_QUARTERLY = 732820 * 3; // 2_198_460

  it("should calculate correctly with normal profit", () => {
    const result = calculateKnjigas({
      revenue: 500_000,
      businessExpenses: 120_000,
      personalSalaryGross: null,
      isUnder40: false,
      primaryHealthInsuredElsewhere: false,
      params: baseParams,
    });

    // Profit = 380_000
    expect(result.taxableBase).toBe(380_000);
    expect(result.incomeTax).toBeCloseTo(38_000, 0);
    expect(result.pension).toBeCloseTo(91_200, 0); // 380_000 * 0.24
    expect(result.health).toBeCloseTo(39_140, 0); // 380_000 * 0.103
    expect(result.unemployment).toBeCloseTo(2_850, 0); // 380_000 * 0.0075
    expect(result.totalTax).toBeCloseTo(171_190, 0);
  });

  it("should return zero when expenses are higher than revenue", () => {
    const result = calculateKnjigas({
      revenue: 100_000,
      businessExpenses: 150_000,
      personalSalaryGross: null,
      isUnder40: false,
      primaryHealthInsuredElsewhere: false,
      params: baseParams,
    });

    expect(result.taxableBase).toBe(0);
    expect(result.incomeTax).toBe(0);
    expect(result.pension).toBeCloseTo(MIN_QUARTERLY * 0.24, 0); // still applies minimum base
    expect(result.totalTax).toBeGreaterThan(0); // because of minimum contributions
  });

  it("should apply minimum contribution base", () => {
    const result = calculateKnjigas({
      revenue: 80_000,
      businessExpenses: 20_000, // profit = 60_000
      personalSalaryGross: null,
      isUnder40: false,
      primaryHealthInsuredElsewhere: false,
      params: baseParams,
    });

    expect(result.pension).toBeCloseTo(MIN_QUARTERLY * 0.24, 0);
    expect(result.health).toBeCloseTo(MIN_QUARTERLY * 0.103, 0);
    expect(result.unemployment).toBeCloseTo(MIN_QUARTERLY * 0.0075, 0);
  });

  it("should waive health contribution when already insured", () => {
    const result = calculateKnjigas({
      revenue: 500_000,
      businessExpenses: 120_000,
      personalSalaryGross: null,
      isUnder40: false,
      primaryHealthInsuredElsewhere: true,
      params: baseParams,
    });

    expect(result.health).toBe(0);
    expect(result.totalTax).toBeCloseTo(38_000 + 91_200 + 2_850, 0);
  });

  it("should respect maximum contribution base", () => {
    const result = calculateKnjigas({
      revenue: 5_000_000,
      businessExpenses: 200_000,
      personalSalaryGross: null,
      isUnder40: false,
      primaryHealthInsuredElsewhere: false,
      params: baseParams,
    });

    expect(result.pension).toBeCloseTo(MAX_QUARTERLY * 0.24, 0);
    expect(result.health).toBeCloseTo(MAX_QUARTERLY * 0.103, 0);
  });

  it("should calculate correctly with personal salary", () => {
    const result = calculateKnjigas({
      revenue: 800_000,
      businessExpenses: 150_000,
      personalSalaryGross: 300_000, // quarterly salary
      isUnder40: false,
      primaryHealthInsuredElsewhere: false,
      params: baseParams,
    });

    expect(result.incomeTax).toBeCloseTo(35_000 + 19_733.7, 0);
    expect(result.pension).toBeCloseTo(72_000, 0);
    expect(result.health).toBeCloseTo(30_900, 0);
    expect(result.unemployment).toBeCloseTo(2_250, 0);
    expect(result.totalTax).toBeCloseTo(
      35_000 + 19_733.7 + 72_000 + 30_900 + 2_250,
      0,
    );
  });

  it("should waive health when already insured + has salary", () => {
    const result = calculateKnjigas({
      revenue: 800_000,
      businessExpenses: 150_000,
      personalSalaryGross: 300_000,
      isUnder40: false,
      primaryHealthInsuredElsewhere: true,
      params: baseParams,
    });

    expect(result.health).toBe(0);
    // total = profit tax + salary income tax + pension + unemployment
    expect(result.totalTax).toBeCloseTo(35_000 + 19_733.7 + 72_000 + 2_250, 0);
  });

  it("should apply minimum base on low personal salary", () => {
    const result = calculateKnjigas({
      revenue: 400_000,
      businessExpenses: 50_000,
      personalSalaryGross: 100_000, // below quarterly minimum base
      isUnder40: false,
      primaryHealthInsuredElsewhere: false,
      params: baseParams,
    });

    const MIN_QUARTERLY = 51_297 * 3; // 153_891

    expect(result.pension).toBeCloseTo(MIN_QUARTERLY * 0.24, 0);
    expect(result.health).toBeCloseTo(MIN_QUARTERLY * 0.103, 0);
    expect(result.unemployment).toBeCloseTo(MIN_QUARTERLY * 0.0075, 0);
  });
});
