"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { setSession } from "@/lib/session";

export interface LoginResult {
  success: boolean;
  error?: string;
  userId?: string;
  encryptedDEK?: string;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    // Validate input
    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    // Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
      return { success: false, error: "Invalid email or password" };
    }

    // Create session
    await setSession({
      userId: user.id,
      email: user.email,
      userName: user.userName,
    });

    // Return encrypted DEK for client-side decryption
    return {
      success: true,
      userId: user.id,
      encryptedDEK: user.encryptedDEK,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "An error occurred during login",
    };
  }
}
