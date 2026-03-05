"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { calculateOutstandingInvoices } from "./calculateOutstandingInvoices";
import { calculateOverdueInvoices } from "./calculateOverdueInvoice";
import { calculatePaidInvoices } from "./calculatePaidInvoices";

export async function addInvoice(
  amount: string,
  issueDate: Date,
  dueDate: Date | null,
  note: string,
  clientId: string,
  userId: string,
  selectedProjectId: string | null,
) {
  if (!amount || !issueDate || !dueDate || !clientId || !selectedProjectId) {
    return { success: false, error: "All fields are required" };
  }

  try {
    const [data] = await db
      .insert(invoices)
      .values({
        userId,
        clientId,
        totalAmount: amount,
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        note,
        status: new Date(dueDate) < new Date() ? "overdue" : "sent",
        projectId: selectedProjectId,
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
        eq(invoices.projectId, selectedProjectId),
      ),
    });

    if (draftedInvoice) {
      await db.delete(invoices).where(eq(invoices.id, draftedInvoice.id));

      const draftedInvoices = await db
        .select()
        .from(invoices)
        .where(
          and(
            eq(invoices.clientId, clientId),
            eq(invoices.status, "draft"),
            eq(invoices.projectId, selectedProjectId),
          ),
        );
      return { success: true, data, draftedInvoices };
    }

    const outstandingInvoicesRes = await calculateOutstandingInvoices(clientId);
    const overdueInvoices = await calculateOverdueInvoices(clientId);
    const paidInvoices = await calculatePaidInvoices(clientId);

    if (
      outstandingInvoicesRes.success &&
      overdueInvoices.success &&
      paidInvoices.success
    ) {
      if (
        outstandingInvoicesRes.data &&
        overdueInvoices.data &&
        paidInvoices.data
      ) {
        return {
          success: true,
          data,
          outstandingInvoices: outstandingInvoicesRes.data,
          overdueInvoices: {
            data: overdueInvoices.data,
            count: overdueInvoices.count,
          },
          paidInvoices: paidInvoices.data,
        };
      } else {
        return {
          success: false,
          error: "Error calculating outstanding invoices",
        };
      }
    } else {
      return {
        success: false,
        error: "Error calculating outstanding invoices",
      };
    }
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
  userId: string,
  selectedProjectId: string | null,
) {
  if (
    !amount ||
    !issueDate ||
    !dueDate ||
    !note ||
    !clientId ||
    !selectedProjectId
  ) {
    return { success: false, error: "All fields are required" };
  }
  try {
    const [data] = await db
      .insert(invoices)
      .values({
        userId,
        clientId,
        totalAmount: amount,
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        note,
        status: "draft",
        projectId: selectedProjectId,
      })
      .returning();
    return { success: true, data };
  } catch (error) {
    console.error("Error adding invoice:", error);
    return { success: false, error: error as Error };
  }
}
