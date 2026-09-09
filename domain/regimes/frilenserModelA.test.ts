import { describe, it, expect } from "vitest";
import { frilenserModelA } from "./frilenserModelA";

describe("calculateFrilenserModelA", () => {
  const baseParams = {
    nonTaxableMonthly: 34221,
    contributionBaseMinMonthly: 51297,
    contributionBaseMaxMonthly: 732820,
    pioRateSelfEmployed: 0.24,
    healthRateSelfEmployed: 0.103,
    unemploymentRate: 0.0075,
    incomeTaxRate: 0.2,
    model1StdDeductionQuarterly: 110647,
    model2FixedDeductionQuarterly: 66733,
    model2PercentageDeduction: 0.34,
  };

  it("should return zero tax when income is below the standardized deduction", () => {
    const result = frilenserModelA({
      grossRevenue: 80_000, // less than 110,647
      periodType: "quarter",
      isUnder40: false,
      primaryHealthInsuredElsewhere: false,
      alreadyEmployed: false,
      params: baseParams,
    });

    expect(result.taxableBase).toBe(0);
    expect(result.incomeTax).toBe(0);
    expect(result.pension).toBe(0);
    expect(result.health).toBeCloseTo(7002.9, 0);
    expect(result.totalTax).toBeCloseTo(7002.9, 0); // or only minimum health if you implement it
  });

  it("should calculate correctly for normal income", () => {
    const result = frilenserModelA({
      grossRevenue: 300_000,
      periodType: "quarter",
      isUnder40: false,
      primaryHealthInsuredElsewhere: false,
      alreadyEmployed: false,
      params: baseParams,
    });

    // 300_000 - 110_647 = 189_353
    expect(result.taxableBase).toBe(189353);
    expect(result.incomeTax).toBeCloseTo(37870.6, 0); // 189353 * 0.20
    expect(result.pension).toBeCloseTo(45444.72, 0); // 189353 * 0.24
    expect(result.health).toBeCloseTo(19503.36, 0); // 189353 * 0.103
    expect(result.totalTax).toBeCloseTo(102818.68, 0);
  });

  it("should waive health contribution when already insured", () => {
    const result = frilenserModelA({
      grossRevenue: 300_000,
      periodType: "quarter",
      isUnder40: false,
      primaryHealthInsuredElsewhere: true, // ← important
      alreadyEmployed: false,
      params: baseParams,
    });

    expect(result.taxableBase).toBe(189353);
    expect(result.incomeTax).toBeCloseTo(37870.6, 0);
    expect(result.pension).toBeCloseTo(45444.7, 0);
    expect(result.health).toBe(0);
    expect(result.totalTax).toBeCloseTo(83315.3, 0);
  });
});
