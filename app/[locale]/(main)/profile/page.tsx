"use server";

import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import LogoutCard from "@/components/Profile/LogoutCard";
import ProfileCard from "@/components/Profile/ProfileCard";
import ProfilePageHeader from "@/components/Profile/ProfilePageHeader";
import SettingsCard from "@/components/Profile/SettingsCard";
import TaxesCard from "@/components/Profile/TaxesCard";
export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) return null;

  return (
    <div className="flex flex-col gap-16">
      <ProfilePageHeader />

      <main className="flex flex-col gap-8">
        <ProfileCard user={user} />
        <SettingsCard />
        <TaxesCard />
      </main>

      <LogoutCard />
    </div>
  );
}
