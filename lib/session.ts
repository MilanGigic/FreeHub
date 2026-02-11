/**
 * Session management utilities
 * Uses JWT tokens stored in HTTP-only cookies
 */

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface SessionPayload {
  userId: string;
  email: string;
  userName: string;
  [key: string]: unknown; // Index signature for JWTPayload compatibility
}

/**
 * Create a session token
 */
export async function createSession(payload: SessionPayload): Promise<string> {
  const secret = new TextEncoder().encode(SECRET_KEY);
  
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Token expires in 7 days
    .sign(secret);

  return token;
}

/**
 * Verify and decode a session token
 */
export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const secret = new TextEncoder().encode(SECRET_KEY);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Get the current session from cookies
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return null;
  }

  return verifySession(token);
}

/**
 * Set session cookie
 */
export async function setSession(payload: SessionPayload): Promise<void> {
  const token = await createSession(payload);
  const cookieStore = await cookies();

  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

/**
 * Delete session cookie (logout)
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
