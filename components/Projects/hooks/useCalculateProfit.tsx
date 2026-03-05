import { calculateProfit } from "@/actions/projects/revenue/calculateProfit";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function useCalculateProfit() {
  const { selectedProject, revenueList, expenseList, paidInvoices, setProfit } =
    useProjectStore();

  useEffect(() => {
    (async () => {
      if (!selectedProject) return;

      const res = await calculateProfit(
        selectedProject.id,
        revenueList,
        expenseList,
        paidInvoices, // invoices are already handled inside here
      );

      if (res.success) {
        if (res.data) {
          setProfit(String(res.data.totalProfit)); // just use this directly
        }
      } else {
        toast.error(res.error as string);
      }
    })();
  }, [revenueList, expenseList, paidInvoices, selectedProject, setProfit]);
}
