import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import { fetchDashboardData } from "@/actions/dashboard/fetchDashboardData";
import DashboardHydrator from "@/components/Dashboard/DashboardHydrator";
import DashboardClient from "@/components/Dashboard/DashboardClient";
import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    const t = await getTranslations("auth");
    return (
      <div className="w-full h-full flex items-center justify-center text-primary font-semibold">
        {t("mustBeLoggedInDashboard")}
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
