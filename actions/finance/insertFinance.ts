"use server";

import { db } from "@/db";
import { transactions } from "@/db/schema";

export async function insertFinance(income: {
  title: string;
  amount: number;
  description: string | null;
  userId: string;
  type: "income" | "expense";
  categoryId: string | null;
}) {
  const { title, amount, description, userId, type, categoryId } = income;

  try {
    const [data] = await db
      .insert(transactions)
      .values({
        title,
        amount: amount.toString(),
        description,
        userId,
        type,
        categoryId,
      })
      .returning();
    console.log("Finance inserted successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error inserting finance:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while inserting finance",
    };
  }
}
