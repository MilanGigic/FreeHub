"use client";

import { fetchExpenseData } from "@/actions/projects/revenue/fetchExpenseData";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function useFetchExpenseData() {
  const { selectedProject, setExpenseList } = useProjectStore();
  useEffect(() => {
    (async () => {
      if (!selectedProject) return;

      const expenseRes = await fetchExpenseData(selectedProject.id);

      if (expenseRes.success) {
        if (expenseRes.data) {
          if (expenseRes.data.length > 0) {
            setExpenseList(expenseRes.data);
          }
        }
      } else {
        toast.error(expenseRes.error as string);
      }
    })();
  }, [selectedProject, setExpenseList]);
}
