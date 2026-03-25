"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/actions/auth/login";
import { decryptDEK, exportKey } from "@/lib/crypto";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("auth");
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
          const dekData = JSON.parse(result.encryptedDEK);

          const dek = await decryptDEK(
            dekData.encryptedDEK,
            dekData.salt,
            password,
          );

          const dekString = await exportKey(dek);
          sessionStorage.setItem("dek", dekString);
          sessionStorage.setItem("dekSalt", dekData.salt);

          router.push("/dashboard");
          router.refresh();
        } catch (decryptError) {
          console.error("DEK decryption error:", decryptError);
          setError(t("decryptionError"));
        }
      } else {
        setError(result.error || t("loginFailed"));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("unexpectedError"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center background">
      <div className="w-full max-w-md p-8 background-elevated rounded-lg border background-border">
        <h1 className="text-2xl font-bold text-primary mb-6 text-center">
          {t("login")}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium primary-slate mb-2"
            >
              {t("email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 background-elevated border background-border rounded-lg text-primary placeholder:text-tertiary focus:outline-none focus-border-accent"
              placeholder={t("emailPlaceholder")}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium primary-slate mb-2"
            >
              {t("password")}
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
            <div className="p-3 bg-(--tag-expense-bg) border border-(--accent-red) rounded-lg primary-red text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 btn-primary"
          >
            {loading ? t("loggingIn") : t("login")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-tertiary text-sm">
            {t("noAccount")}
            <Link
              href="/register"
              className="primary-cyan hover:opacity-80 underline"
            >
              {t("register")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
