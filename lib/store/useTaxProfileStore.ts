import { CountryTaxProfile } from "@/actions/taxProfile";
import { create } from "zustand";
import { PausalResolution } from "../pausalResolver";

export type TaxSystem = "US" | "SRB";

export type SRBModel = "MODEL_1" | "MODEL_2" | "PAUSAL" | "KNJIGAS";

export type TaxWarnings = {
  global: string[];
  pausal: string[];
  independenceTest: string[];
  vat: string[];
};
// ────────────────────────────────────────────────────────────────────────────────
// Tax Result
// ────────────────────────────────────────────────────────────────────────────────

export type TaxResult = {
  model?: SRBModel;
  netProfit: number;
  annualRevenue: number;

  // US-specific
  seTax: number;
  federalTax: number;
  qbiDeduction: number;

  // Shared
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

  /** MODEL_1 vs MODEL_2 break-even hint (Serbia frilenser only) */
  modelRecommendation?: {
    recommended: "MODEL_1" | "MODEL_2";
    reason: string;
  };
};

// ────────────────────────────────────────────────────────────────────────────────
// Safe-to-spend
// ────────────────────────────────────────────────────────────────────────────────

export type SafeToSpendInputs = {
  currentBalance: number;
  avgMonthlyExpenses: number;
  bufferMultiplier?: number;
};

export type SafeToSpendResult = {
  amount: number;
  safetyBuffer: number;
  cashRunwayDays: number;
};

// ────────────────────────────────────────────────────────────────────────────────
// Pausal UI State
// ────────────────────────────────────────────────────────────────────────────────

export type PausalUiState = {
  resolution: PausalResolution | null;
  isLoading: boolean;
  lastResolvedAt?: string;
};

// ────────────────────────────────────────────────────────────────────────────────
// Tax Computation Meta
// ────────────────────────────────────────────────────────────────────────────────

export type TaxComputationMeta = {
  isComputable: boolean;
  pausalSource?: "verified" | "aggregate" | "user" | "unknown";
};

// ────────────────────────────────────────────────────────────────────────────────
// Store Shape
// ────────────────────────────────────────────────────────────────────────────────

export type TaxProfileStore = {
  // Main profile
  profile: CountryTaxProfile;
  setProfile: (profile: CountryTaxProfile) => void;

  // Tax results
  taxResult: TaxResult;
  setTaxResult: (result: TaxResult) => void;

  // Tax metadata
  taxMeta: TaxComputationMeta;
  setTaxMeta: (meta: TaxComputationMeta) => void;

  // Pausal resolver state
  pausal: PausalUiState;
  setPausalResolution: (resolution: PausalResolution | null) => void;
  setPausalLoading: (loading: boolean) => void;

  // Safe-to-spend
  safeToSpend: SafeToSpendResult;
  computeSafeToSpend: (inputs: SafeToSpendInputs) => void;

  // Loading / error states
  isTaxCalculating: boolean;
  setIsTaxCalculating: (isTaxCalculating: boolean) => void;
  taxCalculationError?: string;
  setTaxCalculationError: (taxCalculationError?: string) => void;

  // Reset
  reset: () => void;
};

// ────────────────────────────────────────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────────────────────────────────────────

const AVG_DAYS_PER_MONTH = 365 / 12;
const DEFAULT_BUFFER_MULTIPLIER = 1.5;
const FALLBACK_SAFETY_BUFFER = 1000;

// ────────────────────────────────────────────────────────────────────────────────
// Initial State
// ────────────────────────────────────────────────────────────────────────────────

const initialProfile: CountryTaxProfile = null;

const initialTaxResult: TaxResult = {
  model: undefined,
  netProfit: 0,
  annualRevenue: 0,
  seTax: 0,
  federalTax: 0,
  qbiDeduction: 0,
  totalAnnualTax: 0,
  monthlyTaxReserve: 0,
  profitAfterTaxes: 0,
  quarterlyEstimate: 0,
  effectiveTaxRate: 0,
  warnings: [],
  itemized: {
    incomeTax: 0,
    pension: 0,
    health: 0,
    expensesDeducted: 0,
  },
};

const initialSafeToSpend: SafeToSpendResult = {
  amount: 0,
  safetyBuffer: 0,
  cashRunwayDays: 0,
};

const initialTaxMeta: TaxComputationMeta = {
  isComputable: false,
  pausalSource: "unknown",
};

const initialPausalState: PausalUiState = {
  resolution: null,
  isLoading: false,
};

// ────────────────────────────────────────────────────────────────────────────────
// Store
// ────────────────────────────────────────────────────────────────────────────────

export const useTaxProfileStore = create<TaxProfileStore>((set, get) => ({
  // Profile
  profile: initialProfile,
  setProfile: (profile) => set({ profile }),

  // Tax result
  taxResult: initialTaxResult,
  setTaxResult: (result) =>
    set({
      taxResult: result,
    }),

  // Tax meta
  taxMeta: initialTaxMeta,
  setTaxMeta: (meta) =>
    set({
      taxMeta: meta,
    }),

  // Pausal
  pausal: initialPausalState,

  setPausalResolution: (resolution) =>
    set({
      pausal: {
        ...get().pausal,
        resolution,
        lastResolvedAt: new Date().toISOString(),
      },
    }),

  setPausalLoading: (loading) =>
    set({
      pausal: {
        ...get().pausal,
        isLoading: loading,
      },
    }),

  // Safe-to-spend
  safeToSpend: initialSafeToSpend,

  computeSafeToSpend: ({
    currentBalance,
    avgMonthlyExpenses,
    bufferMultiplier = DEFAULT_BUFFER_MULTIPLIER,
  }) => {
    const monthlyTaxReserve = get().taxResult.monthlyTaxReserve;

    const safetyBuffer =
      avgMonthlyExpenses > 0
        ? Math.round(avgMonthlyExpenses * bufferMultiplier)
        : FALLBACK_SAFETY_BUFFER;

    const safeAmount = currentBalance - monthlyTaxReserve - safetyBuffer;

    const spendableForRunway = Math.max(0, currentBalance - monthlyTaxReserve);

    const dailyBurnRate =
      avgMonthlyExpenses > 0 ? avgMonthlyExpenses / AVG_DAYS_PER_MONTH : 1;

    set({
      safeToSpend: {
        amount: Math.max(0, Math.floor(safeAmount)),
        safetyBuffer,
        cashRunwayDays: Math.floor(spendableForRunway / dailyBurnRate),
      },
    });
  },

  isTaxCalculating: false,
  setIsTaxCalculating: (calculating) =>
    set({
      isTaxCalculating: calculating,
    }),

  taxCalculationError: "",
  setTaxCalculationError: (error) =>
    set({
      taxCalculationError: error,
    }),

  // Reset
  reset: () =>
    set({
      profile: initialProfile,
      taxResult: initialTaxResult,
      taxMeta: initialTaxMeta,
      pausal: initialPausalState,
      safeToSpend: initialSafeToSpend,
    }),
}));
