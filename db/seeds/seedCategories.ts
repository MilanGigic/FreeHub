"use server";

import { and, eq } from "drizzle-orm";
import { db } from "..";
import { categories } from "../schema";

const incomes = [
  { name: "Salary", type: "income", color: "#4CAF50", icon: "💰" },
  { name: "Freelance", type: "income", color: "#2196F3", icon: "🖋️" },
  { name: "Bonus", type: "income", color: "#FFC107", icon: "🎁" },
  { name: "Investment Income", type: "income", color: "#3F51B5", icon: "📈" },
  { name: "Gift", type: "income", color: "#FF9800", icon: "🎉" },
  {
    name: "Refund / Reimbursement",
    type: "income",
    color: "#9C27B0",
    icon: "💸",
  },
  { name: "Royalties", type: "income", color: "#00BCD4", icon: "🎵" },
  { name: "Interest Income", type: "income", color: "#8BC34A", icon: "🏦" },
  { name: "Dividends", type: "income", color: "#673AB7", icon: "💹" },
  { name: "Side Projects", type: "income", color: "#FF5722", icon: "🛠️" },
];

const expenses = [
  { name: "Rent", type: "expense", color: "#F44336", icon: "🏠" },
  { name: "Groceries", type: "expense", color: "#FF9800", icon: "🛒" },
  { name: "Utilities", type: "expense", color: "#9C27B0", icon: "💡" },
  { name: "Transport", type: "expense", color: "#3F51B5", icon: "🚗" },
  { name: "Insurance", type: "expense", color: "#2196F3", icon: "🛡️" },
  { name: "Subscriptions", type: "expense", color: "#00BCD4", icon: "📺" },
  { name: "Healthcare", type: "expense", color: "#8BC34A", icon: "⚕️" },
  { name: "Education", type: "expense", color: "#FFC107", icon: "🎓" },
  { name: "Entertainment", type: "expense", color: "#FF5722", icon: "🎬" },
  { name: "Miscellaneous", type: "expense", color: "#795548", icon: "🗂️" },
];

export async function seedIncomes(userId: string) {
  for (const income of incomes) {
    const existingIncomes = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.type, "income"),
          eq(categories.userId, userId),
          eq(categories.name, income.name),
        ),
      );
    if (existingIncomes.length > 0) continue;
    await db
      .insert(categories)
      .values({
        ...income,
        userId,
        type: income.type as "income" | "expense",
      })
      .onConflictDoNothing();
  }
}

export async function seedExpenses(userId: string) {
  for (const expense of expenses) {
    const existingExpenses = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.type, "expense"),
          eq(categories.userId, userId),
          eq(categories.name, expense.name),
        ),
      );
    if (existingExpenses.length > 0) continue;
    await db
      .insert(categories)
      .values({
        ...expense,
        userId,
        type: expense.type as "income" | "expense",
      })
      .onConflictDoNothing();
  }
}
