// drizzle/seed/exchangeRates.ts

import { db } from "@/db";
import { dailyExchangeRates } from "@/db/schema";

async function seedExchangeRates() {
  const today = "2026-05-07";

  await db.insert(dailyExchangeRates).values([
    // ─── Core currencies ─────────────────────────────────────

    {
      date: today,
      currencyCode: "EUR",
      middleRate: "117.3825",
      source: "NBS",
    },
    {
      date: today,
      currencyCode: "USD",
      middleRate: "100.4987",
      source: "NBS",
    },
    {
      date: today,
      currencyCode: "CHF",
      middleRate: "128.0630",
      source: "NBS",
    },
    {
      date: today,
      currencyCode: "GBP",
      middleRate: "135.0524",
      source: "NBS",
    },

    // ─── Popular contractor/business currencies ─────────────

    {
      date: today,
      currencyCode: "CAD",
      middleRate: "72.7837",
      source: "NBS",
    },
    {
      date: today,
      currencyCode: "AUD",
      middleRate: "71.3937",
      source: "NBS",
    },
    {
      date: today,
      currencyCode: "SEK",
      middleRate: "10.8311",
      source: "NBS",
    },
    {
      date: today,
      currencyCode: "NOK",
      middleRate: "10.5444",
      source: "NBS",
    },
    {
      date: today,
      currencyCode: "DKK",
      middleRate: "15.7039",
      source: "NBS",
    },

    // ─── Regional currencies ─────────────────────────────────

    {
      date: today,
      currencyCode: "BAM",
      middleRate: "60.0124",
      source: "NBS",
    },
    {
      date: today,
      currencyCode: "MKD",
      middleRate: "1.8587",
      source: "NBS",
    },
    {
      date: today,
      currencyCode: "RON",
      middleRate: "23.0493",
      source: "NBS",
    },
    {
      date: today,
      currencyCode: "HUF",
      middleRate: "0.3225",
      source: "NBS",
    },
    {
      date: today,
      currencyCode: "CZK",
      middleRate: "4.8175",
      source: "NBS",
    },
    {
      date: today,
      currencyCode: "PLN",
      middleRate: "27.6715",
      source: "NBS",
    },

    // ─── Global/international payment relevance ─────────────

    {
      date: today,
      currencyCode: "CNY",
      middleRate: "14.5971",
      source: "NBS",
    },
    {
      date: today,
      currencyCode: "JPY",
      middleRate: "0.6259",
      source: "NBS",
    },
    {
      date: today,
      currencyCode: "AED",
      middleRate: "27.0928",
      source: "NBS",
    },
    {
      date: today,
      currencyCode: "TRY",
      middleRate: "2.2242",
      source: "NBS",
    },
    {
      date: today,
      currencyCode: "RUB",
      middleRate: "1.3203",
      source: "NBS",
    },
  ]);

  console.log("Exchange rates seeded.");
}

seedExchangeRates()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
