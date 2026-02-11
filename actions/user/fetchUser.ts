"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function fetchUser(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    userName: user.userName,
  };
}
