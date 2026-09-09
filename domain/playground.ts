import { frilenserModelB } from "./regimes/frilenserModelB";

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

const result = frilenserModelB({
  grossRevenue: 250_000, // ← change this number
  periodType: "quarter",
  isUnder40: false,
  primaryHealthInsuredElsewhere: false,
  alreadyEmployed: false,
  params: baseParams,
});

console.log("Taxable base:", result.taxableBase);
console.log("Income tax:", result.incomeTax);
console.log("PIO:", result.pension);
console.log("Health:", result.health);
console.log("Total tax:", result.totalTax);
console.log("Effective rate:", (result.effectiveRate * 100).toFixed(2) + "%");
