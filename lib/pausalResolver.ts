// ─── Pausal Tax Resolver ───────────────────────────────────────────────────────

import { db } from "@/db";
import { pausalObservations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { findMedianQuickSelect } from "./findMedian";

function getConfidenceFromSampleSize(count: number) {
  if (count >= 20) return "high";
  if (count >= 5) return "medium";
  return "low";
}

async function computeVerifiedMedianObservation(
  activityCode: string,
  municipalityCode: string,
): Promise<{ amount: number; count: number } | null> {
  const currentYear = new Date().getFullYear();

  const row = await db
    .select()
    .from(pausalObservations)
    .where(
      and(
        eq(pausalObservations.activityCode, activityCode),
        eq(pausalObservations.municipalityCode, municipalityCode),
        eq(pausalObservations.year, currentYear),
        eq(pausalObservations.isVerified, true),
      ),
    );

  if (!row.length || row[0].amountMonthly === null) {
    return null;
  }

  let medianAmount: number = 0;

  if (row.length > 1) {
    const amounts = row.map((r) => Number(r.amountMonthly));
    medianAmount = findMedianQuickSelect(amounts);
  } else {
    medianAmount = Number(row[0].amountMonthly);
  }

  const amount = medianAmount;
  if (!isFinite(amount) || amount <= 0) {
    return null;
  }

  return {
    amount,
    count: row.length,
  };
}

export type PausalResolutionSource =
  | "verified"
  | "aggregate"
  | "user"
  | "unknown";

export type PausalResolution = {
  amount?: number;
  source: PausalResolutionSource;
  confidence: "high" | "medium" | "low" | "none";
  suspicious: boolean;
  warnings: string[];
  meta: {
    sampleSize?: number;
    basedOn?: string;
  };
};

const PAUSAL_SOFT_MIN = 10_000;
const PAUSAL_SOFT_MAX = 150_000;

export async function resolvePausalTax(profile: {
  activityCode?: string;
  municipality?: string;
  monthlyPausalTax?: number;
}): Promise<PausalResolution> {
  const warnings: string[] = [];

  if (!profile.activityCode || !profile.municipality) {
    warnings.push("Nedostaje šifra delatnosti ili opština.");
    return {
      source: "unknown",
      confidence: "none",
      warnings,
      suspicious: true,
      meta: {},
    };
  }

  const official = await computeVerifiedMedianObservation(
    profile.activityCode,
    profile.municipality,
  );

  let suspicious: boolean = false;

  if (official !== null) {
    suspicious =
      official.amount < PAUSAL_SOFT_MIN || official.amount > PAUSAL_SOFT_MAX;

    if (suspicious) {
      warnings.push(
        `Iznos iz baze (${official.amount.toLocaleString("sr-RS")} RSD) je van očekivanog opsega. Proverite šifru delatnosti i opštinu.`,
      );
    }

    if (official.amount > 100_000) {
      warnings.push("Iznos je izuzetno visok. Proverite da li je ispravan.");
    }

    return {
      amount: official.amount,
      source: "verified",
      // Not blocking — caller decides what to do with this flag
      suspicious,
      warnings,
      confidence: getConfidenceFromSampleSize(official.count),
      meta: {
        sampleSize: official.count,
        basedOn: "verified data",
      },
    };
  }

  if (
    profile.monthlyPausalTax !== undefined &&
    profile.monthlyPausalTax > 0 &&
    isFinite(profile.monthlyPausalTax)
  ) {
    warnings.push(
      "Koristi se vrednost koju ste uneli ručno. Preporučujemo da unesete opštinu i šifru delatnosti za tačan iznos.",
    );
    return {
      amount: profile.monthlyPausalTax,
      source: "user",
      confidence: "low",
      suspicious,
      warnings,
      meta: {
        basedOn: `${profile.monthlyPausalTax} `,
      },
    };
  }

  // Explicit: we know calculation will fail from here
  warnings.push(
    "Nemamo podatke za ovu kombinaciju opštine i šifre delatnosti. Unesite paušalni iznos ručno ili ažurirajte profil.",
  );
  return {
    source: "unknown",
    confidence: "none",
    suspicious,
    warnings,
    meta: {},
  };
}
