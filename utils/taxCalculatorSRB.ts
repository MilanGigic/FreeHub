// ─── Constants ────────────────────────────────────────────────────────────────

// MODEL_1 — quarterly thresholds
const M1_THRESHOLD_Q = 110647;
const M1_INCOME_TAX_RATE = 0.2;
const M1_PIO_RATE = 0.24;
const M1_HEALTH_RATE = 0.103;
const M1_MIN_HEALTH_Q = 4800;

// MODEL_2 — quarterly thresholds
const M2_THRESHOLD_Q = 66733;
const M2_EXPENSE_RATE = 0.34;
const M2_INCOME_TAX_RATE = 0.1;
const M2_PIO_RATE = 0.24;
const M2_MIN_PIO_Q = 36934; // Verify against 2026 Poreska uprava tables
const M2_HEALTH_RATE = 0.103;
const M2_MIN_HEALTH_Q = 4800;

// PAUSAL
const PAUSAL_ANNUAL_CAP = 6_000_000;
const PAUSAL_ANNUAL_FLOOR = 1_000_000;

// KNJIGAS
const KNJIGAS_MIN_MONTHLY_SALARY = 52000;
const KNJIGAS_MIN_SALARY_TAX = 18000; // Estimated — recalculate if salary changes
const KNJIGAS_PROFIT_TAX_RATE = 0.1;

// SHARED
const UNDER_40_RELIEF = 0.5; // 50% income tax relief

// ─── Input types (discriminated union per model) ───────────────────────────────

type SharedInputs = {
  annualGross: number;
  isAlreadyEmployed: boolean;
  isUnder40: boolean;
};

type Model1Inputs = SharedInputs & { model: "MODEL_1" };

type Model2Inputs = SharedInputs & { model: "MODEL_2" };

type PausalInputs = SharedInputs & {
  model: "PAUSAL";
  pausalMonthlyBill: number; // Fixed bill from tax office
};

type KnjigasInputs = SharedInputs & {
  model: "KNJIGAS";
  monthlyExpenses: number;
  monthlySalary?: number; // Defaults to minimum if not provided
};

export type SRBTaxInputs =
  | Model1Inputs
  | Model2Inputs
  | PausalInputs
  | KnjigasInputs;

// ─── Output type ──────────────────────────────────────────────────────────────

export interface SRBTaxOutputs {
  totalAnnualTax: number;
  quarterlyEstimate: number;
  monthlyReserve: number;
  effectiveTaxRate: number;
  itemized: {
    incomeTax: number;
    pio: number;
    health: number;
    expensesDeducted: number;
  };
  warnings: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function under40Relief(incomeTax: number, isUnder40: boolean): number {
  return isUnder40 ? incomeTax * (1 - UNDER_40_RELIEF) : incomeTax;
}

function scaleToAnnual(quarterly: {
  incomeTax: number;
  pio: number;
  health: number;
  expensesDeducted: number;
}) {
  return {
    incomeTax: quarterly.incomeTax * 4,
    pio: quarterly.pio * 4,
    health: quarterly.health * 4,
    expensesDeducted: quarterly.expensesDeducted * 4,
  };
}

// ─── Model calculators (pure, quarterly in → quarterly out) ───────────────────

function calcModel1(
  quarterlyGross: number,
  isAlreadyEmployed: boolean,
  isUnder40: boolean,
) {
  const base = Math.max(0, quarterlyGross - M1_THRESHOLD_Q);
  return {
    incomeTax: under40Relief(base * M1_INCOME_TAX_RATE, isUnder40),
    pio: base * M1_PIO_RATE,
    health: isAlreadyEmployed
      ? 0
      : Math.max(base * M1_HEALTH_RATE, M1_MIN_HEALTH_Q),
    expensesDeducted: 0,
  };
}

function calcModel2(
  quarterlyGross: number,
  isAlreadyEmployed: boolean,
  isUnder40: boolean,
) {
  const expensesDeducted = quarterlyGross * M2_EXPENSE_RATE;
  const base = Math.max(0, quarterlyGross - expensesDeducted - M2_THRESHOLD_Q);
  return {
    incomeTax: under40Relief(base * M2_INCOME_TAX_RATE, isUnder40),
    pio: isAlreadyEmployed
      ? base * M2_PIO_RATE
      : Math.max(base * M2_PIO_RATE, M2_MIN_PIO_Q),
    health: isAlreadyEmployed
      ? 0
      : Math.max(base * M2_HEALTH_RATE, M2_MIN_HEALTH_Q),
    expensesDeducted,
  };
}

function calcPausal(
  annualGross: number,
  pausalMonthlyBill: number,
  warnings: string[],
) {
  if (annualGross > PAUSAL_ANNUAL_CAP) {
    warnings.push(
      `Godišnji prihod ${annualGross.toLocaleString("sr-RS")} RSD prelazi limit od 6.000.000 RSD za paušalce. Potrebno je preći na knjigaša.`,
    );
  }
  if (annualGross < PAUSAL_ANNUAL_FLOOR) {
    warnings.push(
      `Godišnji prihod je ispod 1.000.000 RSD. Možda niste u mogućnosti da koristite paušalni režim.`,
    );
  }

  // Bill is fixed — not derived from income
  // Ratios are approximations; real split depends on municipality + activity code
  const quarterlyBill = pausalMonthlyBill * 3;
  return {
    incomeTax: quarterlyBill * 0.25,
    pio: quarterlyBill * 0.6,
    health: quarterlyBill * 0.15,
    expensesDeducted: 0,
    // Return the actual total separately since ratios are approximate
    quarterlyTotal: quarterlyBill,
  };
}

function calcKnjigas(
  annualGross: number,
  monthlyExpenses: number,
  monthlySalary: number,
) {
  const monthlyGross = annualGross / 12;
  const monthlyProfit = Math.max(
    0,
    monthlyGross - monthlyExpenses - monthlySalary,
  );
  const monthlyTax =
    KNJIGAS_MIN_SALARY_TAX + monthlyProfit * KNJIGAS_PROFIT_TAX_RATE;

  // PIO and health are folded into salary tax for now
  // TODO: split these out when exact rates are confirmed
  return {
    incomeTax: monthlyTax * 12,
    pio: 0,
    health: 0,
    expensesDeducted: (monthlyExpenses + monthlySalary) * 12,
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function calculateSRBTaxes(inputs: SRBTaxInputs): SRBTaxOutputs {
  const { annualGross, isAlreadyEmployed, isUnder40 } = inputs;
  const warnings: string[] = [];

  let itemized: SRBTaxOutputs["itemized"];
  let totalAnnualTax: number;

  switch (inputs.model) {
    case "MODEL_1": {
      const q = calcModel1(annualGross / 4, isAlreadyEmployed, isUnder40);
      itemized = scaleToAnnual(q);
      totalAnnualTax = (q.incomeTax + q.pio + q.health) * 4;
      break;
    }

    case "MODEL_2": {
      const q = calcModel2(annualGross / 4, isAlreadyEmployed, isUnder40);
      itemized = scaleToAnnual(q);
      totalAnnualTax = (q.incomeTax + q.pio + q.health) * 4;
      break;
    }

    case "PAUSAL": {
      const p = calcPausal(annualGross, inputs.pausalMonthlyBill, warnings);
      itemized = scaleToAnnual(p);
      // Use quarterlyTotal not the sum of itemized ratios — ratios are approximate
      totalAnnualTax = p.quarterlyTotal * 4;
      break;
    }

    case "KNJIGAS": {
      const k = calcKnjigas(
        annualGross,
        inputs.monthlyExpenses,
        inputs.monthlySalary ?? KNJIGAS_MIN_MONTHLY_SALARY,
      );
      itemized = k; // Already annual
      totalAnnualTax = k.incomeTax;
      break;
    }
  }

  return {
    totalAnnualTax,
    quarterlyEstimate: Math.round(totalAnnualTax / 4),
    monthlyReserve: Math.round(totalAnnualTax / 12),
    effectiveTaxRate: annualGross > 0 ? totalAnnualTax / annualGross : 0,
    itemized,
    warnings,
  };
}
