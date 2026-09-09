import { Regime } from "@/types/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type WizardStore = {
  stepOneDone: boolean;
  setStepOneDone: (stepOneDone: boolean) => void;
  stepTwoDone: boolean;
  setStepTwoDone: (stepTwoDone: boolean) => void;
  stepThreeDone: boolean;
  setStepThreeDone: (stepThreeDone: boolean) => void;
  stepFourDone: boolean;
  setStepFourDone: (stepFourDone: boolean) => void;
  stepFiveDone: boolean;
  setStepFiveDone: (stepFiveDone: boolean) => void;

  country: "SRB" | "US" | null;
  setCountry: (country: "SRB" | "US" | null) => void;
  taxResident: boolean | null;
  setTaxResident: (taxResident: boolean | null) => void;
  underForty: boolean | null;
  setUnderForty: (underForty: boolean | null) => void;
  healthInsurance: boolean | null;
  setHealthInsurance: (healthInsurance: boolean | null) => void;
  employed: boolean | null;
  setEmployed: (employed: boolean | null) => void;
  regime: Regime | null;
  setRegime: (regime: Regime | null) => void;
  model: "Model A" | "Model B" | null;
  setModel: (model: "Model A" | "Model B" | null) => void;
  estimateEarn: number | null;
  setEstimateEarn: (estimateEarn: number | null) => void;
  activityCode: string | null;
  setActivityCode: (activityCode: string | null) => void;
  municipality: string | null;
  setMunicipality: (municipality: string | null) => void;
  haveMonthlyAmount: boolean | null;
  setHaveMonthlyAmount: (haveMonthlyAmount: boolean | null) => void;
  monthlyAmount: number | null;
  setMonthlyAmount: (monthlyAmount: number | null) => void;
  expectedYearRevenue: number | null;
  setExpectedYearRevenue: (expectedYearRevenue: number | null) => void;
  resenjeDate: Date | null;
  setResenjeDate: (resenjeDate: Date | null) => void;
  payPersonalSalary: boolean | null;
  setPayPersonalSalary: (payPersonalSalary: boolean | null) => void;
  personalSalary: number | null;
  setPersonalSalary: (personalSalary: number | null) => void;
  trackingBusinessExpenses: boolean | null;
  setTrackingBusinessExpenses: (
    trackingBusinessExpenses: boolean | null,
  ) => void;
  takeSalary: boolean | null;
  setTakeSalary: (takeSalary: boolean | null) => void;
  distributeDividends: boolean | null;
  setDistributeDividends: (distributeDividends: boolean | null) => void;
  onlySalary: boolean | null;
  setOnlySalary: (onlySalary: boolean | null) => void;
  monthlyGrossSalary: number | null;
  setMonthlyGrossSalary: (monthlyGrossSalary: number | null) => void;
  trackNetPay: boolean | null;
  setTrackNetPay: (trackNetPay: boolean | null) => void;
  sideWorkRegime: Regime | null;
  setSideWorkRegime: (sideWorkRegime: Regime | null) => void;
  calcSideActivityTax: boolean | null;
  setCalcSideActivityTax: (calcSideActivityTax: boolean | null) => void;
  inVatSystem: boolean | null;
  setInVatSystem: (inVatSystem: boolean | null) => void;
  vatRegistrationDate: Date | null;
  setVatRegistrationDate: (vatRegistrationDate: Date | null) => void;
  expectedAnnualRevenue: number | null;
  setExpectedAnnualRevenue: (expectedAnnualRevenue: number | null) => void;
  mainClients: "domestic" | "foreign" | "mixed" | null;
  setMainClients: (
    mainClients: "domestic" | "foreign" | "mixed" | null,
  ) => void;
  otherSignificantIncome: boolean | null;
  setOtherSignificantIncome: (otherSignificantIncome: boolean | null) => void;
  finishOnboarding: boolean;
  setFinishOnboarding: (finishOnboarding: boolean) => void;
};

export const useWizardStore = create<WizardStore>()(
  persist(
    (set) => ({
      stepOneDone: false,
      setStepOneDone: (stepOneDone: boolean) => set({ stepOneDone }),
      stepTwoDone: false,
      setStepTwoDone: (stepTwoDone: boolean) => set({ stepTwoDone }),
      stepThreeDone: false,
      setStepThreeDone: (stepThreeDone: boolean) => set({ stepThreeDone }),
      stepFourDone: false,
      setStepFourDone: (stepFourDone: boolean) => set({ stepFourDone }),
      stepFiveDone: false,
      setStepFiveDone: (stepFiveDone: boolean) => set({ stepFiveDone }),

      country: null,
      setCountry: (country: "SRB" | "US" | null) => set({ country }),
      taxResident: null,
      setTaxResident: (taxResident: boolean | null) => set({ taxResident }),
      underForty: null,
      setUnderForty: (underForty: boolean | null) => set({ underForty }),
      healthInsurance: null,
      setHealthInsurance: (healthInsurance: boolean | null) =>
        set({ healthInsurance }),
      employed: null,
      setEmployed: (employed: boolean | null) => set({ employed }),
      regime: null,
      setRegime: (regime: Regime | null) => set({ regime }),
      // freelancer
      model: null,
      setModel: (model: "Model A" | "Model B" | null) => set({ model }),
      estimateEarn: null,
      setEstimateEarn: (estimateEarn: number | null) => set({ estimateEarn }),
      //
      // pausal
      activityCode: null,
      setActivityCode: (activityCode: string | null) => set({ activityCode }),
      municipality: null,
      setMunicipality: (municipality: string | null) => set({ municipality }),
      haveMonthlyAmount: null,
      setHaveMonthlyAmount: (haveMonthlyAmount: boolean | null) =>
        set({ haveMonthlyAmount }),
      monthlyAmount: null,
      setMonthlyAmount: (monthlyAmount: number | null) =>
        set({ monthlyAmount }),
      expectedYearRevenue: null,
      setExpectedYearRevenue: (expectedYearRevenue: number | null) =>
        set({ expectedYearRevenue }),
      resenjeDate: null,
      setResenjeDate: (resenjeDate: Date | null) => set({ resenjeDate }),
      //
      // knjigas
      payPersonalSalary: null,
      setPayPersonalSalary: (payPersonalSalary: boolean | null) =>
        set({ payPersonalSalary }),
      personalSalary: null,
      setPersonalSalary: (personalSalary: number | null) =>
        set({ personalSalary }),
      trackingBusinessExpenses: null,
      setTrackingBusinessExpenses: (trackingBusinessExpenses: boolean | null) =>
        set({ trackingBusinessExpenses }),
      //
      // d.o.o.
      takeSalary: null,
      setTakeSalary: (takeSalary: boolean | null) => set({ takeSalary }),
      distributeDividends: null,
      setDistributeDividends: (distributeDividends: boolean | null) =>
        set({ distributeDividends }),
      //
      // employee
      onlySalary: null,
      setOnlySalary: (onlySalary: boolean | null) => set({ onlySalary }),
      monthlyGrossSalary: null,
      setMonthlyGrossSalary: (monthlyGrossSalary: number | null) =>
        set({ monthlyGrossSalary }),
      trackNetPay: null,
      setTrackNetPay: (trackNetPay: boolean | null) => set({ trackNetPay }),
      //
      // hybrid
      sideWorkRegime: null,
      setSideWorkRegime: (sideWorkRegime: Regime | null) =>
        set({ sideWorkRegime }),
      calcSideActivityTax: null,
      setCalcSideActivityTax: (calcSideActivityTax: boolean | null) =>
        set({ calcSideActivityTax }),
      //
      inVatSystem: null,
      setInVatSystem: (inVatSystem: boolean | null) => set({ inVatSystem }),
      vatRegistrationDate: null,
      setVatRegistrationDate: (vatRegistrationDate: Date | null) =>
        set({ vatRegistrationDate }),
      expectedAnnualRevenue: null,
      setExpectedAnnualRevenue: (expectedAnnualRevenue: number | null) =>
        set({ expectedAnnualRevenue }),
      mainClients: null,
      setMainClients: (mainClients: "domestic" | "foreign" | "mixed" | null) =>
        set({ mainClients }),
      otherSignificantIncome: null,
      setOtherSignificantIncome: (otherSignificantIncome: boolean | null) =>
        set({ otherSignificantIncome }),
      finishOnboarding: false,
      setFinishOnboarding: (finishOnboarding: boolean) =>
        set({ finishOnboarding }),
    }),
    {
      name: "onboarding-store",
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
    },
  ),
);
