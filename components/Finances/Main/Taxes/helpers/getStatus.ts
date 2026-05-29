import { PausalResolutionSource } from "@/lib/pausalResolver";

export function getStatus(
  isComputable: boolean,
  source?: PausalResolutionSource,
) {
  if (!isComputable) {
    return {
      label: "missingData",
      description: "missingDataDescription",
      container: "border-red-500/30 bg-red-500/10",
      text: "text-red-400",
      cta: "Dopuni profil",
    };
  }

  if (source === "verified") {
    return {
      label: "verifiedCalculation",
      description: "verifiedCalculationDescription",
      container: "border-green-500/30 bg-green-500/10",
      text: "text-green-400",
      cta: null,
    };
  }

  if (source === "user") {
    return {
      label: "manualAmountUsed",
      description: "manualAmountUsedDescription",
      container: "border-yellow-500/30 bg-yellow-500/10",
      text: "text-yellow-400",
      cta: "Poboljšaj tačnost",
    };
  }

  return {
    label: "unknownStatus",
    description: "unknownStatusDescription",
    container: "border-neutral-500/30 bg-neutral-500/10",
    text: "text-neutral-400",
    cta: null,
  };
}
