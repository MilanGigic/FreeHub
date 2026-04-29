// ─── Pausal Tax Resolver ───────────────────────────────────────────────────────

import { db } from "@/db";
import { pausalRates } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const PAUSAL_SOFT_MIN = 10_000;
const PAUSAL_SOFT_MAX = 150_000;

async function lookupPausalFromDB(
  activityCode: string,
  municipalityCode: string,
): Promise<{ amount: number; suspicious: boolean } | null> {
  const currentYear = new Date().getFullYear();

  const row = await db
    .select({ totalMonthly: pausalRates.totalMonthly })
    .from(pausalRates)
    .where(
      and(
        eq(pausalRates.activityCode, activityCode),
        eq(pausalRates.municipalityCode, municipalityCode),
        eq(pausalRates.year, currentYear),
      ),
    )
    .limit(1);

  if (!row.length || row[0].totalMonthly === null) return null;

  const amount = Number(row[0].totalMonthly);
  if (!isFinite(amount) || amount <= 0) return null;

  return {
    amount,
    suspicious: amount < PAUSAL_SOFT_MIN || amount > PAUSAL_SOFT_MAX,
  };
}

export type PausalResolutionSource = "official" | "user" | "unknown";

interface PausalResolution {
  amount?: number;
  source: PausalResolutionSource;
  warning?: string;
  suspicious?: boolean; // soft bounds flag, official source only
}

export async function resolvePausalTax(profile: {
  activityCode?: string;
  municipality?: string;
  monthlyPausalTax?: number;
}): Promise<PausalResolution> {
  if (profile.activityCode && profile.municipality) {
    const official = await lookupPausalFromDB(
      profile.activityCode,
      profile.municipality,
    );
    if (official !== null) {
      return {
        amount: official.amount,
        source: "official",
        // Not blocking — caller decides what to do with this flag
        suspicious: official.suspicious,
        warning: official.suspicious
          ? `Iznos iz baze (${official.amount.toLocaleString("sr-RS")} RSD) je van očekivanog opsega. Proverite šifru delatnosti i opštinu.`
          : undefined,
      };
    }
  }

  if (
    profile.monthlyPausalTax !== undefined &&
    profile.monthlyPausalTax > 0 &&
    isFinite(profile.monthlyPausalTax)
  ) {
    return {
      amount: profile.monthlyPausalTax,
      source: "user",
      warning:
        "Koristi se vrednost koju ste uneli ručno. Preporučujemo da unesete opštinu i šifru delatnosti za tačan iznos.",
    };
  }

  // Explicit: we know calculation will fail from here
  return {
    source: "unknown",
    warning:
      "Nemamo podatke za ovu kombinaciju opštine i šifre delatnosti. Unesite paušalni iznos ručno ili ažurirajte profil.",
  };
}
