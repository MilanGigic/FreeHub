"use server";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import { subDays, startOfDay, format, addDays } from "date-fns";

export type CashFlowDay = {
  date: string;
  dateLabel: string;
  inflow: number;
  outflow: number;
};

export async function fetchCashFlowData(userId: string, days: 30 | 365) {
  if (!userId) {
    return { success: false, error: "User ID is required", data: [] };
  }

  try {
    const endDate = new Date();
    const startDate = startOfDay(subDays(endDate, days - 1));

    const rows = await db
      .select({
        createdAt: transactions.createdAt,
        type: transactions.type,
        amount: transactions.amount,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          gte(transactions.createdAt, startDate),
          lte(transactions.createdAt, endDate),
        ),
      );

    const byDay: Record<string, { inflow: number; outflow: number }> = {};
    for (let i = 0; i < days; i++) {
      const d = addDays(startDate, i);
      const key = format(d, "yyyy-MM-dd");
      byDay[key] = { inflow: 0, outflow: 0 };
    }

    for (const row of rows) {
      const key = format(new Date(row.createdAt), "yyyy-MM-dd");
      if (!byDay[key]) {
        byDay[key] = { inflow: 0, outflow: 0 };
      }
      const amount = Number(row.amount || 0);
      if (row.type === "income") {
        byDay[key].inflow += amount;
      } else {
        byDay[key].outflow += amount;
      }
    }

    const sortedKeys = Object.keys(byDay).sort();
    const data: CashFlowDay[] = sortedKeys.map((key) => ({
      date: key,
      dateLabel: format(new Date(key), "MMM d"),
      inflow: Math.round(byDay[key].inflow * 100) / 100,
      outflow: Math.round(byDay[key].outflow * 100) / 100,
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching cash flow data:", error);
    return { success: false, error: error as Error, data: [] };
  }
}
