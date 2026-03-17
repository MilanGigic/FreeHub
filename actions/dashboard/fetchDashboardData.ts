"use server";

import { db } from "@/db";
import { clients, invoices, projects } from "@/db/schema";
import { and, eq, or, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";

type DashboardData = {
  clients: Awaited<ReturnType<typeof db.select>> extends infer T ? T : never;
};

const DASHBOARD_TAG = "dashboard-data";

const fetchDashboardDataCached = unstable_cache(
  async (userId: string) => {
    if (!userId) {
      return { success: false, error: "User ID is required" as const };
    }

    try {
      const [clientsList, projectsList, activeProjectsList, outstandingAgg] =
        await Promise.all([
          db.select().from(clients).where(eq(clients.userId, userId)),
          db
            .select({
              id: projects.id,
              userId: projects.userId,
              clientId: projects.clientId,
              // clientName is only needed in some project UIs; keep it simple here
              clientName: sql<string>`''`,
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
            .where(eq(projects.userId, userId)),
          db
            .select({
              id: projects.id,
              userId: projects.userId,
              clientId: projects.clientId,
              clientName: sql<string>`''`,
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
            .where(
              and(eq(projects.userId, userId), eq(projects.status, "active")),
            ),
          db
            .select({
              outstandingTotal: sql<string>`coalesce(sum(${invoices.totalAmount}::numeric), 0)`,
              outstandingCount: sql<number>`count(*) filter (where ${invoices.status} in ('sent','overdue'))`,
              overdueTotal: sql<string>`coalesce(sum(${invoices.totalAmount}::numeric) filter (where ${invoices.status} = 'overdue'), 0)`,
              overdueCount: sql<number>`count(*) filter (where ${invoices.status} = 'overdue')`,
            })
            .from(invoices)
            .where(
              and(
                eq(invoices.userId, userId),
                or(eq(invoices.status, "sent"), eq(invoices.status, "overdue")),
              ),
            ),
        ]);

      const agg = outstandingAgg[0];

      return {
        success: true,
        data: {
          clients: clientsList,
          projects: projectsList,
          activeProjects: activeProjectsList,
          allOutstandingInvoices: {
            data: Number(agg?.outstandingTotal ?? 0).toFixed(2),
            count: Number(agg?.outstandingCount ?? 0),
          },
          allOverdueInvoices: {
            data: Number(agg?.overdueTotal ?? 0).toFixed(2),
            count: Number(agg?.overdueCount ?? 0),
          },
        },
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return {
        success: false,
        error: "An error occurred while fetching dashboard data" as const,
      };
    }
  },
  ["dashboard-data"],
  { revalidate: 120, tags: [DASHBOARD_TAG] },
);

export async function fetchDashboardData(userId: string) {
  return fetchDashboardDataCached(userId);
}

