"use client";

import { useTranslations } from "next-intl";

export default function ProfilePageHeader() {
  const t = useTranslations("profile");

  return (
    <header className="flex flex-col gap-2">
      <h1 className="text-primary text-4xl font-bold tracking-wide">
        {t("profile")}
      </h1>
      <p className="text-slate-400 text-sm tracking-wide">{t("profileDesc")}</p>
    </header>
  );
}
