import { db } from "@/db";
import { dailyExchangeRates } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const CURRENCIES = ["EUR", "USD", "GBP", "CHF"] as const;

type KursResenjeResponse = {
  code: string;
  date: string;
  dateFrom: string;
  number?: number;
  parity: number;
  cashBuy: number;
  cashSell: number;
  exchangeBuy: number;
  exchangeMiddle: number;
  exchangeSell: number;
};

async function fetchRateFromResenje(code: string): Promise<{
  code: string;
  middleRate: number;
  date: string; // YYYY-MM-DD
  unit: number;
} | null> {
  const res = await fetch(
    `https://kurs.resenje.org/api/v1/currencies/${code.toLowerCase()}/rates/today`,
    { next: { revalidate: 0 } }, // or cache: "no-store"
  );

  if (!res.ok) {
    console.error(`[FX] Failed ${code}: ${res.status}`);
    return null;
  }

  const data = (await res.json()) as KursResenjeResponse;

  // Adjust these fields to match the real API response once you log it
  const rateDate =
    data.date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10);

  if (!data.exchangeMiddle || Number.isNaN(data.exchangeMiddle)) return null;

  return {
    code: code.toUpperCase(),
    middleRate: data.exchangeMiddle,
    date: rateDate,
    unit: data.parity,
  };
}

export async function fetchAndStoreRates(date?: string) {
  // date optional – for "today" most wrappers just return latest
  const results = await Promise.all(
    CURRENCIES.map((code) => fetchRateFromResenje(code)),
  );

  const rows = results.filter(Boolean) as NonNullable<
    (typeof results)[number]
  >[];

  if (rows.length === 0) {
    throw new Error("[FX] No rates fetched");
  }

  for (const row of rows) {
    await db
      .insert(dailyExchangeRates)
      .values({
        date: date!,
        currencyCode: row.code,
        middleRate: String(row.middleRate), // if numeric column as string
        source: "nbs", // or "kurs.resenje.org"
        createdAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [dailyExchangeRates.date, dailyExchangeRates.currencyCode],
        set: {
          middleRate: String(row.middleRate),
          createdAt: new Date(),
        },
      });
  }

  return rows;
}
