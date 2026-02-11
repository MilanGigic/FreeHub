import { pgTable, text, timestamp, uuid, decimal, boolean, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").unique().notNull(),
  userName: text("user_name").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  encryptedDEK: text("encrypted_dek").notNull(), // Data Encryption Key encrypted with password-derived key
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Transaction type enum
export const transactionTypeEnum = pgEnum("transaction_type", ["income", "expense"]);

// Transactions table - tracks both income and expenses
export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: transactionTypeEnum("type").notNull(), // "income" or "expense"
  title: text("title").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
  description: text("description"),
  date: timestamp("date").notNull().defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Categories table - for organizing transactions
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: transactionTypeEnum("type").notNull(), // "income" or "expense"
  color: text("color"), // Optional: for UI color coding
  icon: text("icon"), // Optional: for UI icons
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tax settings table - stores tax rates and settings per user
export const taxSettings = pgTable("tax_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  federalTaxRate: decimal("federal_tax_rate", { precision: 5, scale: 2 }).default("0"), // e.g., 22.00 for 22%
  stateTaxRate: decimal("state_tax_rate", { precision: 5, scale: 2 }).default("0"),
  localTaxRate: decimal("local_tax_rate", { precision: 5, scale: 2 }).default("0"),
  socialSecurityRate: decimal("social_security_rate", { precision: 5, scale: 2 }).default("6.2"), // Default 6.2%
  medicareRate: decimal("medicare_rate", { precision: 5, scale: 2 }).default("1.45"), // Default 1.45%
  taxYear: text("tax_year").notNull().default("2026"), // For tracking different tax years
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Budgets table - optional: for setting spending limits
export const budgets = pgTable("budgets", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").references(() => categories.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  period: text("period").notNull().default("monthly"), // "monthly", "yearly", etc.
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  transactions: many(transactions),
  categories: many(categories),
  taxSettings: one(taxSettings),
  budgets: many(budgets),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
  budgets: many(budgets),
}));

export const taxSettingsRelations = relations(taxSettings, ({ one }) => ({
  user: one(users, {
    fields: [taxSettings.userId],
    references: [users.id],
  }),
}));

export const budgetsRelations = relations(budgets, ({ one }) => ({
  user: one(users, {
    fields: [budgets.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [budgets.categoryId],
    references: [categories.id],
  }),
}));
