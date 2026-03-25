"use client";

import { useTranslations } from "next-intl";

export default function MessagesCard() {
  const t = useTranslations("dashboard");

  return (
    <div className="w-full p-px bg-linear-to-b from-[#2dd4bf] via-[#21262d] to-[#0a0e14] rounded-lg">
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
        <header className="w-full flex flex-col border-b-2 background-border pb-4">
          <h1>{t("messagesOverview")}</h1>
        </header>
      </div>
    </div>
  );
}
