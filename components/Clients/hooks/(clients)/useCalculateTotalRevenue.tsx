"use client";

import { calculateTotalRevenue } from "@/actions/clients/calculateTotalRevenue";
import { useDataStore } from "@/lib/store/useDataStore";
import { useAuth } from "@/lib/useAuth";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function useCalculateTotalRevenue() {
  const { user } = useAuth();
  const { setTotalRevenue } = useDataStore();
  useEffect(() => {
    (async () => {
      console.log("[useCalculateTotalRevenue] user:", user);
      if (!user) {
        console.log(
          "[useCalculateTotalRevenue] No user available, exiting effect.",
        );
        return;
      }
      const res = await calculateTotalRevenue(user.id);

      console.log(
        "[useCalculateTotalRevenue] calculateTotalRevenue response:",
        res,
      );

      if (!res.success) {
        console.log("[useCalculateTotalRevenue] Error:", res.error);
        toast.error(res.error);
        return;
      }

      if (res.data) {
        const formattedTotal = Number(res.data).toFixed(2).toString();
        console.log(
          "[useCalculateTotalRevenue] Setting total revenue:",
          formattedTotal,
        );
        setTotalRevenue(formattedTotal);
      }
    })();
  }, [user, setTotalRevenue]);
}
