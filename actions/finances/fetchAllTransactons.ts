"use server";

import { getCachedTransactions } from "@/lib/cache/transactions";

export async function fetchAllTransactions(userId: string) {
  if (!userId)
    return {
      message: "Unauthorized...",
      data: [],
      success: false,
    };

  try {
    const data = await getCachedTransactions(userId);

    return {
      message: `Found ${data.length} transactions`,
      data,
      success: true,
    };
  } catch (error) {
    return {
      message: error as string,
      data: [],
      success: false,
    };
  }
}
