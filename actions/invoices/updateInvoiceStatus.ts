"use server";

import { db } from "@/db";
import { invoices, projectFinance, projects, transactions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { InvoiceStatus } from "@/types/types";
import { recalculateProjectTotals } from "@/utils/recalculateProjectTotals";
import { revalidateTag } from "next/cache";

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
          projectId,
          clientId,
          currency: updatedInvoice.currency,
          type: "income",
          amount: updatedInvoice.totalAmount,
          deductible: false,
          category: updatedInvoice.category,
          title: updatedInvoice.title,
          isRecurring: false,
          merchantName: updatedInvoice.merchantName,
          note: updatedInvoice.note,
          transactionDate: updatedInvoice.paymentDate ?? new Date(),
        })
        .returning();

      await db.insert(projectFinance).values({
        userId,
        projectId,
        type: "income",
        amount: updatedInvoice.totalAmount,
        currency: updatedInvoice.currency,
        note: updatedInvoice.note || "Invoice paid",
      });

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

    revalidateTag("clients-page-metrics", "max");
    revalidateTag("dashboard-data", "max");
    return { success: true, data, projectData };
  } catch (error) {
    console.error("Error updating invoice status:", error);
    return { success: false, error: error as string };
  }
}
