import { TaxProfile } from "@/types/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type WizardStore = {
  // Step One
  // USA
  entityType: string | null;
  setEntityType: (entityType: string | null) => void;
  // Serbia
  regime: string | null;
  setRegime: (regime: string | null) => void;
  // Step Two
  // USA
  filingStatus: string | null;
  setFilingStatus: (filingStatus: string | null) => void;
  stateResidence: string | null;
  setStateResidence: (stateResidence: string | null) => void;
  // Serbia
  model: string | null;
  setModel: (model: string | null) => void;
  healthInsuredElsewhere: boolean | null;
  setHealthInsuredElsewhere: (healthInsuredElsewhere: boolean | null) => void;
  // Step Three
  // USA
  estimatedAnnualGross: number | null;
  setEstimatedAnnualGross: (estimatedAnnualGross: number | null) => void;
  // Serbia
  paysPersonalSalary: boolean | null;
  setPaysPersonalSalary: (paysPersonalSalary: boolean | null) => void;
  personalSalaryAmount: number | null;
  setPersonalSalaryAmount: (personalSalaryAmount: number | null) => void;

  taxProfile: TaxProfile | null;
  setTaxProfile: (taxProfile: TaxProfile | null) => void;
};

export const useWizardStore = create<WizardStore>()(
  persist(
    (set) => ({
      entityType: null,
      setEntityType: (entityType: string | null) => set({ entityType }),
      regime: null,
      setRegime: (regime: string | null) => set({ regime }),
      filingStatus: null,
      setFilingStatus: (filingStatus: string | null) => set({ filingStatus }),
      stateResidence: null,
      setStateResidence: (stateResidence: string | null) =>
        set({ stateResidence }),
      model: null,
      setModel: (model: string | null) => set({ model }),
      healthInsuredElsewhere: null,
      setHealthInsuredElsewhere: (healthInsuredElsewhere: boolean | null) =>
        set({ healthInsuredElsewhere }),
      estimatedAnnualGross: null,
      setEstimatedAnnualGross: (estimatedAnnualGross: number | null) =>
        set({ estimatedAnnualGross }),
      paysPersonalSalary: null,
      setPaysPersonalSalary: (paysPersonalSalary: boolean | null) =>
        set({ paysPersonalSalary }),
      personalSalaryAmount: null,
      setPersonalSalaryAmount: (personalSalaryAmount: number | null) =>
        set({ personalSalaryAmount }),
      taxProfile: null,
      setTaxProfile: (taxProfile: TaxProfile | null) => set({ taxProfile }),
    }),
    {
      name: "wizard-store",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
