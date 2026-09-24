import { db } from "@/db";
import { dailyExchangeRates } from "@/db/schema";

const CURRENCIES = ["EUR", "USD", "GBP", "CHF"] as const;

type KursResenjeResponse = {
  code: string;
  date: string;
  date_from: string;
  number?: number;
  parity: number;
  cash_buy: number;
  cash_sell: number;
  exchange_buy: number;
  exchange_middle: number;
  exchange_sell: number;
};

async function fetchRateFromResenje(code: string) {
  try {
    const res = await fetch(
      `https://kurs.resenje.org/api/v1/currencies/${code.toLowerCase()}/rates/today`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      console.error(`[FX] Failed ${code}: ${res.status} ${await res.text()}`);
      return null;
    }

    const data = (await res.json()) as KursResenjeResponse;

    if (
      typeof data.exchange_middle !== "number" ||
      Number.isNaN(data.exchange_middle)
    ) {
      console.error(`[FX] Bad payload for ${code}:`, data);
      return null;
    }

    return {
      code: code.toUpperCase(),
      middleRate: data.exchange_middle,
      date: data.date.slice(0, 10),
      unit: data.parity,
    };
  } catch (err) {
    console.error(`[FX] Error fetching ${code}:`, err);
    return null;
  }
}

export async function fetchAndStoreRates() {
  const results = await Promise.all(CURRENCIES.map(fetchRateFromResenje));
  const rows = results.filter((r): r is NonNullable<typeof r> => r !== null);

  if (rows.length === 0) {
    throw new Error("[FX] No rates fetched");
  }

  for (const row of rows) {
    await db
      .insert(dailyExchangeRates)
      .values({
        date: row.date,
        currencyCode: row.code,
        middleRate: String(row.middleRate),
        source: "NBS",
      })
      .onConflictDoUpdate({
        target: [dailyExchangeRates.date, dailyExchangeRates.currencyCode],
        set: {
          middleRate: String(row.middleRate),
          updatedAt: new Date(),
        },
      });
  }

  return rows;
}
