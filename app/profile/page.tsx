"use client";

import { useAuth } from "@/lib/useAuth";

export default function ProfilePage() {
  const { logout } = useAuth();

  return (
    <div>
      <h1
        onClick={() => logout()}
        className="cursor-pointer hover:text-[#ef4444] transition-all font-semibold uppercase"
      >
        Logout
      </h1>
    </div>
  );
}
