"use server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { revalidatePath, revalidateTag } from "next/cache";

export async function commitTransaction(
  userId: string,
  data: {
    type: "income" | "expense";
    amount: number;
    note: string;
    deductible: boolean;
  },
) {
  try {
    const [newTransaction] = await db
      .insert(transactions)
      .values({
        userId,
        type: data.type,
        amount: String(data.amount),
        note: data.note,
        deductible: data.deductible,
      })
      .returning();
    revalidatePath("/finances");
    revalidateTag("clients-page-metrics", "max");
    revalidateTag("dashboard-data", "max");
    return { success: true, data: newTransaction };
  } catch (error) {
    console.error("Error committing transaction:", error);
    return { success: false, error: error as Error };
  }
}
