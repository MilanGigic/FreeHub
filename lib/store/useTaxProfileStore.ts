import { calculateTaxes } from "@/utils/taxCalculator";
import { create } from "zustand";

type TaxProfile = {
  entityType: string | null;
  filingStatus: string | null;
  stateResidence: string;
  homeOfficeSqft: number | null;
  homeOfficeSimplified: boolean | null;
  mileageTracking: boolean | null;
  healthInsuranceDeduction: boolean | null;
  estimatedGross2026: number | null;

  netProfit: number; // Gross - expenses
  seTax: number;
  federalTax: number;
  qbiDeduction: number;
  totalTaxEstimate: number;
  quarterlyEstimate: number;

  update: (updates: Partial<TaxProfile>) => void;
  computeTaxes: (newNetProfit: number) => void;
};

type ExtendedTaxProfile = TaxProfile & {
  netProfit: number;
  seTax: number;
  federalTax: number;
  qbi: number;
  profitAfterTaxes: number; // New
  taxReserved: number; // New
  safeToSpend: number; // New
  safetyBuffer: number;
  cashBufferDays: number;
  update: (updates: Partial<ExtendedTaxProfile>) => void;
  computeTaxes: (newNetProfit: number) => void;
  computeSafeToSpend: (inputs: SafeToSpendInputs) => void;
};

type SafeToSpendInputs = {
  currentBalance?: number;
  expectedIncomeNext30Days?: number;
  avgMonthlyExpenses?: number;
  bufferMultiplier?: number;
};

export const useTaxProfileStore = create<ExtendedTaxProfile>((set, get) => ({
  entityType: null,
  filingStatus: null,
  stateResidence: "",
  homeOfficeSqft: null,
  homeOfficeSimplified: null,
  mileageTracking: null,
  healthInsuranceDeduction: null,
  estimatedGross2026: null,
  netProfit: 0,
  seTax: 0,
  federalTax: 0,
  qbiDeduction: 0,
  totalTaxEstimate: 0,
  quarterlyEstimate: 0,
  qbi: 0,
  profitAfterTaxes: 0,
  taxReserved: 0,
  safeToSpend: 0,
  safetyBuffer: 0,
  cashBufferDays: 0,

  update: (updates) => set(updates),
  computeTaxes: (newNetProfit) => {
    const profile = get();
    const { seTax, qbi, federalTax } = calculateTaxes({
      netProfit: newNetProfit,
      filingStatus: profile.filingStatus,
      homeOfficeDeduction: profile.homeOfficeSqft
        ? profile.homeOfficeSqft * 5
        : 0, // Simplified method
      // Add mileage, health, retirement from profile or DB
    });

    const totalTax = seTax + federalTax;
    const profitAfterTaxes = newNetProfit - totalTax;

    set({
      netProfit: newNetProfit,
      seTax,
      federalTax,
      qbi,
      taxReserved: Number(totalTax.toFixed(0)), // For reserving
      profitAfterTaxes,
    });
  },
  computeSafeToSpend: (inputs: SafeToSpendInputs) => {
    const {
      currentBalance = 0,
      expectedIncomeNext30Days = 0,
      avgMonthlyExpenses = 0,
      bufferMultiplier = 1.5, // ← changed to 1.5 months (most popular)
    } = inputs;

    const taxReserved = get().taxReserved;

    // Smart safety buffer (what you actually want)
    let safetyBuffer = avgMonthlyExpenses * bufferMultiplier;

    // Fallback to your original 20% if expenses are zero
    if (safetyBuffer === 0) {
      safetyBuffer = currentBalance * 0.2;
    }

    // Main safe to spend calculation (exactly what freelancers expect)
    const safeAmount =
      currentBalance +
      expectedIncomeNext30Days * 0.8 - // conservative 80% of expected income
      taxReserved -
      safetyBuffer;

    // Cash buffer days
    const dailyBurnRate = avgMonthlyExpenses > 0 ? avgMonthlyExpenses / 30 : 1;
    const cashBufferDays = Math.max(
      0,
      Math.floor(safetyBuffer / dailyBurnRate),
    );

    set({
      safeToSpend: Math.max(0, Math.floor(safeAmount)),
      // Optional: store these too so you can use them anywhere
      safetyBuffer: Math.floor(safetyBuffer),
      cashBufferDays,
    });
  },
}));
