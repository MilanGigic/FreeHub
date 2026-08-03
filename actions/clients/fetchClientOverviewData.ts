"use server";

import { db } from "@/db";
import { clients, invoices, projects } from "@/db/schema";
import { and, eq, lt, sql } from "drizzle-orm";

export async function fetchClientOverviewData(clientId: string) {
  if (!clientId) {
    return { success: false, error: "Client ID is required" as const };
  }

  try {
    // 1) Fetch client
    const client = await db.query.clients.findFirst({
      where: eq(clients.id, clientId),
    });

    if (!client) {
      return { success: false, error: "Client not found" as const };
    }

    // 2) Normalize invoice statuses for this client (past-due "sent" -> "overdue")
    await db
      .update(invoices)
      .set({ status: "overdue" })
      .where(
        and(
          eq(invoices.clientId, clientId),
          eq(invoices.status, "sent"),
          lt(invoices.dueDate, new Date()),
        ),
      );

    // 3) Fetch projects (shape matches existing project UI needs)
    const clientProjects = await db
      .select({
        id: projects.id,
        userId: projects.userId,
        clientId: projects.clientId,
        clientName: clients.clientName,
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
      .where(eq(projects.clientId, clientId))
      .innerJoin(clients, eq(projects.clientId, clients.id));

    // 4) Fetch invoices
    const clientInvoices = await db
      .select()
      .from(invoices)
      .where(eq(invoices.clientId, clientId));

    // 5) Compute aggregates from the invoice list (avoid extra server calls)
    const outstandingInvoices = clientInvoices
      .filter((inv) => inv.status === "sent" || inv.status === "overdue")
      .reduce((acc, inv) => acc + Number(inv.totalAmount || 0), 0);

    const overdueList = clientInvoices.filter(
      (inv) => inv.status === "overdue",
    );
    const overdueInvoices = overdueList.reduce(
      (acc, inv) => acc + Number(inv.totalAmount || 0),
      0,
    );

    const paidInvoices = clientInvoices
      .filter((inv) => inv.status === "paid")
      .reduce((acc, inv) => acc + Number(inv.totalAmount || 0), 0);

    // NOTE: keep extra aggregates ready for UI, without forcing usage everywhere.
    const totals = {
      outstandingInvoices: outstandingInvoices.toFixed(2),
      overdueInvoices: overdueInvoices.toFixed(2),
      overdueCount: overdueList.length,
      paidInvoices: paidInvoices.toFixed(2),
      invoiceCount: clientInvoices.length,
    };

    return {
      success: true,
      data: {
        client,
        projects: clientProjects,
        invoices: clientInvoices,
        totals,
      },
    };
  } catch (error) {
    console.error("Error fetching client overview data:", error);
    return {
      success: false,
      error: "An error occurred while fetching client data" as const,
    };
  }
}
