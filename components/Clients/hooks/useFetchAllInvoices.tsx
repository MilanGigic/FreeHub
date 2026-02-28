"use client";

import { fetchAllInvoices } from "@/actions/invoices/fetchAllInvoices";
import { useClientStore } from "@/lib/store/useClientStore";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function useFetchAllInvoices() {
  const { setInvoices, selectedClient } = useClientStore();

  useEffect(() => {
    if (!selectedClient) return;
    (async () => {
      const res = await fetchAllInvoices(selectedClient.id);
      if (res.success) {
        if (res.data) {
          setInvoices(res.data);
        }
      } else {
        console.error("Error fetching all invoices:", res.error);
        toast.error(res.error as string);
      }
    })();
  }, [selectedClient, setInvoices]);
}
