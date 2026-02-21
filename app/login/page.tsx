"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/actions/auth/login";
import { decryptDEK, exportKey } from "@/lib/crypto";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success && result.encryptedDEK) {
        try {
          // Parse encrypted DEK (contains encryptedDEK and salt)
          const dekData = JSON.parse(result.encryptedDEK);

          // Decrypt DEK using password
          const dek = await decryptDEK(
            dekData.encryptedDEK,
            dekData.salt,
            password,
          );

          // Export and store DEK for this session
          // In production, use more secure storage (IndexedDB with encryption)
          const dekString = await exportKey(dek);
          sessionStorage.setItem("dek", dekString);
          sessionStorage.setItem("dekSalt", dekData.salt);

          // Redirect to dashboard
          router.push("/dashboard");
          router.refresh();
        } catch (decryptError) {
          console.error("DEK decryption error:", decryptError);
          setError("Failed to decrypt encryption key. Please try again.");
        }
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center background">
      <div className="w-full max-w-md p-8 background-elevated rounded-lg border background-border">
        <h1 className="text-2xl font-bold text-primary mb-6 text-center">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-secondary mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 background-elevated border background-border rounded-lg text-primary placeholder:text-tertiary focus:outline-none focus-border-accent"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-secondary mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 background-elevated border background-border rounded-lg text-primary placeholder:text-tertiary focus:outline-none focus-border-accent"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-[var(--tag-expense-bg)] border border-[var(--accent-red)] rounded-lg primary-red text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 btn-primary"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-tertiary text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="primary-cyan hover:opacity-80 underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
