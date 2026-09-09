import { describe, it, expect } from "vitest";
import { frilenserModelB } from "./frilenserModelB";

describe("calculateFrilenserModelB", () => {
  const baseParams = {
    nonTaxableMonthly: 34221,
    contributionBaseMinMonthly: 51297,
    contributionBaseMaxMonthly: 732820,
    pioRateSelfEmployed: 0.24,
    healthRateSelfEmployed: 0.103,
    unemploymentRate: 0.0075,
    incomeTaxRate: 0.1, // Model B uses 10%
    model1StdDeductionQuarterly: 110647, // not used in Model B
    model2FixedDeductionQuarterly: 66733, // Model B fixed deduction
    model2PercentageDeduction: 0.34, // Model B 34% deduction
  };

  it("should return zero tax when income is below the standardized deduction", () => {
    const result = frilenserModelB({
      grossRevenue: 80_000,
      periodType: "quarter",
      isUnder40: false,
      primaryHealthInsuredElsewhere: false,
      alreadyEmployed: false,
      params: baseParams,
    });

    expect(result.taxableBase).toBe(0);
    expect(result.incomeTax).toBe(0);
    expect(result.pension).toBeCloseTo(36933.8, 0);
    expect(result.health).toBeCloseTo(7002.9, 0);
    expect(result.totalTax).toBeCloseTo(43936.7, 0);
  });

  it("should calculate correctly for normal income", () => {
    const result = frilenserModelB({
      grossRevenue: 300_000,
      periodType: "quarter",
      isUnder40: false,
      primaryHealthInsuredElsewhere: false,
      alreadyEmployed: false,
      params: baseParams,
    });

    // 300_000 - 110_647 = 189_353
    expect(result.taxableBase).toBe(131267);
    expect(result.incomeTax).toBeCloseTo(13126.7, 0);
    expect(result.pension).toBeCloseTo(36933.8, 0);
    expect(result.health).toBeCloseTo(13520.5, 0);
    expect(result.totalTax).toBeCloseTo(63581.0, 0);
  });

  it("should calculate correctly for 900_000 income", () => {
    const result = frilenserModelB({
      grossRevenue: 900_000,
      periodType: "quarter",
      isUnder40: true,
      primaryHealthInsuredElsewhere: false,
      alreadyEmployed: false,
      params: baseParams,
    });

    // 300_000 - 110_647 = 189_353
    expect(result.taxableBase).toBe(527267);
    expect(result.incomeTax).toBeCloseTo(52726.7, 0);
    expect(result.pension).toBeCloseTo(126544.1, 0);
    expect(result.health).toBeCloseTo(54308.5, 0);
    expect(result.totalTax).toBeCloseTo(233579.3, 0);
  });

  it("should waive health contribution when already insured", () => {
    const result = frilenserModelB({
      grossRevenue: 300_000,
      periodType: "quarter",
      isUnder40: false,
      primaryHealthInsuredElsewhere: true,
      alreadyEmployed: false,
      params: baseParams,
    });

    expect(result.taxableBase).toBe(131267);
    expect(result.incomeTax).toBeCloseTo(13126.7, 0);
    expect(result.pension).toBeCloseTo(36933.8, 0);
    expect(result.health).toBe(0);
    expect(result.totalTax).toBeCloseTo(50060.5, 0);
  });
});
