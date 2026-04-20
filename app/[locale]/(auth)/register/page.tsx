"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/actions/auth/register";
import { generateDEK, encryptDEK, exportKey } from "@/lib/crypto";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("auth");
  const [email, setEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [country, setCountry] = useState<string>("United States");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (password !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return;
    }

    if (password.length < 8) {
      setError(t("passwordTooShort"));
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
        encryptedDEKWithSalt,
      );

      if (result.success && result.userId) {
        const dekString = await exportKey(dek);
        sessionStorage.setItem("dek", dekString);
        sessionStorage.setItem("dekSalt", salt);

        if (country === "United States") {
          router.push("/en/onboarding");
        } else if (country === "Serbia") {
          router.push("/sr-Latn/onboarding");
        }
      } else {
        setError(result.error || t("registrationFailed"));
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(t("unexpectedError"));
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
          {t("register")}
        </h1>

        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
          <div>
            <label htmlFor="email" className={labelClass}>
              {t("email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
              placeholder={t("emailPlaceholder")}
            />
          </div>

          <div>
            <label htmlFor="country" className={labelClass}>
              {t("country")}
            </label>
            <select
              name="country"
              id="country"
              className={inputClass}
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="United States">{t("unitedStates")}</option>
              <option value="Serbia">{t("serbia")}</option>
            </select>
            <p className="text-xs primary-slate mt-1">
              {t("countryRestriction")}
              <br />
              {t("countryContactUs")}
              <br />
              {t("countryComingSoon")}
              <br />
              {t("thankYou")}
            </p>
          </div>

          <div>
            <label htmlFor="userName" className={labelClass}>
              {t("username")}
            </label>
            <input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className={inputClass}
              placeholder={t("usernamePlaceholder")}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              {t("password")}
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
              {t("passwordMinLength")}
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className={labelClass}>
              {t("confirmPassword")}
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
            {loading ? t("registering") : t("register")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-tertiary text-sm">
            {t("haveAccount")}
            <Link
              href="/login"
              className="primary-cyan hover:opacity-80 underline"
            >
              {t("login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
