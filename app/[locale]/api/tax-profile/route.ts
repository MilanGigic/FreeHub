import { getTaxProfile } from "@/actions/taxProfile";
import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json(null, { status: 401 });

  const profile = await getTaxProfile(user.id);
  return NextResponse.json(profile);
}
