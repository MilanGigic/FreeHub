"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema";

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
