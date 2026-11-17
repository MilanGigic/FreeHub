"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function fetchProfile(userId: string) {
  if (!userId) return { data: null, message: "UserID required" };

  try {
    const data = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!data) return { data: null, message: `No data found for ${userId}` };

    return { data, message: "Found user!" };
  } catch (error) {
    return {
      data: null,
      message: error as string,
    };
  }
}
