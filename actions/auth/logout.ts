"use server";

import { deleteSession } from "@/lib/session";

export async function logout(): Promise<void> {
  await deleteSession();
}
