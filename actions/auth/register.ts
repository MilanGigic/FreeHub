"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { createSession } from "@/lib/session";
import { cookies } from "next/headers";

export interface RegisterResult {
  success: boolean;
  error?: string;
  userId?: string;
}

export async function register(
  email: string,
  userName: string,
  password: string,
  country: string,
  state: string | null,
  encryptedDEK: string,
): Promise<RegisterResult> {
  try {
    // Validate input
    if (!email || !userName || !password || !encryptedDEK || !country) {
      return { success: false, error: "All fields are required" };
    }

    if (password.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters long",
      };
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return { success: false, error: "Email already registered" };
    }

    const existingUserName = await db.query.users.findFirst({
      where: eq(users.userName, userName),
    });

    if (existingUserName) {
      return { success: false, error: "Username already taken" };
    }

    // Hash password with bcrypt (server-side)
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert user into database with encrypted DEK
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        userName,
        country,
        state,
        passwordHash,
        encryptedDEK: encryptedDEK,
      })
      .returning();

    // Create session token directly here instead of calling setSession
    // This avoids nested cookie() calls which can cause issues
    const token = await createSession({
      userId: newUser.id,
      email: newUser.email,
      userName: newUser.userName,
    });
    
    // Set cookie directly in this server action
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return {
      success: true,
      userId: newUser.id,
    };
  } catch (error) {
    console.error("Registration error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    const errorMessage = error instanceof Error ? error.message : "An error occurred during registration";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

