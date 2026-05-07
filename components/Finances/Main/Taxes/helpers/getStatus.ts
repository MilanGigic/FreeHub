import { PausalResolutionSource } from "@/lib/pausalResolver";

export function getStatus(
  isComputable: boolean,
  source?: PausalResolutionSource,
) {
  if (!isComputable) {
    return {
      label: "Nedostaju podaci",
      description: "Ne možemo izračunati porez bez dodatnih informacija",
      container: "border-red-500/30 bg-red-500/10",
      text: "text-red-400",
      cta: "Dopuni profil",
    };
  }

  if (source === "verified") {
    return {
      label: "Verifikovan obračun",
      description: "Bazirano na zvaničnim podacima",
      container: "border-green-500/30 bg-green-500/10",
      text: "text-green-400",
      cta: null,
    };
  }

  if (source === "user") {
    return {
      label: "Korišćen ručni unos",
      description: "Rezultat može odstupati od stvarnog poreza",
      container: "border-yellow-500/30 bg-yellow-500/10",
      text: "text-yellow-400",
      cta: "Poboljšaj tačnost",
    };
  }

  return {
    label: "Nepoznat status",
    description: "",
    container: "border-neutral-500/30 bg-neutral-500/10",
    text: "text-neutral-400",
    cta: null,
  };
}
