import { calculateTaxes } from "@/utils/taxCalculator";
import { create } from "zustand";

type TaxProfile = {
  entityType: string | null;
  filingStatus: string | null;
  stateResidence: string;
  homeOfficeSqft: number | null;
  homeOfficeSimplified: boolean;
  mileageTracking: boolean;
  healthInsuranceDeduction: boolean;
  estimatedAnnualGross: number | null;
};

type TaxResult = {
  netProfit: number; // gross − deductions passed in
  seTax: number; // self-employment tax (annual)
  federalTax: number; // federal income tax (annual)
  qbiDeduction: number; // qualified business income deduction
  totalAnnualTax: number; // seTax + federalTax
  monthlyTaxReserve: number; // totalAnnualTax / 12  ← fixed timeframe
  profitAfterTaxes: number; // netProfit − totalAnnualTax
  quarterlyEstimate: number; // totalAnnualTax / 4
};

type SafeToSpendInputs = {
  currentBalance: number;
  avgMonthlyExpenses: number;
  bufferMultiplier?: number; // default 1.5 — how many months of expenses to hold back
};

type SafeToSpendResult = {
  safeToSpend: number; // floored at 0 — what you can spend today
  safetyBuffer: number; // cash reserved for expenses cushion
  cashRunwayDays: number; // how many days of burn your total spendable covers
  effectiveTaxRate: number; // totalAnnualTax / netProfit (for display)
};

export type TaxProfileStore = TaxProfile &
  TaxResult &
  SafeToSpendResult & {
    // Actions
    update: (updates: Partial<TaxProfile>) => void;
    computeTaxes: (netProfit: number) => void;
    computeSafeToSpend: (inputs: SafeToSpendInputs) => void;
    reset: () => void;
  };

// ─── Constants ────────────────────────────────────────────────────────────────

const AVG_DAYS_PER_MONTH = 365 / 12; // 30.42 — more accurate than hardcoded 30
const DEFAULT_BUFFER_MULTIPLIER = 1.5;
const FALLBACK_SAFETY_BUFFER = 1000; // flat minimum when no expense data exists

// ─── Initial state ────────────────────────────────────────────────────────────

const initialTaxProfile: TaxProfile = {
  entityType: null,
  filingStatus: null,
  stateResidence: "",
  homeOfficeSqft: null,
  homeOfficeSimplified: true,
  mileageTracking: false,
  healthInsuranceDeduction: false,
  estimatedAnnualGross: null,
};

const initialTaxResult: TaxResult = {
  netProfit: 0,
  seTax: 0,
  federalTax: 0,
  qbiDeduction: 0,
  totalAnnualTax: 0,
  monthlyTaxReserve: 0,
  profitAfterTaxes: 0,
  quarterlyEstimate: 0,
};

const initialSafeToSpend: SafeToSpendResult = {
  safeToSpend: 0,
  safetyBuffer: 0,
  cashRunwayDays: 0,
  effectiveTaxRate: 0,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useTaxProfileStore = create<TaxProfileStore>((set, get) => ({
  ...initialTaxProfile,
  ...initialTaxResult,
  ...initialSafeToSpend,

  update: (updates) => set(updates),
  reset: () =>
    set({ ...initialTaxProfile, ...initialTaxResult, ...initialSafeToSpend }),

  computeTaxes: (netProfit: number) => {
    const profile = get();

    const homeOfficeDeduction = profile.homeOfficeSqft
      ? profile.homeOfficeSqft * 5 // IRS simplified method: $5/sqft
      : 0;

    const {
      seTax,
      qbi: qbiDeduction,
      federalTax,
    } = calculateTaxes({
      netProfit,
      filingStatus: profile.filingStatus,
      homeOfficeDeduction,
      // extend here: mileage, health insurance, retirement contributions
    });

    const totalAnnualTax = seTax + federalTax;

    set({
      netProfit,
      seTax,
      federalTax,
      qbiDeduction,
      totalAnnualTax,
      monthlyTaxReserve: Math.round(totalAnnualTax / 12), // ← fixed: same timeframe as balance
      profitAfterTaxes: netProfit - totalAnnualTax,
      quarterlyEstimate: Math.round(totalAnnualTax / 4),
      effectiveTaxRate: netProfit > 0 ? totalAnnualTax / netProfit : 0,
    });
  },
  computeSafeToSpend: (inputs: SafeToSpendInputs) => {
    const {
      currentBalance,
      avgMonthlyExpenses,
      bufferMultiplier = DEFAULT_BUFFER_MULTIPLIER,
    } = inputs;

    const { monthlyTaxReserve } = get();

    const safetyBuffer =
      avgMonthlyExpenses > 0
        ? Math.round(avgMonthlyExpenses * bufferMultiplier)
        : FALLBACK_SAFETY_BUFFER;

    // Only count money you actually have — no speculative future income
    const safeAmount = currentBalance - monthlyTaxReserve - safetyBuffer;

    const spendableForRunway = Math.max(0, currentBalance - monthlyTaxReserve);
    const dailyBurnRate =
      avgMonthlyExpenses > 0
        ? avgMonthlyExpenses / AVG_DAYS_PER_MONTH
        : 1;
    const cashRunwayDays = Math.floor(spendableForRunway / dailyBurnRate);

    set({
      safeToSpend: Math.max(0, Math.floor(safeAmount)),
      safetyBuffer,
      cashRunwayDays,
    });
  },
}));
