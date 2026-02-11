"use server";

import { getSession } from "@/lib/session";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getCurrentUser() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
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
