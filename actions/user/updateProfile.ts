"use server";

import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser } from "../auth/getCurrentUser";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

function uniqueViolationField(error: unknown): "email" | "userName" | null {
  const e = error as {
    code?: string;
    constraint_name?: string;
    cause?: { code?: string; constraint_name?: string };
  };
  const code = e.code ?? e.cause?.code;
  if (code !== "23505") return null;
  const name = e.constraint_name ?? e.cause?.constraint_name ?? "";
  if (name.includes("email")) return "email";
  if (name.includes("user_name")) return "userName";
  return null;
}

const schema = z.object({
  userName: z.string().trim().min(2).max(50),
  email: z.string().trim().toLowerCase().email(),
});

export type ProfileState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      message?: string;
      fieldErrors?: { userName?: string[]; email?: string[] };
    };

export async function updateProfile(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const user = await getCurrentUser();
  if (!user) return { status: "error", message: "unauthorized" };

  const parsed = schema.safeParse({
    userName: formData.get("userName"),
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await db.update(users).set(parsed.data).where(eq(users.id, user.id));
  } catch (error) {
    const field = uniqueViolationField(error);
    if (field) {
      return {
        status: "error",
        fieldErrors: {
          [field]: [field === "email" ? "emailTaken" : "userNameTaken"],
        },
      };
    }
    return { status: "error", message: "updateFailed" };
  }

  revalidatePath("/", "page");
  return { status: "success" };
}
