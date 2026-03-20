import { db } from "@/db";
import { projectFinance } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { projects } from "@/db/schema";

export async function recalculateProjectTotals(
  userId: string,
  projectId: string,
) {
  const projectTransactions = await db
    .select()
    .from(projectFinance)
    .where(
      and(
        eq(projectFinance.userId, userId),
        eq(projectFinance.projectId, projectId),
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
  const totalMargin =
    Number(totalRevenue) > 0
      ? ((Number(totalProfit) / Number(totalRevenue)) * 100).toFixed(2)
      : "0.00";

  await db
    .update(projects)
    .set({ totalRevenue, totalExpenses, totalProfit, totalMargin })
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)));

  return { totalRevenue, totalExpenses, totalProfit, totalMargin };
}
