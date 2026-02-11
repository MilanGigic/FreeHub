"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { setSession } from "@/lib/session";

export interface RegisterResult {
  success: boolean;
  error?: string;
  userId?: string;
}

export async function register(
  email: string,
  userName: string,
  password: string,
  encryptedDEK: string,
): Promise<RegisterResult> {
  try {
    // Validate input
    if (!email || !userName || !password || !encryptedDEK) {
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
        passwordHash,
        encryptedDEK: encryptedDEK,
      })
      .returning();

    // Create session after successful registration
    try {
      await setSession({
        userId: newUser.id,
        email: newUser.email,
        userName: newUser.userName,
      });
    } catch (sessionError) {
      console.error("Session creation error:", sessionError);
      // Don't fail registration if session creation fails
      // User can log in again
    }

    return {
      success: true,
      userId: newUser.id,
    };
  } catch (error) {
    console.error("Registration error:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred during registration";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

