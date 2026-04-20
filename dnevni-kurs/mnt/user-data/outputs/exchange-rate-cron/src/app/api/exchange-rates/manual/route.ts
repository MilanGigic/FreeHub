/**
 * POST /api/exchange-rates/manual
 *
 * Allows the user to manually enter an exchange rate when the NBS API
 * is unavailable. The rate is stored with isVerified=false so accountants
 * know it was not fetched automatically.
 *
 * Body: { date: "YYYY-MM-DD", currency: "USD", middleRate: 108.45 }
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { dailyExchangeRates } from "@/db/schema/exchange-rates";
import { TRACKED_CURRENCIES } from "@/lib/exchange-rate-service";

const ManualRateSchema = z.object({
  date:       z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  currency:   z.string().length(3).toUpperCase(),
  middleRate: z.number().positive("Rate must be positive"),
});

export async function POST(req: NextRequest) {
  // TODO: add your own session/auth guard here
  // const session = await getServerSession(authOptions);
  // if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ManualRateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { date, currency, middleRate } = parsed.data;

  if (!TRACKED_CURRENCIES.includes(currency)) {
    return NextResponse.json(
      { error: `Currency ${currency} is not tracked. Allowed: ${TRACKED_CURRENCIES.join(", ")}` },
      { status: 422 },
    );
  }

  try {
    const [row] = await db
      .insert(dailyExchangeRates)
      .values({
        date,
        currency,
        middleRate:      String(middleRate),
        buyingRate:      String(middleRate),   // user only enters middle rate
        sellingRate:     String(middleRate),
        isVerified:      false,
        isForwardFilled: false,
        fetchedAt:       new Date(),
      })
      .onConflictDoUpdate({
        target: [dailyExchangeRates.date, dailyExchangeRates.currency],
        set: {
          middleRate:  String(middleRate),
          isVerified:  false,
          fetchedAt:   new Date(),
        },
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Rate saved. Note: manually entered rates are marked as unverified.",
      rate: {
        date:       row.date,
        currency:   row.currency,
        middleRate: row.middleRate,
        isVerified: row.isVerified,
      },
    });
  } catch (err) {
    console.error("[manual-rate] DB error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

/**
 * GET /api/exchange-rates/manual?date=YYYY-MM-DD&currency=USD
 *
 * Quick lookup — used by the transaction form to show the current rate.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date     = searchParams.get("date");
  const currency = searchParams.get("currency")?.toUpperCase();

  if (!date || !currency) {
    return NextResponse.json({ error: "date and currency are required" }, { status: 400 });
  }

  const { getRateForDate } = await import("@/lib/exchange-rate-service");
  const rate = await getRateForDate(date, currency);

  if (!rate) {
    return NextResponse.json(
      {
        found: false,
        message: `No rate found for ${currency} on ${date}. Please enter it manually.`,
        nbsUrl: "https://www.nbs.rs/sr_Latn/finansijske_institucije/medjunarodne_finansije/kursna_lista/",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    found:           true,
    date,
    currency,
    middleRate:      rate.middleRate,
    isVerified:      !rate.isForwardFilled,
    isForwardFilled: rate.isForwardFilled,
    sourceDate:      rate.sourceDate,
  });
}
