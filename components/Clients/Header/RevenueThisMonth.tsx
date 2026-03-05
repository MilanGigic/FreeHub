"use client";

import { useDataStore } from "@/lib/store/useDataStore";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { setTotalRevenue } from "@/actions/setTotalRevenue";
import { toast } from "react-toastify";

export default function RevenueThisMonth() {
  const { user } = useAuth();
  const { projects } = useDataStore();
  const [revenue, setRevenue] = useState<string>("0");

  useEffect(() => {
    (async () => {
      if (!user) return;
      const res = await setTotalRevenue(user.id, projects);
      if (res.success) {
        if (res.data) {
          // Sum all project totals into one number
          const totalRevenue = res.data
            .reduce((acc, item) => acc + parseFloat(item.total), 0)
            .toFixed(2);

          setRevenue(totalRevenue);
        }
      } else {
        toast.error(res.error);
      }
    })();
  }, [user, projects]);

  return (
    <div className="background-elevated border background-border rounded-lg p-4">
      <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
        Revenue This Month
      </h1>
      <p className="text-2xl font-bold flex items-center gap-2 primary-green">
        ${revenue}
      </p>
    </div>
  );
}
