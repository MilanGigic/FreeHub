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
) {
  if (!id || !status || !clientId || !userId) {
    return { success: false, error: "All fields are required" };
  }
  try {
    if (status === "paid") {
      const [updatedInvoice] = await db
        .update(invoices)
        .set({ status, paymentDate: new Date() })
        .where(and(eq(invoices.id, id), eq(invoices.clientId, clientId)))
        .returning();

      await db
        .update(projectFinance)
        .set({
          userId,
          projectId: updatedInvoice.projectId,
          amount: updatedInvoice.totalAmount,
          type: "income",
          note: updatedInvoice.note || "Invoice paid",
        })
        .where(
          and(
            eq(projectFinance.projectId, updatedInvoice.projectId),
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
          ),
        );

      if (!invoice) {
        return { success: false, error: "Invoice not found" };
      }

      const projectId = invoice.projectId;

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

      await db
        .update(projects)
        .set({
          totalRevenue,
        })
        .where(
          and(eq(projects.clientId, clientId), eq(projects.userId, userId)),
        );
    } else {
      await db
        .update(invoices)
        .set({ status })
        .where(and(eq(invoices.id, id), eq(invoices.clientId, clientId)));
    }

    const data = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.clientId, clientId), eq(invoices.userId, userId)));

    return { success: true, data };
  } catch (error) {
    console.error("Error updating invoice status:", error);
    return { success: false, error: error as string };
  }
}
