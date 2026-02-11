import { db } from "@/db";
import { categories } from "@/db/schema";
import { and, eq, ilike } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const userId = searchParams.get("userId");

  if (!query || query.length < 2 || !userId) {
    return NextResponse.json([]);
  }

  const results = await db
    .select()
    .from(categories)
    .where(
      and(
        ilike(categories.name, `%${query}%`),
        eq(categories.type, "expense"),
        eq(categories.userId, userId),
      ),
    )
    .limit(10);

  return NextResponse.json(results);
}
