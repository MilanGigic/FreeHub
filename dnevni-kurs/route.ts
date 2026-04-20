/**
 * POST /api/cron/exchange-rates
 *
 * Scheduled at 08:00 AM every day (see vercel.json).
 * Also runs a second time at 16:00 to pick up the next-day list
 * that NBS publishes ~14:00–15:00 on working days.
 *
 * Secured by CRON_SECRET (set in Vercel env vars).
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchTodayRates, fetchTomorrowRates } from "@/lib/nbs-client";
import {
  upsertRates,
  forwardFillDate,
  isWeekend,
} from "@/lib/exchange-rate-service";

// ─── Auth ─────────────────────────────────────────────────────────────────────

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[cron] CRON_SECRET env var is not set!");
    return false;
  }
  // Vercel passes the secret as a Bearer token in Authorization header
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now       = new Date();
  const todayStr  = now.toISOString().slice(0, 10);
  const tomorrowStr = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
  const hour      = now.getUTCHours(); // adjust for Serbia (UTC+2) if needed

  const log: string[] = [];
  const errors: string[] = [];

  // ── Step 1: Today's rate ──────────────────────────────────────────────────
  if (isWeekend(todayStr)) {
    log.push(`[${todayStr}] Weekend detected — forward-filling from last workday.`);
    const fillResult = await forwardFillDate(todayStr);
    log.push(`  Forward-filled: ${fillResult.inserted} currencies. Skipped: ${fillResult.skipped}.`);
    if (fillResult.errors.length) errors.push(...fillResult.errors);
  } else {
    log.push(`[${todayStr}] Fetching today's NBS rate list…`);
    const todayResult = await fetchTodayRates();

    if (todayResult.success) {
      const upsert = await upsertRates(todayResult.rates, todayStr);
      log.push(`  Fetched ${todayResult.rates.length} currencies from NBS (list date: ${todayResult.listDate}).`);
      log.push(`  DB: inserted=${upsert.inserted} updated=${upsert.updated} skipped=${upsert.skipped}`);
      if (upsert.errors.length) errors.push(...upsert.errors);
    } else {
      // NBS failed — forward-fill as emergency fallback
      log.push(`  NBS fetch FAILED: ${todayResult.error}`);
      log.push(`  Attempting emergency forward-fill…`);
      const fillResult = await forwardFillDate(todayStr);
      log.push(`  Emergency fill: ${fillResult.inserted} currencies.`);
      errors.push(`NBS unavailable for ${todayStr}: ${todayResult.error}`);
      if (fillResult.errors.length) errors.push(...fillResult.errors);
    }
  }

  // ── Step 2: Tomorrow's rate (only in the 16:00 run) ──────────────────────
  // NBS publishes tomorrow's list ~14:00. We check at 16:00 (UTC+2 = 14:00 UTC).
  if (hour >= 14) {
    log.push(`[${tomorrowStr}] 16:00 run — checking if tomorrow's NBS list is available…`);

    if (isWeekend(tomorrowStr)) {
      log.push(`  Tomorrow is a weekend — forward-filling.`);
      const fillResult = await forwardFillDate(tomorrowStr);
      log.push(`  Forward-filled: ${fillResult.inserted} currencies.`);
      if (fillResult.errors.length) errors.push(...fillResult.errors);
    } else {
      const tomorrowResult = await fetchTomorrowRates();
      if (tomorrowResult.success) {
        const upsert = await upsertRates(tomorrowResult.rates, tomorrowStr);
        log.push(`  Tomorrow's list IS available (list date: ${tomorrowResult.listDate}).`);
        log.push(`  DB: inserted=${upsert.inserted} updated=${upsert.updated} skipped=${upsert.skipped}`);
        if (upsert.errors.length) errors.push(...upsert.errors);
      } else {
        log.push(`  Tomorrow's list not yet available: ${tomorrowResult.error}`);
      }
    }
  }

  const status = errors.length === 0 ? "ok" : "partial";
  console.log(`[cron/exchange-rates] ${status}:\n${log.join("\n")}`);

  return NextResponse.json({
    status,
    timestamp: now.toISOString(),
    log,
    errors: errors.length > 0 ? errors : undefined,
  });
}

// Vercel cron jobs only use GET — provide a GET alias
export { POST as GET };
