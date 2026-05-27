"use server";
import { db } from "@/db";
import { clients, projectFinance, projects, transactions } from "@/db/schema";
import { revalidateTag } from "next/cache";
import { recalculateProjectTotals } from "@/utils/recalculateProjectTotals";
import { TransactionCategory } from "@/config/constants";
import { eq } from "drizzle-orm";

type CommitTransactionProps = {
  type: "income" | "expense";
  amount: number;
  title: string;
  merchant: string;
  category: TransactionCategory;
  note: string;
  transactionDate: string;
  deductible: boolean;
  projectId: string | null;
  clientId: string | null;
};

export async function commitTransaction(
  userId: string,
  data: CommitTransactionProps,
) {
  try {
    const [insertedTransaction] = await db
      .insert(transactions)
      .values({
        userId,
        projectId: data.projectId,
        clientId: data.clientId,
        type: data.type,
        amount: String(data.amount),
        deductible: data.deductible,
        category: data.category,
        title: data.title,
        merchantName: data.merchant,
        transactionDate: new Date(data.transactionDate),
        note: data.note,
      })
      .returning({
        id: transactions.id,
      });

    const newTransaction = await db
      .select({
        id: transactions.id,
        userId: transactions.userId,
        projectId: transactions.projectId,
        type: transactions.type,
        amount: transactions.amount,
        deductible: transactions.deductible,
        category: transactions.category,
        title: transactions.title,
        isRecurring: transactions.isRecurring,
        merchantName: transactions.merchantName,
        note: transactions.note,
        createdAt: transactions.createdAt,
        updatedAt: transactions.updatedAt,
        transactionDate: transactions.transactionDate,
        projectName: projects.name,
        clientName: clients.clientName,
        clientId: clients.id,
      })
      .from(transactions)
      .leftJoin(projects, eq(transactions.projectId, projects.id))
      .leftJoin(clients, eq(transactions.clientId, clients.id))
      .where(eq(transactions.id, insertedTransaction.id));

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

    revalidateTag("clients-page-metrics", "max");
    revalidateTag("dashboard-data", "max");
    revalidateTag(`transactions-${userId}`, "max");
    return { success: true, data: newTransaction };
  } catch (error) {
    console.error("Error committing transaction:", error);
    return { success: false, error: error as Error };
  }
}
