"use client";

import { calculateAllOutstandingInvoices } from "@/actions/clients/calculateAllOutstandingInvoices";
import { useInvoiceStore } from "@/lib/store/useInvoiceStore";
import { useAuth } from "@/lib/useAuth";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function useCalculateAllOutstandingInvoices() {
  const { user } = useAuth();
  const { setAllOutstandingInvoices } = useInvoiceStore();

  useEffect(() => {
    (async () => {
      if (!user) return;
      const res = await calculateAllOutstandingInvoices(user.id);
      if (res.success) {
        if (res.data) {
          setAllOutstandingInvoices({ data: res.data, count: res.count });
        }
      } else {
        toast.error(res.error);
      }
    })();
  }, [user, setAllOutstandingInvoices]);
}
