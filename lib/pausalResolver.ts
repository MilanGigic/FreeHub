// ─── Pausal Tax Resolver ───────────────────────────────────────────────────────

import { db } from "@/db";
import { pausalObservations } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const PAUSAL_SOFT_MIN = 10_000;
const PAUSAL_SOFT_MAX = 150_000;

async function lookupPausalFromDB(
  activityCode: string,
  municipalityCode: string,
): Promise<{ amount: number; suspicious: boolean; count: number } | null> {
  const currentYear = new Date().getFullYear();

  console.log(
    `[lookupPausalFromDB] Called with activityCode=${activityCode}, municipalityCode=${municipalityCode}, currentYear=${currentYear}`,
  );

  const row = await db
    .select()
    .from(pausalObservations)
    .where(
      and(
        eq(pausalObservations.activityCode, activityCode),
        eq(pausalObservations.municipalityCode, municipalityCode),
        eq(pausalObservations.year, currentYear),
      ),
    );

  console.log(`[lookupPausalFromDB] Queried rows:`, row);

  if (!row.length || row[0].amountMonthly === null) {
    console.log(`[lookupPausalFromDB] No rows found or amountMonthly is null`);
    return null;
  }

  let medianAmount: number = 0;

  if (row.length >= 1) {
    const sorted = row.sort(
      (a, b) => Number(a.amountMonthly) - Number(b.amountMonthly),
    );
    const mid = Math.floor(sorted.length / 2);

    medianAmount = mid;
    console.log(
      `[lookupPausalFromDB] Calculated median index: mid=${mid}, medianAmount=${medianAmount}, sorted=`,
      sorted,
    );
  } else {
    const median = row[0].amountMonthly;

    medianAmount = Number(median);
    console.log(
      `[lookupPausalFromDB] Only one row, medianAmount=${medianAmount}`,
    );
  }

  const amount = medianAmount;
  console.log(`[lookupPausalFromDB] Final amount: ${amount}`);
  if (!isFinite(amount) || amount <= 0) {
    console.log(`[lookupPausalFromDB] Amount is not finite or <= 0: ${amount}`);
    return null;
  }

  const suspicious = amount < PAUSAL_SOFT_MIN || amount > PAUSAL_SOFT_MAX;
  console.log(
    `[lookupPausalFromDB] Suspicious: ${suspicious}, Count: ${row.length}`,
  );

  return {
    amount,
    suspicious,
    count: row.length,
  };
}

export type PausalResolutionSource = "official" | "user" | "unknown";

type PausalResolution = {
  amount?: number;
  source: "verified" | "official" | "aggregate" | "user" | "unknown";
  confidence: "high" | "medium" | "low" | "none";
  suspicious: boolean;
  warnings: string[];
  meta: {
    sampleSize?: number;
    basedOn?: string;
  };
};

export async function resolvePausalTax(profile: {
  activityCode?: string;
  municipality?: string;
  monthlyPausalTax?: number;
}): Promise<PausalResolution> {
  console.log(`[resolvePausalTax] Called with profile:`, profile);

  const warnings: string[] = [];

  if (!profile.activityCode || !profile.municipality) {
    warnings.push("Nedostaje šifra delatnosti ili opština.");
    console.log(
      `[resolvePausalTax] Missing activityCode or municipality. Returning unknown.`,
    );
    return {
      source: "unknown",
      confidence: "none",
      warnings,
      suspicious: true,
      meta: {},
    };
  }

  const official = await lookupPausalFromDB(
    profile.activityCode,
    profile.municipality,
  );

  console.log(`[resolvePausalTax] Official DB result:`, official);

  if (official !== null) {
    if (official.suspicious) {
      warnings.push(
        `Iznos iz baze (${official.amount.toLocaleString("sr-RS")} RSD) je van očekivanog opsega. Proverite šifru delatnosti i opštinu.`,
      );
      console.log(`[resolvePausalTax] Warning: Amount out of expected range.`);
    }

    if (official.amount > 100_000) {
      warnings.push("Iznos je izuzetno visok. Proverite da li je ispravan.");
      console.log(`[resolvePausalTax] Warning: Amount is extremely high.`);
    }

    if (!profile.municipality) {
      warnings.push("Opština nije definisana.");
      console.log(`[resolvePausalTax] Warning: Municipality not defined.`);
    }

    console.log(`[resolvePausalTax] Returning result with verified source.`);

    return {
      amount: official.amount,
      source: "verified",
      // Not blocking — caller decides what to do with this flag
      suspicious: false,
      warnings: [],
      confidence: "high",
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
    console.log(
      `[resolvePausalTax] Using user-provided monthlyPausalTax: ${profile.monthlyPausalTax}`,
    );
    return {
      amount: profile.monthlyPausalTax,
      source: "user",
      confidence: "low",
      suspicious: true,
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
  console.log(
    `[resolvePausalTax] No data found for combination. Returning unknown.`,
  );
  return {
    source: "unknown",
    confidence: "none",
    suspicious: true,
    warnings,
    meta: {},
  };
}
