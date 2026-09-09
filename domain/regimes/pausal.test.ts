import { describe, expect, it } from "vitest";
import { calculatePausal } from "./pausal";

describe("calculatePausal", () => {
  it("should multiply monthly amount by 3 for a quarter", () => {
    const result = calculatePausal({
      officialMonthlyAmount: 42_000,
      monthsInPeriod: 3,
    });
    expect(result.totalTax).toBe(126_000);
  });
});
