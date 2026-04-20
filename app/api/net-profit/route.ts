import { db } from "@/db";
import { transactions, users } from "@/db/schema";
import { verifySession } from "@/lib/session";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  const { searchParams } = new URL(request.url);
  const year = parseInt(
    searchParams.get("year") || new Date().getFullYear().toString(),
    10,
  );
  console.log(`Year: ${year}`);
  const startOfYear = new Date(year, 0, 1); // Jan 1, YYYY
  const endOfYear = new Date(year, 11, 31, 23, 59, 59); // Dec 31, YYYY (full day)
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const sessionData = await verifySession(session);
  if (!sessionData) {
    return new Response("Unauthorized", { status: 401 });
  }
  const userId = sessionData.userId;
  console.log(`User ID: ${userId}`);
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }
  console.log(`User found: ${user.email}`);

  try {
    console.log("Fetching income total");
    const [incomeResult] = await db
      .select({ total: sql`COALESCE(SUM(${transactions.amount}), 0)` })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.type, "income"),
          gte(transactions.createdAt, startOfYear),
          lte(transactions.createdAt, endOfYear),
        ),
      );

    console.log("Fetching expense total");
    const [expenseResult] = await db
      .select({ total: sql`COALESCE(SUM(${transactions.amount}), 0)` })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.type, "expense"),
          // eq(transactions.deductible, true), // Only tax-deductible
          gte(transactions.createdAt, startOfYear),
          lte(transactions.createdAt, endOfYear),
        ),
      );

    const totalIncome = Number(incomeResult?.total ?? 0);
    const totalExpenses = Number(expenseResult?.total ?? 0);
    const netProfit = totalIncome - totalExpenses;
    console.log(
      `Total income: ${totalIncome}, Total expenses: ${totalExpenses}, Net profit: ${netProfit}`,
    );
    return new Response(JSON.stringify({ netProfit }), { status: 200 });
  } catch (error) {
    console.error("Error fetching net profit:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
