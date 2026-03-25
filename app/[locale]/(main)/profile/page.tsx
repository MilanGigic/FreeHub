"use client";

import { useAuth } from "@/lib/useAuth";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
  const { logout } = useAuth();
  const t = useTranslations("profile");

  return (
    <div>
      <h1
        onClick={() => logout()}
        className="text-primary cursor-pointer hover:primary-red transition-all font-semibold uppercase"
      >
        {t("logout")}
      </h1>
    </div>
  );
}
