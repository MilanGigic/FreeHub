"use server";

import { db } from "@/db";
import { invoices, projects } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function calculateTotalRevenue(userId: string) {
  try {
    console.log("Calculating total revenue for userId:", userId);

    const [userProjects, paidInvoices] = await Promise.all([
      db.select().from(projects).where(eq(projects.userId, userId)),
      db
        .select()
        .from(invoices)
        .where(and(eq(invoices.userId, userId), eq(invoices.status, "paid"))),
    ]);

    console.log("Fetched userProjects:", userProjects);
    console.log("Fetched paidInvoices:", paidInvoices);

    const projectsTotalRevenue = userProjects.reduce(
      (acc, project) => acc + Number(project.totalRevenue || 0),
      0,
    );
    console.log("projectsTotalRevenue:", projectsTotalRevenue);

    const invoicesTotalRevenue = paidInvoices.reduce(
      (acc, invoice) => acc + Number(invoice.totalAmount || 0),
      0,
    );
    console.log("invoicesTotalRevenue:", invoicesTotalRevenue);

    const totalRevenue = (projectsTotalRevenue + invoicesTotalRevenue)
      .toFixed(2)
      .toString();
    console.log("Calculated totalRevenue:", totalRevenue);

    return { success: true, data: totalRevenue };
  } catch (error) {
    console.error("Error calculating total revenue:", error);
    return {
      success: false,
      error: "An error occurred while calculating total revenue",
    };
  }
}
