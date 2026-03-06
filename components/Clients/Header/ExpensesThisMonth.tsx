"use client";

import { calculateTotalExpenses } from "@/actions/calculateTotalExpenses";
import { useDataStore } from "@/lib/store/useDataStore";
import { useAuth } from "@/lib/useAuth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ExpensesThisMonth() {
  const { user } = useAuth();
  const { projects } = useDataStore();
  const [expenses, setExpenses] = useState<string>("0");

  useEffect(() => {
    (async () => {
      if (!user) return;
      const res = await calculateTotalExpenses(user.id, projects);
      if (res.success) {
        if (res.data) {
          setExpenses(res.data);
        }
      } else {
        toast.error(res.error);
      }
    })();
  }, [user, projects]);

  if (!user) return null;

  return (
    <div className="background-elevated border background-border rounded-lg p-4">
      <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
        Expenses This Month
      </h1>
      <p className="text-2xl font-bold flex items-center gap-2 primary-red">
        ${expenses}
      </p>
    </div>
  );
}
