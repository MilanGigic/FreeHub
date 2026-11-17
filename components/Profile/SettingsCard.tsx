"use client";

import { useTranslations } from "next-intl";
import ThemeToggle from "../ThemeToggle";
import { useUIStore } from "@/lib/store/useUIStore";

export default function SettingsCard() {
  const t = useTranslations("profile");
  const { preferredCurrency, setPreferredCurrency } = useUIStore();
  return (
    <div className="w-full flex justify-between border-b background-border pb-8 gap-8">
      <div className="w-[40%] flex flex-col gap-2">
        <h1 className="text-[#EAEAEA]">{t("settings")}</h1>
        <p className="text-gray-400 text-sm tracking-wide">
          {t("settingsDesc")}
        </p>
      </div>
      <form className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-slate-400 text-sm">{t("theme")}</h1>
          <ThemeToggle />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-slate-400 text-sm">{t("displayCurrency")}</h1>
          <select
            id="currency"
            className="w-full px-4 py-2 border background-border rounded-lg outline-none focus:border-[#EAEAEA] transition-all duration-300 text-primary background-elevated text-xl font-light"
            value={preferredCurrency}
            onChange={(e) =>
              setPreferredCurrency(e.target.value as "RSD" | "USD")
            }
          >
            <option className="text-xl font-medium rounded-md" value="RSD">
              RSD
            </option>
            <option className="text-xl font-medium rounded-md" value="USD">
              USD
            </option>
          </select>
        </div>
      </form>
    </div>
  );
}
