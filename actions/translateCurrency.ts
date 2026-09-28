"use server";

import { db } from "@/db";
import { dailyExchangeRates } from "@/db/schema";
import { and, desc, inArray, lte } from "drizzle-orm";

export type RsdRates = Record<string, number>; // e.g. { USD: 1, EUR: 0.92, RSD: 108.5 }

export async function getRates(
  codes: string[],
  asOf: Date = new Date(),
): Promise<RsdRates> {
  const wanted = [...new Set(codes)].filter((c) => c !== "RSD");
  const rates: RsdRates = { RSD: 1 }; // RSD has no row; it is the base

  if (wanted.length === 0) return rates;

  const rows = await db
    .select()
    .from(dailyExchangeRates)
    .where(
      and(
        inArray(dailyExchangeRates.currencyCode, wanted),
        lte(dailyExchangeRates.date, asOf.toISOString().slice(0, 10)),
      ),
    )
    .orderBy(desc(dailyExchangeRates.date));

  for (const row of rows) {
    // rows are newest-first, so the first one seen per currency wins
    if (!(row.currencyCode in rates)) {
      rates[row.currencyCode] = Number(row.middleRate); // numeric comes back as string
    }
  }

  for (const code of wanted) {
    if (!(code in rates)) throw new Error(`No NBS rate found for ${code}`);
  }
  return rates;
}
