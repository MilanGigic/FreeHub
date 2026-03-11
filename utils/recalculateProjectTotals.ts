import { db } from "@/db";
import { transactions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { projects } from "@/db/schema";

export async function recalculateProjectTotals(
  userId: string,
  projectId: string,
) {
  const projectTransactions = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        eq(transactions.projectId, projectId),
      ),
    );

  const totalRevenue = projectTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0)
    .toFixed(2);

  const totalExpenses = projectTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0)
    .toFixed(2);

  const totalProfit = (Number(totalRevenue) - Number(totalExpenses)).toFixed(2);

  await db
    .update(projects)
    .set({ totalRevenue, totalExpenses, totalProfit })
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)));

  return { totalRevenue, totalExpenses, totalProfit };
}
