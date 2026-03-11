"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { calculateTotalRevenue } from "@/actions/calculateTotalRevenue";
import { toast } from "react-toastify";

export default function RevenueThisMonth() {
  const { user } = useAuth();
  const [revenue, setRevenue] = useState<string>("0");

  useEffect(() => {
    (async () => {
      if (!user) return;
      const res = await calculateTotalRevenue(user.id);
      if (res.success && res.data) {
        setRevenue(res.data);
      } else {
        toast.error(res.error);
      }
    })();
  }, [user]);

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
