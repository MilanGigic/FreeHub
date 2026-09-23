export type Regime =
  | "freelancer"
  | "pausal"
  | "knjigas"
  | "employee"
  | "hybrid"
  | "d.o.o.";

export type TaxPeriod = "month" | "quarter" | "year";

/**
 * Default period used for tax calculation / main dashboard view
 * per regime.
 */
export function getDefaultPeriodForRegime(regime: Regime): TaxPeriod {
  switch (regime) {
    case "freelancer":
      // PP OPO-K is quarterly
      return "quarter";

    case "pausal":
      // Fixed monthly obligation from rešenje
      return "month";

    case "knjigas":
      // Monthly advances, annual true-up — month is the natural pay cycle
      return "month";

    case "employee":
      // Salary is monthly
      return "month";

    case "hybrid":
      // Side activity often freelancer (quarter) + salary (month).
      // Default to quarter if you prioritize side-tax planning;
      // use month if you prioritize cash-flow with salary.
      return "quarter";

    case "d.o.o.":
      // Corporate: monthly advances, annual CIT
      return "month";

    default:
      return "month";
  }
}

/**
 * Periods that make sense to show in the UI for each regime.
 */
export function getAvailablePeriodsForRegime(regime: Regime): TaxPeriod[] {
  switch (regime) {
    case "freelancer":
      return ["quarter", "year"];

    case "pausal":
      return ["month", "quarter", "year"];

    case "knjigas":
      return ["month", "quarter", "year"];

    case "employee":
      return ["month", "year"];

    case "hybrid":
      return ["month", "quarter", "year"];

    case "d.o.o.":
      return ["month", "year"];

    default:
      return ["month", "year"];
  }
}

/**
 * How many months a period covers (for scaling monthly amounts).
 */
export function monthsInPeriod(period: TaxPeriod): number {
  switch (period) {
    case "month":
      return 1;
    case "quarter":
      return 3;
    case "year":
      return 12;
  }
}
