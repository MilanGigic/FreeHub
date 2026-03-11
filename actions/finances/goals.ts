"use server";
import { db } from "@/db";
import { goals } from "@/db/schema/schema";
import { Conservativeness } from "@/types/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getGoals(userId: string) {
  try {
    const data = await db.select().from(goals).where(eq(goals.userId, userId));
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching goals:", error);
    return { success: false, error: error as Error };
  }
}

export async function createGoal(
  userId: string,
  data: {
    name: string;
    targetAmount: number;
    deadline?: Date;
    conservativeness: Conservativeness;
  },
) {
  await db.insert(goals).values({
    userId,
    name: data.name,
    targetAmount: String(data.targetAmount),
    deadline: data.deadline ?? null,
    conservativeness: data.conservativeness,
  });
  revalidatePath("/finances");
}

export async function updateGoalConservativeness(
  goalId: string,
  conservativeness: Conservativeness,
) {
  await db.update(goals).set({ conservativeness }).where(eq(goals.id, goalId));
  revalidatePath("/finances");
}

export async function deleteGoal(goalId: string) {
  await db.delete(goals).where(eq(goals.id, goalId));
  revalidatePath("/finances");
}
