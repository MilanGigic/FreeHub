"use client";

import { fetchIncomeData } from "@/actions/projects/revenue/fetchIncomeData";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function useFetchIncomeData() {
  const { selectedProject, setRevenueList } = useProjectStore();
  useEffect(() => {
    (async () => {
      if (!selectedProject) return;

      const res = await fetchIncomeData(selectedProject.id);

      if (res.success) {
        if (res.data) {
          if (res.data.length > 0) {
            setRevenueList(res.data);
          }
        }
      } else {
        toast.error(res.error as string);
      }
    })();
  }, [selectedProject, setRevenueList]);
}
