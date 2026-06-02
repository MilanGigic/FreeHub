import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import { fetchDashboardData } from "@/actions/dashboard/fetchDashboardData";
import DashboardHydrator from "@/components/Dashboard/DashboardHydrator";
import DashboardClient from "@/components/Dashboard/DashboardClient";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    const t = await getTranslations("auth");
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-primary font-semibold gap-4">
        {t("mustBeLoggedInDashboard")}
        <div className="flex flex-col items-center justify-center gap-2">
          <Link
            href="/login"
            className="py-2 px-4 text-(--accent-green) text-lg font-bold uppercase border rounded-lg background-elevated hover:background-(--accent-green) hover:bg-(--accent-green)/40 transition-all cursor-pointer text-center w-xs"
          >
            {t("login")}
          </Link>
          <Link
            href="/register"
            className="py-2 px-4 text-(--accent-cyan) text-lg font-bold uppercase border rounded-lg background-elevated hover:background-(--accent-cyan) hover:bg-(--accent-cyan)/40 transition-all cursor-pointer text-center w-xs"
          >
            {t("register")}
          </Link>
        </div>
      </div>
    );
  }
  const res = await fetchDashboardData(user.id);
  const payload = res.success && res.data ? res.data : null;

  return (
    <>
      {payload ? <DashboardHydrator payload={payload} /> : null}
      <DashboardClient />
    </>
  );
}
