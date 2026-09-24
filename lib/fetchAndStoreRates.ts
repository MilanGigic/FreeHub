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
    console.log(`[FX] Fetching rate for ${code}...`);
    const res = await fetch(
      `https://kurs.resenje.org/api/v1/currencies/${code.toLowerCase()}/rates/today`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      const errTxt = await res.text();
      console.error(`[FX] Failed ${code}: ${res.status} ${errTxt}`);
      return null;
    }

    const data = (await res.json()) as KursResenjeResponse;

    console.log(`[FX] Received data for ${code}:`, data);

    if (
      typeof data.exchange_middle !== "number" ||
      Number.isNaN(data.exchange_middle)
    ) {
      console.error(`[FX] Bad payload for ${code}:`, data);
      return null;
    }

    const result = {
      code: code.toUpperCase(),
      middleRate: data.exchange_middle,
      date: data.date.slice(0, 10),
      unit: data.parity,
    };

    console.log(`[FX] Parsed result for ${code}:`, result);

    return result;
  } catch (err) {
    console.error(`[FX] Error fetching ${code}:`, err);
    return null;
  }
}

export async function fetchAndStoreRates() {
  console.log("[FX] Starting fetchAndStoreRates...");

  const results = await Promise.all(CURRENCIES.map(fetchRateFromResenje));
  console.log("[FX] Raw fetched results:", results);

  const rows = results.filter((r): r is NonNullable<typeof r> => r !== null);
  console.log(`[FX] Filtered rows to insert/update (${rows.length}):`, rows);

  if (rows.length === 0) {
    console.error("[FX] No rates fetched, throwing error.");
    throw new Error("[FX] No rates fetched");
  }

  for (const row of rows) {
    console.log(
      `[FX] Upserting rate for ${row.code} on ${row.date}: middleRate=${row.middleRate}`,
    );
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
    console.log(`[FX] Upsert complete for ${row.code} (${row.date}).`);
  }

  console.log("[FX] All rates upserted successfully.");
  return rows;
}
