"use server";

import { db } from "@/db";
import { invoices, projects, transactions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { InvoiceStatus } from "@/types/types";
import { recalculateProjectTotals } from "@/utils/recalculateProjectTotals";

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
        .insert(transactions)
        .values({
          userId,
          amount: updatedInvoice.totalAmount,
          projectId,
          type: "income",
          note: updatedInvoice.note || "Invoice paid",
          deductible: false,
        })
        .returning();

      await recalculateProjectTotals(userId, projectId);
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
