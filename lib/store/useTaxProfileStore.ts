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
  update: (updates: Partial<ExtendedTaxProfile>) => void;
  computeTaxes: (newNetProfit: number) => void;
  computeSafeToSpend: (inputs: SafeToSpendInputs) => void;
};

type SafeToSpendInputs = {
  currentBalance?: number;
  expectedIncomeNext30Days?: number;
  avgMonthlyExpenses?: number;
  bufferMultiplier?: number;
  timeHorizonDays?: number;
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
  computeSafeToSpend: (inputs) => {
    // From our earlier formula (copy-paste this func)
    const {
      currentBalance = 0,
      expectedIncomeNext30Days = 0,
      avgMonthlyExpenses = 0,
      bufferMultiplier = 0.2,
      timeHorizonDays = 30,
    } = inputs;
    const proratedExpenses = avgMonthlyExpenses * (timeHorizonDays / 30);
    const taxReserved = get().taxReserved; // Pull from store
    const safetyBuffer = proratedExpenses * bufferMultiplier;

    const safeAmount =
      currentBalance +
      expectedIncomeNext30Days * 0.8 -
      proratedExpenses -
      taxReserved -
      safetyBuffer;
    set({ safeToSpend: Math.max(0, Math.floor(safeAmount)) });
  },
}));
