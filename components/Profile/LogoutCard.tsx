"use client";

import { useAuth } from "@/lib/useAuth";
import { useTranslations } from "next-intl";

export default function LogoutCard() {
  const { logout } = useAuth();
  const t = useTranslations("profile");
  return (
    <div className="w-full text-end">
      <h1
        onClick={() => logout()}
        className="text-primary cursor-pointer hover:text-(--accent-red) transition-all font-semibold uppercase"
      >
        {t("logout")}
      </h1>
    </div>
  );
}
