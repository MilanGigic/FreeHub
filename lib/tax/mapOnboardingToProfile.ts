import { Regime } from "@/types/types";
import { useWizardStore } from "../store/useWizardStore";

export type OnboardingData = ReturnType<typeof useWizardStore.getState>;

export function mapOnboardingToProfile(data: OnboardingData) {
  const base = {
    country: data.country === "SRB" ? ("RS" as const) : ("US" as const),
    taxResidency:
      data.taxResident === true
        ? ("resident" as const)
        : data.taxResident === false
          ? ("non_resident" as const)
          : ("unknown" as const),
    isUnder40: Boolean(data.underForty),
    primaryHealthInsuredElsewhere: Boolean(data.healthInsurance),
    alreadyEmployed: Boolean(data.employed),
  };

  if (data.country !== "SRB") {
    return { base, serbia: null };
  }

  const serbia = {
    currentRegime: mapRegime(data.regime),
    preferredFrilenserModel:
      data.model === "Model A" ? "A" : data.model === "Model B" ? "B" : null,
    activityCode: data.activityCode,
    municipality: data.municipality, // you will need to resolve string → uuid
    officialPausalMonthlyAmount: data.haveMonthlyAmount
      ? data.monthlyAmount
      : null,
    resenjeDate: data.resenjeDate,
    personalSalaryElected: data.payPersonalSalary ?? data.takeSalary ?? false,
    personalSalaryGrossMonthly: data.personalSalary ?? null,
    vatRegistered: data.inVatSystem,
    vatRegistrationDate: data.vatRegistrationDate,
    estimatedAnnualGross:
      data.expectedAnnualRevenue ??
      data.expectedYearRevenue ??
      data.estimateEarn,

    // Hybrid specific
    sideRegime:
      data.regime === "hybrid" ? mapRegime(data.sideWorkRegime) : null,
  };

  return { base, serbia };
}

function mapRegime(regime: Regime | null) {
  if (!regime) return null;
  const map: Record<string, string> = {
    freelancer: "freelancer",
    pausal: "pausal",
    knjigas: "knjigas",
    "d.o.o.": "d.o.o.",
    employee: "employment",
    hybrid: "hybrid",
  };
  return map[regime] ?? regime;
}
