import { db } from "@/db";
import { clients, projects } from "@/db/schema";
import { and, ilike, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const userId = searchParams.get("userId");

  if (!query || query.length < 2 || !userId) {
    return NextResponse.json([]);
  }

  const results = await db
    .select({
      id: projects.id,
      userId: projects.userId,
      clientId: projects.clientId,
      clientName: sql<string>`concat(${clients.firstName}, ' ', ${clients.lastName})`,
      name: projects.name,
      description: projects.description,
      totalRevenue: projects.totalRevenue,
      totalExpenses: projects.totalExpenses,
      totalProfit: projects.totalProfit,
      totalMargin: projects.totalMargin,
      totalHoursWorked: projects.totalHoursWorked,
      status: projects.status,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
    })
    .from(projects)
    .where(and(ilike(projects.name, `%${query}%`), eq(projects.userId, userId)))
    .innerJoin(clients, eq(projects.clientId, clients.id))
    .limit(10);

  return NextResponse.json(results);
}
