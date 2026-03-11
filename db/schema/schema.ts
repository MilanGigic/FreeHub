import {
  pgTable,
  text,
  timestamp,
  uuid,
  decimal,
  pgEnum,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const currencyEnum = pgEnum("currency", [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "RSD",
  "CAD",
]);

export const clientStatusEnum = pgEnum("client_status", [
  "active",
  "paused",
  "archived",
]);

export const projectStatusEnum = pgEnum("project_status", [
  "active",
  "in_progress",
  "completed",
  "cancelled",
  "on_hold",
  "not_started",
]);

export const projectFinanceTypeEnum = pgEnum("project_finance_type", [
  "income",
  "expense",
]);

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "draft",
  "overdue",
  "sent",
  "paid",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").unique().notNull(),
  userName: text("user_name").notNull().unique(),
  country: text("country").notNull(),
  passwordHash: text("password_hash").notNull(),
  encryptedDEK: text("encrypted_dek").notNull(), // Data Encryption Key encrypted with password-derived key
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const taxProfiles = pgTable("tax_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  entityType: text("entity_type"),
  filingStatus: text("filing_status"),
  stateResidence: text("state_residence"),
  homeOfficeSqft: integer("home_office_sqft"),
  homeOfficeSimplified: boolean("home_office_simplified"),
  mileageTracking: boolean("mileage_tracking"),
  healthInsuranceDeduction: boolean("health_insurance_deduction"),
  retirementContribution: boolean("retirement_contribution"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const clients = pgTable("clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").unique().notNull(),
  currency: currencyEnum("currency").notNull().default("USD"),
  status: clientStatusEnum("status").notNull().default("active"),
  startDate: timestamp("start_date").notNull().defaultNow(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  totalRevenue: decimal("total_revenue", { precision: 12, scale: 2 }).default(
    "0",
  ),
  totalExpenses: decimal("total_expenses", { precision: 12, scale: 2 }).default(
    "0",
  ),
  totalProfit: decimal("total_profit", { precision: 12, scale: 2 }).default(
    "0",
  ),
  totalMargin: decimal("total_margin", { precision: 12, scale: 2 }).default(
    "0",
  ),
  totalHoursWorked: integer("total_hours_worked").default(0),
  status: projectStatusEnum("status").notNull().default("not_started"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projectCalendar = pgTable("project_calendar", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull().defaultNow(),
  note: text("note").notNull(),
  hoursWorked: integer("hours_worked").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projectFinance = pgTable("project_finance", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  type: projectFinanceTypeEnum("type").notNull().default("income"),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  note: text("note").notNull().default(""),
  hourlyRate: decimal("hourly_rate", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const invoices = pgTable("invoices", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  issueDate: timestamp("issue_date").notNull().defaultNow(),
  dueDate: timestamp("due_date").notNull(),
  paymentDate: timestamp("payment_date"),
  paidAfter: text("paid_after"),
  status: invoiceStatusEnum("status").notNull().default("draft"),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  paidAmount: decimal("paid_amount", { precision: 12, scale: 2 }),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: projectFinanceTypeEnum("type").notNull().default("income"),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  deductible: boolean("deductible").notNull().default(false),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const conservativenessEnum = pgEnum("conservativeness", [
  "conservative",
  "moderate",
  "aggressive",
]);

export const goals = pgTable("goals", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  targetAmount: decimal("target_amount", { precision: 12, scale: 2 }).notNull(),
  deadline: timestamp("deadline"),
  conservativeness: conservativenessEnum("conservativeness")
    .default("moderate")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const clientRelations = relations(clients, ({ many }) => ({
  projects: many(projects),
}));

export const projectRelations = relations(projects, ({ one }) => ({
  client: one(clients, {
    fields: [projects.clientId],
    references: [clients.id],
  }),
}));
