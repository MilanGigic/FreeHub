import { TaxParameterValue } from "@/types/types";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const countryEnum = pgEnum("country_enum", ["RS", "US"]);

export const taxYears = pgTable(
  "tax_years",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    country: countryEnum("country").notNull(),
    year: integer("year").notNull(), // 2026, 2027...
    isCurrent: boolean("is_current").notNull(),
  },
  (table) => ({
    yearCountryUnique: uniqueIndex("tax_years_year_country_idx").on(
      table.country,
      table.year,
    ),
  }),
);

export const taxParameters = pgTable(
  "tax_parameters",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    taxYearId: uuid("tax_year_id").references(() => taxYears.id, {
      onDelete: "cascade",
    }),
    key: varchar("key", { length: 256 }).notNull(), // e.g. 'non_taxable_monthly', 'pio_rate'...
    value: jsonb("value").$type<TaxParameterValue>().notNull(),
    description: text("description"),
  },
  (table) => ({
    keyUnique: uniqueIndex("tax_parameters_key_idx").on(table.key),
  }),
);
