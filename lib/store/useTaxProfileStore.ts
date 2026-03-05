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
};

export const useTaxProfileStore = create<
  TaxProfile & {
    update: (updates: Partial<TaxProfile>) => void;
    reset: () => void;
  }
>((set) => ({
  entityType: "",
  filingStatus: "",
  stateResidence: "",
  homeOfficeSqft: null,
  homeOfficeSimplified: null,
  mileageTracking: null,
  healthInsuranceDeduction: null,
  estimatedGross2026: null,
  update: (updates) => set((state) => ({ ...state, ...updates })),
  reset: () =>
    set({
      entityType: "",
      filingStatus: "",
      stateResidence: "",
      homeOfficeSqft: null,
      homeOfficeSimplified: null,
      mileageTracking: null,
      healthInsuranceDeduction: null,
      estimatedGross2026: null,
    }),
}));
