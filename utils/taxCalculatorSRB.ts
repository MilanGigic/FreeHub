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
const PAUSAL_VAT_ROLLING_CAP = 8_000_000;

// KNJIGAS — verified against 2026 Poreska uprava / ZDOSO rules
// Sources: ndsmallbusinesscenter.rs, taxinternational.biz, levka.eu (2026)
//
// Lična zarada contribution structure (preduzetnik pays both sides):
//   PIO:          14% (zaposleni) + 10% (poslodavac) = 24%
//   Zdravstveno:  5.15% + 5.15%                       = 10.3%
//   Nezaposlenost: 0.75% (zaposleni only)              = 0.75%
//   ─────────────────────────────────────────────────────────
//   Total contributions (not already employed):        35.05%
//
// If isAlreadyEmployed: only PIO applies (24%). Health + nezaposlenost = 0.
//
// Income tax on lična zarada: 10% on (bruto - neoporezivi)
//   Neoporezivi iznos 2026: 34,221 RSD/month
//
// Minimum contribution base 2026: 51,297 RSD/month
//   Contributions are always calculated on max(actualSalary, 51,297)
//   regardless of what the preduzetnik actually draws.
const KNJIGAS_MIN_MONTHLY_SALARY = 52_000; // practical minimum (above base)
const KNJIGAS_MIN_CONTRIBUTION_BASE = 51_297; // 2026 najniža mesečna osnovica
const KNJIGAS_SALARY_PIO_RATE = 0.24; // 14% + 10% combined
const KNJIGAS_SALARY_HEALTH_RATE = 0.103; // 5.15% + 5.15% combined
const KNJIGAS_SALARY_NEZAPOSLENOST_RATE = 0.0075; // employee side only
const KNJIGAS_SALARY_INCOME_TAX_RATE = 0.1;
const KNJIGAS_SALARY_NEOPOREZIVI = 34_221; // 2026 monthly tax-free threshold
const KNJIGAS_PROFIT_TAX_RATE = 0.1;

// M1/M2 break-even (quarterly) — above this Model 2 is cheaper
const M1_M2_BREAKEVEN_Q = 133_000;

// SHARED
const UNDER_40_RELIEF = 0.5; // 50% income tax relief

// ECO tax
const ECO_TAX_ANNUAL = 5_000;

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
  pausalMonthlyBill?: number; // Fixed bill from tax office
  rollingAnnualGross?: number; // 12-month rolling window for VAT check (optional)
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
  model: SRBTaxInputs["model"];

  totalAnnualTax: number;
  quarterlyEstimate: number;
  monthlyReserve: number;
  effectiveTaxRate: number;

  /**
   * Annual revenue minus taxes only. Used by frilenser and paušal where
   * "expenses" are either a standard deduction or irrelevant.
   */
  profitAfterTaxes: number;

  /**
   * Annual revenue minus actual business expenses, salary, and taxes.
   * Only meaningful for KNJIGAS. Equals profitAfterTaxes for other models.
   * This is the "money you actually keep" figure.
   */
  netAfterExpensesAndTax: number;

  itemized: {
    incomeTax: number;
    pio: number;
    health: number;
    nezaposlenost: number;
    expensesDeducted: number;
  };

  regimeData?: {
    monthlyPausalBill?: number;

    taxableIncome?: number;
    normiraniTroskovi?: number;

    businessExpenses?: number;
    salaryExpense?: number;
  };

  // Recommendation for frilenser users — which model is cheaper
  modelRecommendation?: {
    recommended: "MODEL_1" | "MODEL_2";
    reason: string;
  };

  warnings: string[];
  annualRevenue: number;
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
    nezaposlenost: 0, // frilenser models don't have a separate nezaposlenost line
    expensesDeducted: quarterly.expensesDeducted * 4,
  };
}

/**
 * Computes the M1/M2 recommendation based on quarterly gross.
 * Break-even is ~133,000 RSD/quarter.
 */
function computeModelRecommendation(
  quarterlyGross: number,
): SRBTaxOutputs["modelRecommendation"] {
  if (quarterlyGross < M1_M2_BREAKEVEN_Q) {
    return {
      recommended: "MODEL_1",
      reason: `Sa prihodom ispod ${M1_M2_BREAKEVEN_Q.toLocaleString("sr-RS")} RSD kvartalno, Model 1 je povoljniji — viši neoporezivi iznos pokriva veći deo prihoda.`,
    };
  }
  return {
    recommended: "MODEL_2",
    reason: `Sa prihodom iznad ${M1_M2_BREAKEVEN_Q.toLocaleString("sr-RS")} RSD kvartalno, Model 2 je povoljniji — odbitak normiranih troškova od 34% štedi više od višeg neoporezivog iznosa u Modelu 1.`,
  };
}

// ─── Model calculators (pure, quarterly in → quarterly out) ───────────────────

function calcModel1(
  quarterlyGross: number,
  isAlreadyEmployed: boolean,
  isUnder40: boolean,
  warnings: string[],
) {
  const base = Math.max(0, quarterlyGross - M1_THRESHOLD_Q);

  // Warn about hidden minimum health obligation for unemployed with zero income
  if (quarterlyGross === 0 && !isAlreadyEmployed) {
    warnings.push(
      "Čak i bez prihoda, ako niste zaposleni drugde, dugujete minimum zdravstvenog osiguranja (~4.800 RSD kvartalno) da biste zadržali zdravstvenu knjižicu.",
    );
  }

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
  warnings: string[],
) {
  const expensesDeducted = quarterlyGross * M2_EXPENSE_RATE;
  const base = Math.max(0, quarterlyGross - expensesDeducted - M2_THRESHOLD_Q);

  // Warn about hidden minimum health obligation for unemployed with zero income
  if (quarterlyGross === 0 && !isAlreadyEmployed) {
    warnings.push(
      "Čak i bez prihoda, ako niste zaposleni drugde, dugujete minimum zdravstvenog osiguranja (~4.800 RSD kvartalno) da biste zadržali zdravstvenu knjižicu.",
    );
  }

  return {
    incomeTax: under40Relief(base * M2_INCOME_TAX_RATE, isUnder40),
    // When already employed, do NOT apply the PIO minimum floor —
    // the floor exists to ensure minimum pension contributions for
    // those whose freelance work is their only covered income.
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
  pausalMonthlyBill: number | undefined,
  warnings: string[],
  rollingAnnualGross?: number,
): {
  monthlyTotal: number;
  quarterlyTotal: number;
  annualTotal: number;
} | null {
  // Step 1 — Precondition: bill must be a usable number
  if (
    pausalMonthlyBill === undefined ||
    pausalMonthlyBill === null ||
    pausalMonthlyBill <= 0 ||
    !isFinite(pausalMonthlyBill)
  ) {
    warnings.push(
      "Paušalni mesečni iznos nije validan. Proverite unesenu vrednost.",
    );
    return null;
  }

  // Step 2 — Regulatory cap checks
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

  // Step 3 — VAT (PDV) rolling 12-month window check
  // Use rollingAnnualGross if provided, otherwise fall back to annualGross
  const revenueForVatCheck = rollingAnnualGross ?? annualGross;
  if (revenueForVatCheck > PAUSAL_VAT_ROLLING_CAP) {
    warnings.push(
      `Prihod u poslednjih 12 meseci (${revenueForVatCheck.toLocaleString("sr-RS")} RSD) prelazi 8.000.000 RSD. Obavezna je registracija u sistem PDV-a.`,
    );
  }

  // Step 4 — ECO tax reminder
  warnings.push(
    `Ne zaboravite: kao preduzetnik paušalac, obavezni ste da podnesete prijavu ekološke takse (~${ECO_TAX_ANNUAL.toLocaleString("sr-RS")} RSD/god) do 30. aprila. Kazne za nepodnošenje su značajne.`,
  );

  // Step 5 — Compute totals (fixed obligation, independent of income)
  return {
    monthlyTotal: pausalMonthlyBill,
    quarterlyTotal: pausalMonthlyBill * 3,
    annualTotal: pausalMonthlyBill * 12,
  };
}

function calcKnjigas(
  annualGross: number,
  monthlyExpenses: number,
  monthlySalary: number,
  isAlreadyEmployed: boolean,
  isUnder40: boolean,
  warnings: string[],
) {
  const monthlyGross = annualGross / 12;

  /**
   * VERIFIED:
   * - contribution base floor
   * - PIO
   * - health
   * - unemployment
   * - non-taxable salary threshold
   *
   * TODO:
   * Confirm profit tax base calculation
   * with Serbian accountant before production.
   */

  // ── Minimum contribution base enforcement ─────────────────────────────────
  // Contributions are always calculated on at least the legal minimum base
  // (51,297 RSD in 2026), even if the declared salary is lower.
  const contributionBase = Math.max(
    monthlySalary,
    KNJIGAS_MIN_CONTRIBUTION_BASE,
  );

  // ── PIO ───────────────────────────────────────────────────────────────────
  // Always applies (24% combined employee + employer), regardless of
  // employment status. The only difference is that if already employed
  // elsewhere, no health or nezaposlenost is owed on freelance income.
  const monthlyPio = contributionBase * KNJIGAS_SALARY_PIO_RATE;

  // ── Health & nezaposlenost ────────────────────────────────────────────────
  // Waived if already insured/employed elsewhere (same rule as frilenser).
  const monthlyHealth = isAlreadyEmployed
    ? 0
    : contributionBase * KNJIGAS_SALARY_HEALTH_RATE;
  const monthlyNezaposlenost = isAlreadyEmployed
    ? 0
    : contributionBase * KNJIGAS_SALARY_NEZAPOSLENOST_RATE;

  // ── Income tax on lična zarada ────────────────────────────────────────────
  // 10% on (bruto salary - monthly neoporezivi threshold of 34,221 RSD).
  // Under-40 relief (50%) applies to this income tax component.
  const taxableSalaryBase = Math.max(
    0,
    monthlySalary - KNJIGAS_SALARY_NEOPOREZIVI,
  );
  const monthlyIncomeTaxOnSalary = under40Relief(
    taxableSalaryBase * KNJIGAS_SALARY_INCOME_TAX_RATE,
    isUnder40,
  );

  // ── Profit tax ────────────────────────────────────────────────────────────
  // Flat 10% on net profit (revenue - actual expenses - salary).
  // Salary is already a recognised business expense so not double-counted.
  const monthlyProfit = Math.max(
    0,
    monthlyGross - monthlyExpenses - monthlySalary,
  );
  const monthlyProfitTax = monthlyProfit * KNJIGAS_PROFIT_TAX_RATE;

  // ── Warnings ─────────────────────────────────────────────────────────────
  warnings.push(
    `Kao preduzetnik knjigaš, obavezni ste da podnesete prijavu ekološke takse (~${ECO_TAX_ANNUAL.toLocaleString("sr-RS")} RSD/god) do 30. aprila.`,
  );
  warnings.push(
    "Proverite test samostalnosti: ako imate samo jednog klijenta i radite puno radno vreme, poreska uprava može vas preklasifikovati kao zaposlenog.",
  );

  // ── Annual totals ─────────────────────────────────────────────────────────
  const annualPio = monthlyPio * 12;
  const annualHealth = monthlyHealth * 12;
  const annualNezaposlenost = monthlyNezaposlenost * 12;
  const annualIncomeTax = (monthlyIncomeTaxOnSalary + monthlyProfitTax) * 12;
  const annualExpensesDeducted = (monthlyExpenses + monthlySalary) * 12;
  const annualTotalTax =
    annualIncomeTax + annualPio + annualHealth + annualNezaposlenost;

  return {
    incomeTax: annualIncomeTax,
    pio: annualPio,
    health: annualHealth,
    nezaposlenost: annualNezaposlenost,
    expensesDeducted: annualExpensesDeducted,
    // Pre-computed so the switch can use it directly
    totalAnnualTax: annualTotalTax,
    // "Money you actually keep" = revenue - real expenses - salary - taxes
    netAfterExpensesAndTax: Math.max(
      0,
      annualGross - annualExpensesDeducted - annualTotalTax,
    ),
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function calculateSRBTaxes(inputs: SRBTaxInputs): SRBTaxOutputs {
  const { annualGross, isAlreadyEmployed, isUnder40 } = inputs;
  const warnings: string[] = [];

  let itemized: SRBTaxOutputs["itemized"];
  let totalAnnualTax: number;
  let modelRecommendation: SRBTaxOutputs["modelRecommendation"] | undefined;
  let knjigasNet: number | undefined; // only set for KNJIGAS

  switch (inputs.model) {
    case "MODEL_1": {
      const quarterlyGross = annualGross / 4;
      const q = calcModel1(
        quarterlyGross,
        isAlreadyEmployed,
        isUnder40,
        warnings,
      );

      itemized = scaleToAnnual(q);
      totalAnnualTax = (q.incomeTax + q.pio + q.health) * 4;
      modelRecommendation = computeModelRecommendation(quarterlyGross);
      break;
    }

    case "MODEL_2": {
      const quarterlyGross = annualGross / 4;
      const q = calcModel2(
        quarterlyGross,
        isAlreadyEmployed,
        isUnder40,
        warnings,
      );

      itemized = scaleToAnnual(q);
      totalAnnualTax = (q.incomeTax + q.pio + q.health) * 4;
      modelRecommendation = computeModelRecommendation(quarterlyGross);
      break;
    }

    case "PAUSAL": {
      const p = calcPausal(
        annualGross,
        inputs.pausalMonthlyBill,
        warnings,
        inputs.rollingAnnualGross,
      );

      if (p === null) {
        return {
          model: "PAUSAL",
          totalAnnualTax: 0,
          quarterlyEstimate: 0,
          monthlyReserve: 0,
          effectiveTaxRate: 0,
          profitAfterTaxes: 0,
          netAfterExpensesAndTax: 0,
          itemized: {
            incomeTax: 0,
            pio: 0,
            health: 0,
            nezaposlenost: 0,
            expensesDeducted: 0,
          },
          warnings,
          annualRevenue: 0,
        };
      }

      totalAnnualTax = p.annualTotal;
      itemized = {
        incomeTax: 0,
        pio: 0,
        health: 0,
        nezaposlenost: 0,
        expensesDeducted: 0,
      };
      break;
    }

    case "KNJIGAS": {
      const k = calcKnjigas(
        annualGross,
        inputs.monthlyExpenses,
        inputs.monthlySalary ?? KNJIGAS_MIN_MONTHLY_SALARY,
        isAlreadyEmployed,
        isUnder40,
        warnings,
      );
      itemized = {
        incomeTax: k.incomeTax,
        pio: k.pio,
        health: k.health,
        nezaposlenost: k.nezaposlenost,
        expensesDeducted: k.expensesDeducted,
      };
      totalAnnualTax = k.totalAnnualTax;
      knjigasNet = k.netAfterExpensesAndTax;
      break;
    }
  }

  return {
    model: inputs.model,
    totalAnnualTax,
    quarterlyEstimate: Math.round(totalAnnualTax / 4),
    monthlyReserve: Math.round(totalAnnualTax / 12),
    effectiveTaxRate: annualGross > 0 ? totalAnnualTax / annualGross : 0,
    // For frilenser/paušal, "profit" is simply revenue minus taxes.
    // For knjigaš, we expose both: revenue-minus-taxes AND revenue-minus-everything.
    profitAfterTaxes: Math.max(0, annualGross - totalAnnualTax),
    netAfterExpensesAndTax:
      knjigasNet ?? Math.max(0, annualGross - totalAnnualTax),
    itemized,
    modelRecommendation,
    warnings,
    annualRevenue: annualGross,
  };
}
