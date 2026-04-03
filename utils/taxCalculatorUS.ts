import { TaxProfile } from "@/types/types";

// utils/taxCalculator.ts (2026 rates)
interface TaxInputs {
  netProfit: number; // Gross - expenses
  filingStatus: TaxProfile["filingStatus"];
  homeOfficeDeduction?: number; // e.g., $5 * sqft (simplified)
  mileageDeduction?: number; // Miles * 0.72 (2026 rate - update annually)
  healthInsurance?: number; // User-input amount
  retirementContribution?: number; // SEP up to 25% net
}

interface TaxOutputs {
  seTax: number;
  halfSe: number; // Deductible half
  agi: number; // Net - half SE - other deductions
  qbi: number; // 20% of QBI
  federalTax: number;
}

export function calculateUSTaxes(inputs: TaxInputs): TaxOutputs {
  const { netProfit, filingStatus } = inputs;
  if (netProfit < 400)
    return { seTax: 0, halfSe: 0, agi: 0, qbi: 0, federalTax: 0 }; // No SE under $400

  // SE Tax (15.3% on 92.35% of net)
  const seBase = netProfit * 0.9235;
  const ssWageBase = 184500; // 2026
  const ssTax = Math.min(seBase, ssWageBase) * 0.124;
  const medicareTax = seBase * 0.029;

  // Additional Medicare (0.9%)
  const addMedThreshold = filingStatus === "mfj" ? 250000 : 200000; // Simplified (add mfs etc.)
  const addMed = Math.max(0, netProfit - addMedThreshold) * 0.009;

  const seTax = ssTax + medicareTax + addMed;
  const halfSe = seTax / 2;

  // Other deductions (from profile)
  const otherDeds =
    (inputs.homeOfficeDeduction || 0) +
    (inputs.mileageDeduction || 0) +
    (inputs.healthInsurance || 0) +
    (inputs.retirementContribution || 0);

  // AGI for federal tax
  const agi = Math.max(0, netProfit - halfSe - otherDeds);

  // QBI: 20% of QBI (approx net after half SE; assume no phase-out)
  const qbiBase = netProfit - halfSe; // Simplified QBI
  const qbi = qbiBase * 0.2;

  // Federal Income Tax (progressive brackets)
  const brackets = getBrackets(filingStatus); // See below
  let federalTax = 0;
  let remaining = agi - qbi; // Taxable after QBI
  for (const [rate, upper] of brackets) {
    if (remaining <= 0) break;
    const taxableInBracket = Math.min(remaining, upper);
    federalTax += taxableInBracket * rate;
    remaining -= taxableInBracket;
  }

  return { seTax, halfSe, agi, qbi, federalTax };
}

// 2026 Brackets (cumulative upper limits + rates)
function getBrackets(status: TaxProfile["filingStatus"]): [number, number][] {
  switch (status) {
    case "single":
    case "mfs":
      return [
        [0.1, 12400],
        [0.12, 50400 - 12400],
        [0.22, 105700 - 50400],
        [0.24, 201775 - 105700],
        [0.32, 256225 - 201775],
        [0.35, 640600 - 256225],
        [0.37, Infinity], // Over 640600
      ];
    case "mfj":
      return [
        [0.1, 24800],
        [0.12, 100800 - 24800],
        [0.22, 211400 - 100800],
        [0.24, 403550 - 211400],
        [0.32, 512450 - 403550],
        [0.35, 768700 - 512450],
        [0.37, Infinity],
      ];
    case "hoh":
      return [
        [0.1, 17700],
        [0.12, 67450 - 17700],
        [0.22, 105700 - 67450],
        [0.24, 201750 - 105700],
        [0.32, 256200 - 201750],
        [0.35, 640600 - 256200],
        [0.37, Infinity],
      ];
    default:
      return []; // Error handling
  }
}
