"use client";

import { fetchAllInvoices } from "@/actions/invoices/fetchAllInvoices";
import { useClientStore } from "@/lib/store/useClientStore";
import { useInvoiceStore } from "@/lib/store/useInvoiceStore";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function useFetchAllInvoices() {
  const { selectedClient, selectedClientId } = useClientStore();
  const { setInvoices, setOutstandingInvoices, setOverdueInvoices } =
    useInvoiceStore();

  useEffect(() => {
    const clientId = selectedClient?.id ?? selectedClientId;
    if (!clientId) return;
    (async () => {
      const res = await fetchAllInvoices(clientId);
      if (res.success) {
        if (res.data) {
          setInvoices(res.data);

          const outstandingTotal = res.data
            .filter((inv) => inv.status === "sent" || inv.status === "overdue")
            .reduce((acc, inv) => acc + Number(inv.totalAmount || 0), 0);

          const overdueList = res.data.filter((inv) => inv.status === "overdue");
          const overdueTotal = overdueList.reduce(
            (acc, inv) => acc + Number(inv.totalAmount || 0),
            0,
          );

          setOutstandingInvoices(outstandingTotal.toFixed(2));
          setOverdueInvoices({
            data: overdueTotal.toFixed(2),
            count: overdueList.length,
          });
        }
      } else {
        console.error("Error fetching all invoices:", res.error);
        toast.error(res.error as string);
      }
    })();
  }, [
    selectedClient?.id,
    selectedClientId,
    setInvoices,
    setOutstandingInvoices,
    setOverdueInvoices,
  ]);
}
