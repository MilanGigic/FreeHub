"use client";

import { useAuth } from "@/lib/useAuth";

export default function ProfilePage() {
  const { logout } = useAuth();

  return (
    <div>
      <h1
        onClick={() => logout()}
        className="text-primary cursor-pointer hover:primary-red transition-all font-semibold uppercase"
      >
        Logout
      </h1>
    </div>
  );
}
