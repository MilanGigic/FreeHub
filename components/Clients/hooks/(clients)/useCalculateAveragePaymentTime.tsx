"use client";

import { calculateAveragePaymentTime } from "@/actions/clients/calculateAveragePaymentTime";
import { useInvoiceStore } from "@/lib/store/useInvoiceStore";
import { useAuth } from "@/lib/useAuth";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function useCalculateAveragePaymentTime() {
  const { user } = useAuth();
  const { setAveragePaymentTime } = useInvoiceStore();
  useEffect(() => {
    (async () => {
      if (!user) return;
      const res = await calculateAveragePaymentTime(user.id);
      if (res.success) {
        if (res.data) {
          setAveragePaymentTime(Number(res.data).toFixed(2).toString());
        }
      } else {
        console.error("Error calculating average payment time:", res.error);
        toast.error(res.error as string);
      }
    })();
  }, [user, setAveragePaymentTime]);
}
