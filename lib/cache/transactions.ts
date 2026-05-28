"use server";

import { db } from "@/db";
import { projects, transactions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getCachedTransactions = async (userId: string) =>
  unstable_cache(
    async () => {
      console.log("CACHE MISS — fetching from DB", userId);
      return db
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
        })
        .from(transactions)
        .leftJoin(projects, eq(transactions.projectId, projects.id))
        .where(eq(transactions.userId, userId));
    },
    [`transactions-${userId}`],
    {
      tags: [`transactions-${userId}`],
      revalidate: 60,
    },
  )();
