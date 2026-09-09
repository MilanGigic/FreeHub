"use server";

import { db } from "@/db";
import { municipalities } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function fetchMunicipality(code: string) {
  if (!code) throw new Error("Municipality code required!");

  const data = await db.query.municipalities.findFirst({
    where: eq(municipalities.code, code),
  });

  if (!data) throw new Error("No municipality found");

  return data;
}
