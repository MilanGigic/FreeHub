import { CountryTaxProfile } from "@/actions/taxProfile";
import { create } from "zustand";

export type TaxSystem = "US" | "SRB";
export type SRBModel = "MODEL_1" | "MODEL_2" | "PAUSAL" | "KNJIGAS";

export type TaxResult = {
  netProfit: number;
  seTax: number;
  federalTax: number;
  qbiDeduction: number;
  totalAnnualTax: number;
  monthlyTaxReserve: number;
  profitAfterTaxes: number;
  quarterlyEstimate: number;
  effectiveTaxRate: number;
  warnings: string[];
  itemized: {
    incomeTax: number;
    pension: number;
    health: number;
    expensesDeducted: number;
  };
};

export type SafeToSpendInputs = {
  currentBalance: number;
  avgMonthlyExpenses: number;
  bufferMultiplier?: number;
};

export type SafeToSpendResult = {
  safeToSpend: number;
  safetyBuffer: number;
  cashRunwayDays: number;
};

export type TaxProfileStore = {
  profile: CountryTaxProfile;
  setProfile: (profile: CountryTaxProfile) => void;
} & TaxResult &
  SafeToSpendResult & {
    setTaxResult: (result: TaxResult) => void;
    computeSafeToSpend: (inputs: SafeToSpendInputs) => void;
    reset: () => void;
  };

// ─── Constants ────────────────────────────────────────────────────────────────

const AVG_DAYS_PER_MONTH = 365 / 12;
const DEFAULT_BUFFER_MULTIPLIER = 1.5;
const FALLBACK_SAFETY_BUFFER = 1000;

// ─── Initial state ────────────────────────────────────────────────────────────

const initialProfile: CountryTaxProfile = null;

const initialResult: TaxResult = {
  netProfit: 0,
  seTax: 0,
  federalTax: 0,
  qbiDeduction: 0,
  totalAnnualTax: 0,
  monthlyTaxReserve: 0,
  profitAfterTaxes: 0,
  quarterlyEstimate: 0,
  effectiveTaxRate: 0,
  warnings: [],
  itemized: { incomeTax: 0, pension: 0, health: 0, expensesDeducted: 0 },
};

const initialSafeToSpend: SafeToSpendResult = {
  safeToSpend: 0,
  safetyBuffer: 0,
  cashRunwayDays: 0,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useTaxProfileStore = create<TaxProfileStore>((set, get) => ({
  profile: initialProfile,
  setProfile: (profile: CountryTaxProfile) => set({ profile }),
  ...initialResult,
  ...initialSafeToSpend,

  setTaxResult: (result) => set(result),

  reset: () => set({ ...initialResult, ...initialSafeToSpend }),

  computeSafeToSpend: ({
    currentBalance,
    avgMonthlyExpenses,
    bufferMultiplier = DEFAULT_BUFFER_MULTIPLIER,
  }) => {
    const { monthlyTaxReserve } = get();

    const safetyBuffer =
      avgMonthlyExpenses > 0
        ? Math.round(avgMonthlyExpenses * bufferMultiplier)
        : FALLBACK_SAFETY_BUFFER;

    const safeAmount = currentBalance - monthlyTaxReserve - safetyBuffer;
    const spendableForRunway = Math.max(0, currentBalance - monthlyTaxReserve);
    const dailyBurnRate =
      avgMonthlyExpenses > 0 ? avgMonthlyExpenses / AVG_DAYS_PER_MONTH : 1;

    set({
      safeToSpend: Math.max(0, Math.floor(safeAmount)),
      safetyBuffer,
      cashRunwayDays: Math.floor(spendableForRunway / dailyBurnRate),
    });
  },
}));
