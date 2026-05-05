import { TaxComputationInput } from "@/actions/computeTaxes";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DEFAULT_TAX_COMPUTATION_RESULT: {
  input: TaxComputationInput;
  warnings: string[];
} = {
  input: {
    country: "SRB",
    annualGross: 0,
    model: "PAUSAL",
    isAlreadyEmployed: false,
    isUnder40: false,
    pausalMonthlyBill: undefined,
    monthlyExpenses: undefined,
    monthlySalary: undefined,
  },
  warnings: [],
};
