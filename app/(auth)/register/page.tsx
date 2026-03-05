"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/actions/auth/register";
import { generateDEK, encryptDEK, exportKey } from "@/lib/crypto";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
        country,
        state,
        encryptedDEKWithSalt,
      );

      if (result.success && result.userId) {
        // Store DEK in sessionStorage for this session
        // In production, use more secure storage (IndexedDB with encryption)
        const dekString = await exportKey(dek);
        sessionStorage.setItem("dek", dekString);
        sessionStorage.setItem("dekSalt", salt);

        // Redirect to dashboard
        router.push("/dashboard?wizard=true");
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

  const inputClass =
    "w-full px-4 py-2 background-elevated border background-border rounded-lg text-primary placeholder:text-tertiary focus:outline-none focus-border-accent";
  const labelClass = "block text-sm font-medium primary-slate mb-2";

  return (
    <div className="min-h-screen flex items-center justify-center background">
      <div className="w-full max-w-md p-8 background-elevated rounded-lg border background-border">
        <h1 className="text-2xl font-bold text-primary mb-6 text-center">
          Register
        </h1>

        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="country" className={labelClass}>
              Country
            </label>
            <input
              id="country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              className={inputClass}
              placeholder="United States"
            />
          </div>

          <div>
            <label htmlFor="state" className={labelClass}>
              State - US only
            </label>
            <input
              id="state"
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className={inputClass}
              placeholder="California"
            />
          </div>

          <div>
            <label htmlFor="userName" className={labelClass}>
              Username
            </label>
            <input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className={inputClass}
              placeholder="johndoe"
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className={inputClass}
              placeholder="••••••••"
            />
            <p className="text-xs text-tertiary mt-1">
              Must be at least 8 characters
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className={labelClass}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={inputClass}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-(--tag-expense-bg) border border-(--accent-red) rounded-lg primary-red text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 btn-primary"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-tertiary text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="primary-cyan hover:opacity-80 underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
