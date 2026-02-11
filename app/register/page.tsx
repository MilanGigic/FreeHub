"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/actions/auth/register";
import { generateDEK, encryptDEK, exportKey } from "@/lib/crypto";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Generate DEK client-side
      const dek = await generateDEK();

      // Step 2: Encrypt DEK with password-derived key
      const { encryptedDEK, salt } = await encryptDEK(dek, password);

      // Step 3: Combine encryptedDEK and salt for storage
      const encryptedDEKWithSalt = JSON.stringify({ encryptedDEK, salt });

      // Step 4: Register user with encrypted DEK (single call)
      const result = await register(
        email,
        userName,
        password,
        encryptedDEKWithSalt,
      );

      if (result.success && result.userId) {
        // Store DEK in sessionStorage for this session
        // In production, use more secure storage (IndexedDB with encryption)
        const dekString = await exportKey(dek);
        sessionStorage.setItem("dek", dekString);
        sessionStorage.setItem("dekSalt", salt);

        // Redirect to dashboard
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f131a]">
      <div className="w-full max-w-md p-8 bg-[#11151c] rounded-lg border border-[#1f2937]">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Register
        </h1>

        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-[#0f131a] border border-[#1f2937] rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Username
            </label>
            <input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full px-4 py-2 bg-[#0f131a] border border-[#1f2937] rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="johndoe"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2 bg-[#0f131a] border border-[#1f2937] rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-400 mt-1">
              Must be at least 8 characters
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-[#0f131a] border border-[#1f2937] rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-500 hover:text-blue-400 underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
