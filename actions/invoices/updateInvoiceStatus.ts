"use server";

import { db } from "@/db";
import { invoices, projectFinance, projects } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { InvoiceStatus } from "@/types/types";

export async function updateInvoiceStatus(
  id: string,
  status: InvoiceStatus,
  clientId: string,
  userId: string,
  projectId: string,
) {
  if (!id || !status || !clientId || !userId) {
    return { success: false, error: "All fields are required" };
  }
  try {
    if (status === "paid") {
      const [updatedInvoice] = await db
        .update(invoices)
        .set({ status, paymentDate: new Date() })
        .where(
          and(
            eq(invoices.id, id),
            eq(invoices.clientId, clientId),
            eq(invoices.projectId, projectId),
          ),
        )
        .returning();

      if (!updatedInvoice)
        return { success: false, error: "Invoice not found" };

      await db
        .update(projectFinance)
        .set({
          userId,
          projectId,
          amount: updatedInvoice.totalAmount,
          type: "income",
          note: updatedInvoice.note || "Invoice paid",
        })
        .where(
          and(
            eq(projectFinance.projectId, projectId),
            eq(projectFinance.userId, userId),
          ),
        );

      const [invoice] = await db
        .select()
        .from(invoices)
        .where(
          and(
            eq(invoices.id, id),
            eq(invoices.clientId, clientId),
            eq(invoices.userId, userId),
            eq(invoices.projectId, projectId),
          ),
        );

      if (!invoice) {
        return { success: false, error: "Invoice not found" };
      }

      const paidInvoices = await db
        .select()
        .from(invoices)
        .where(
          and(
            eq(invoices.projectId, projectId),
            eq(invoices.userId, userId),
            eq(invoices.status, "paid"),
          ),
        );

      const totalRevenue = paidInvoices
        .reduce((acc, invoice) => acc + Number(invoice.totalAmount), 0)
        .toFixed(2)
        .toString();

      const [currentProject] = await db
        .select()
        .from(projects)
        .where(
          and(
            eq(projects.clientId, clientId),
            eq(projects.userId, userId),
            eq(projects.id, projectId),
          ),
        );

      await db
        .update(projects)
        .set({
          totalRevenue,
          totalProfit: (
            Number(currentProject.totalProfit ?? 0) +
            Number(updatedInvoice.totalAmount)
          )
            .toFixed(2)
            .toString(),
        })
        .where(
          and(
            eq(projects.clientId, clientId),
            eq(projects.userId, userId),
            eq(projects.id, projectId),
          ),
        );
    } else {
      await db
        .update(invoices)
        .set({ status })
        .where(
          and(
            eq(invoices.id, id),
            eq(invoices.clientId, clientId),
            eq(invoices.userId, userId),
          ),
        );
    }

    const data = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.clientId, clientId), eq(invoices.userId, userId)));

    const projectData = await db.query.projects.findFirst({
      where: and(
        eq(projects.clientId, clientId),
        eq(projects.userId, userId),
        eq(projects.id, projectId),
      ),
    });

    return { success: true, data, projectData };
  } catch (error) {
    console.error("Error updating invoice status:", error);
    return { success: false, error: error as string };
  }
}
