/**
 * Exchange Rate Service
 *
 * Handles:
 *  1. Upserting NBS rates into the DB
 *  2. Forward-filling weekends & holidays (copy last known working-day rate)
 *  3. Querying the correct rate for a given date (used when logging transactions)
 */

import { db } from "@/db";
import { dailyExchangeRates, type NewDailyExchangeRate } from "@/db/schema/exchange-rates";
import { eq, and, lte, desc, sql } from "drizzle-orm";
import { type NbsRate } from "./nbs-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UpsertResult {
  inserted: number;
  updated:  number;
  skipped:  number;
  errors:   string[];
}

// ─── Currencies your app cares about ─────────────────────────────────────────
// You can extend this list. Only these will be persisted.
export const TRACKED_CURRENCIES = ["USD", "EUR", "GBP", "CHF", "CAD", "AUD", "JPY", "NOK", "SEK", "DKK"];

// ─── Core Upsert ──────────────────────────────────────────────────────────────

/**
 * Upsert NBS rates for a given date.
 * On conflict (same date + currency), we only update if the incoming value differs
 * and the row isn't already verified by a later fetch.
 */
export async function upsertRates(
  rates:      NbsRate[],
  targetDate: string,            // YYYY-MM-DD — the date these rates are VALID FOR
  isForwardFilled = false,
): Promise<UpsertResult> {
  const result: UpsertResult = { inserted: 0, updated: 0, skipped: 0, errors: [] };

  const relevant = rates.filter((r) => TRACKED_CURRENCIES.includes(r.currency));

  for (const rate of relevant) {
    try {
      const row: NewDailyExchangeRate = {
        date:            targetDate,
        currency:        rate.currency,
        middleRate:      String(rate.middleRate),
        buyingRate:      String(rate.buyingRate),
        sellingRate:     String(rate.sellingRate),
        isVerified:      !isForwardFilled,
        isForwardFilled: isForwardFilled,
        sourceDate:      rate.listDate || null,
        fetchedAt:       new Date(),
      };

      // Drizzle upsert: on conflict (date, currency) update the rate fields
      const res = await db
        .insert(dailyExchangeRates)
        .values(row)
        .onConflictDoUpdate({
          target:  [dailyExchangeRates.date, dailyExchangeRates.currency],
          set: {
            middleRate:      row.middleRate,
            buyingRate:      row.buyingRate,
            sellingRate:     row.sellingRate,
            isVerified:      row.isVerified,
            isForwardFilled: row.isForwardFilled,
            sourceDate:      row.sourceDate,
            fetchedAt:       row.fetchedAt,
          },
        })
        .returning({ id: dailyExchangeRates.id });

      if (res.length > 0) result.inserted++;
    } catch (err) {
      result.errors.push(`${rate.currency}: ${String(err)}`);
    }
  }

  return result;
}

// ─── Forward Fill ─────────────────────────────────────────────────────────────

/**
 * For a given target date (weekend / holiday), find the last available rate
 * for each tracked currency and insert it as a forward-filled copy.
 *
 * This ensures every date has a row so JOIN queries never miss.
 */
export async function forwardFillDate(targetDate: string): Promise<UpsertResult> {
  const result: UpsertResult = { inserted: 0, updated: 0, skipped: 0, errors: [] };

  for (const currency of TRACKED_CURRENCIES) {
    try {
      // Find the most recent verified rate BEFORE targetDate
      const [lastKnown] = await db
        .select()
        .from(dailyExchangeRates)
        .where(
          and(
            eq(dailyExchangeRates.currency, currency),
            lte(dailyExchangeRates.date, targetDate),
            eq(dailyExchangeRates.isVerified, true),
          )
        )
        .orderBy(desc(dailyExchangeRates.date))
        .limit(1);

      if (!lastKnown) {
        result.skipped++;
        continue;
      }

      await db
        .insert(dailyExchangeRates)
        .values({
          date:            targetDate,
          currency:        currency,
          middleRate:      lastKnown.middleRate,
          buyingRate:      lastKnown.buyingRate,
          sellingRate:     lastKnown.sellingRate,
          isVerified:      false,           // not directly from NBS for this date
          isForwardFilled: true,
          sourceDate:      lastKnown.date,  // original NBS list date
          fetchedAt:       new Date(),
        })
        .onConflictDoUpdate({
          target: [dailyExchangeRates.date, dailyExchangeRates.currency],
          set: {
            // Only fill if not already verified (don't overwrite real data)
            isForwardFilled: sql`CASE WHEN ${dailyExchangeRates.isVerified} = false THEN true ELSE ${dailyExchangeRates.isForwardFilled} END`,
          },
        });

      result.inserted++;
    } catch (err) {
      result.errors.push(`forward-fill ${currency} for ${targetDate}: ${String(err)}`);
    }
  }

  return result;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns true if the given date is a Saturday or Sunday.
 */
export function isWeekend(dateStr: string): boolean {
  const d   = new Date(dateStr);
  const day = d.getDay(); // 0=Sun, 6=Sat
  return day === 0 || day === 6;
}

/**
 * Get the most accurate middle rate for a given date and currency.
 * Falls back to the nearest earlier date if no row exists (safety net).
 */
export async function getRateForDate(
  date:     string,
  currency: string,
): Promise<{ middleRate: number; isForwardFilled: boolean; sourceDate: string | null } | null> {
  const [row] = await db
    .select({
      middleRate:      dailyExchangeRates.middleRate,
      isForwardFilled: dailyExchangeRates.isForwardFilled,
      sourceDate:      dailyExchangeRates.sourceDate,
    })
    .from(dailyExchangeRates)
    .where(
      and(
        lte(dailyExchangeRates.date, date),
        eq(dailyExchangeRates.currency, currency),
      )
    )
    .orderBy(desc(dailyExchangeRates.date))
    .limit(1);

  if (!row) return null;

  return {
    middleRate:      parseFloat(String(row.middleRate)),
    isForwardFilled: row.isForwardFilled,
    sourceDate:      row.sourceDate,
  };
}
