"use client";

import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import { seedIncomes, seedExpenses } from "@/db/seeds/seedCategories";
import { useEffect } from "react";

const tabs = [
  "Finances",
  "Clients",
  "Projects",
  "Tasks",
  "Reports",
  "Messages",
];

export default function DashboardPage() {
  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (user) {
        await seedIncomes(user.id);
        await seedExpenses(user.id);
      }
    })();
  }, []);

  return (
    <div className="w-full h-full grid grid-cols-3 gap-4">
      {tabs.map((tab) => (
        <div
          key={tab}
          className="background-elevated border background-border rounded-lg p-4 flex flex-col gap-2 shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-black/60 transition-all duration-50 cursor-pointer text-primary"
        >
          <h1>{tab}</h1>
        </div>
      ))}
    </div>
  );
}
