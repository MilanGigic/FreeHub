-- Migration: create daily_exchange_rates table
-- Run via: npx drizzle-kit push  OR  add to your migrations folder

CREATE TABLE IF NOT EXISTS "daily_exchange_rates" (
  "id"               SERIAL PRIMARY KEY,
  "date"             DATE          NOT NULL,
  "currency"         VARCHAR(3)    NOT NULL,
  "middle_rate"      NUMERIC(18,6) NOT NULL,
  "buying_rate"      NUMERIC(18,6),
  "selling_rate"     NUMERIC(18,6),
  "is_verified"      BOOLEAN       NOT NULL DEFAULT false,
  "is_forward_filled" BOOLEAN      NOT NULL DEFAULT false,
  "source_date"      DATE,
  "fetched_at"       TIMESTAMPTZ,
  "created_at"       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  CONSTRAINT "uq_daily_exchange_rates_date_currency" UNIQUE ("date", "currency")
);

CREATE INDEX IF NOT EXISTS "idx_exchange_rates_date"     ON "daily_exchange_rates" ("date");
CREATE INDEX IF NOT EXISTS "idx_exchange_rates_currency" ON "daily_exchange_rates" ("currency");

-- Helpful comment for future devs
COMMENT ON TABLE "daily_exchange_rates" IS
  'NBS middle exchange rates per day. Weekends/holidays are forward-filled from the last working day. '
  'Only middle_rate is used for Serbian tax calculations (Zakon o PDV, čl. 35).';

COMMENT ON COLUMN "daily_exchange_rates"."is_verified" IS
  'true = fetched directly from NBS SOAP API. false = manually entered or forward-filled.';

COMMENT ON COLUMN "daily_exchange_rates"."is_forward_filled" IS
  'true = this row was copied from a previous working day (weekend/holiday gap fill).';

COMMENT ON COLUMN "daily_exchange_rates"."source_date" IS
  'The actual NBS list date this rate originated from. Differs from date on forward-filled rows.';
