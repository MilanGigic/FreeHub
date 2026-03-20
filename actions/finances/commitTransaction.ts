"use server";
import { db } from "@/db";
import { projectFinance, transactions } from "@/db/schema";
import { revalidatePath, revalidateTag } from "next/cache";
import { recalculateProjectTotals } from "@/utils/recalculateProjectTotals";

export async function commitTransaction(
  userId: string,
  data: {
    type: "income" | "expense";
    amount: number;
    note: string;
    deductible: boolean;
    projectId: string;
  },
) {
  try {
    const [newTransaction] = await db
      .insert(transactions)
      .values({
        userId,
        projectId: data.projectId,
        type: data.type,
        amount: String(data.amount),
        note: data.note,
        deductible: data.deductible,
      })
      .returning();

    if (data.projectId) {
      await db.insert(projectFinance).values({
        userId,
        projectId: data.projectId,
        type: data.type,
        amount: String(data.amount),
        note: data.note || "",
      });
      await recalculateProjectTotals(userId, data.projectId);
    }

    revalidatePath("/finances");
    revalidateTag("clients-page-metrics", "max");
    revalidateTag("dashboard-data", "max");
    return { success: true, data: newTransaction };
  } catch (error) {
    console.error("Error committing transaction:", error);
    return { success: false, error: error as Error };
  }
}
