"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function addInvoice(
  amount: string,
  issueDate: Date,
  dueDate: Date | null,
  note: string,
  clientId: string,
) {
  if (!amount || !issueDate || !dueDate || !clientId) {
    return { success: false, error: "All fields are required" };
  }

  try {
    const [data] = await db
      .insert(invoices)
      .values({
        clientId,
        totalAmount: amount,
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        note,
        status: "sent",
      })
      .returning();

    const draftedInvoice = await db.query.invoices.findFirst({
      where: and(
        eq(invoices.status, "draft"),
        eq(invoices.clientId, clientId),
        eq(invoices.totalAmount, amount),
        eq(invoices.issueDate, issueDate),
        eq(invoices.dueDate, dueDate),
        eq(invoices.note, note),
      ),
    });

    if (draftedInvoice) {
      await db.delete(invoices).where(eq(invoices.id, draftedInvoice.id));

      const draftedInvoices = await db
        .select()
        .from(invoices)
        .where(
          and(eq(invoices.clientId, clientId), eq(invoices.status, "draft")),
        );
      return { success: true, data, draftedInvoices };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Error adding invoice:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while adding invoice",
    };
  }
}

export async function addToDrafts(
  amount: string,
  issueDate: Date,
  dueDate: Date | null,
  note: string,
  clientId: string,
) {
  if (!amount || !issueDate || !dueDate || !note || !clientId) {
    return { success: false, error: "All fields are required" };
  }
  try {
    const [data] = await db
      .insert(invoices)
      .values({
        clientId,
        totalAmount: amount,
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        note,
        status: "draft",
      })
      .returning();
    return { success: true, data };
  } catch (error) {
    console.error("Error adding invoice:", error);
    return { success: false, error: error as Error };
  }
}
