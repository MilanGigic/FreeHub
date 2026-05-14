"use server";
import { db } from "@/db";
import { projectFinance, transactions } from "@/db/schema";
import { revalidatePath, revalidateTag } from "next/cache";
import { recalculateProjectTotals } from "@/utils/recalculateProjectTotals";
import { TransactionCategory } from "@/config/constants";

type CommitTransactionProps = {
  type: "income" | "expense";
  amount: number;
  title: string;
  merchant: string;
  category: TransactionCategory;
  note: string;
  transactionDate: string;
  deductible: boolean;
  projectId: string;
};

export async function commitTransaction(
  userId: string,
  data: CommitTransactionProps,
) {
  console.log(
    "[commitTransaction] Called with userId:",
    userId,
    "and data:",
    data,
  );
  try {
    console.log("[commitTransaction] Inserting new transaction into DB:", {
      userId,
      projectId: data.projectId,
      type: data.type,
      amount: String(data.amount),
      deductible: data.deductible,
      category: data.category,
      title: data.title,
      merchantName: data.merchant,
      transactionDate: new Date(data.transactionDate),
      note: data.note,
    });
    const [newTransaction] = await db
      .insert(transactions)
      .values({
        userId,
        projectId: data.projectId,
        type: data.type,
        amount: String(data.amount),
        deductible: data.deductible,
        category: data.category,
        title: data.title,
        merchantName: data.merchant,
        transactionDate: new Date(data.transactionDate),
        note: data.note,
      })
      .returning();
    console.log(
      "[commitTransaction] New transaction inserted:",
      newTransaction,
    );

    if (data.projectId) {
      console.log(
        "[commitTransaction] Inserting projectFinance record for projectId:",
        data.projectId,
      );
      await db.insert(projectFinance).values({
        userId,
        projectId: data.projectId,
        type: data.type,
        amount: String(data.amount),
        note: data.note || "",
      });
      console.log(
        "[commitTransaction] Recalculating project totals for projectId:",
        data.projectId,
      );
      await recalculateProjectTotals(userId, data.projectId);
    }

    console.log("[commitTransaction] Revalidating paths and tags");
    revalidatePath("/finances");
    revalidateTag("clients-page-metrics", "max");
    revalidateTag("dashboard-data", "max");
    console.log("[commitTransaction] Transaction committed successfully");
    return { success: true, data: newTransaction };
  } catch (error) {
    console.error("Error committing transaction:", error);
    return { success: false, error: error as Error };
  }
}
