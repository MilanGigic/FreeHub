"use client";

import { useProjectStore } from "@/lib/store/useProjectStore";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/lib/useAuth";
import { fetchSelectedProject } from "@/actions/projects/fetchSelectedProject";

export default function Profit() {
  const { user } = useAuth();
  const { selectedProject, setProfit, profit } = useProjectStore();

  useEffect(() => {
    (async () => {
      if (!selectedProject || !user) return;

      const res = await fetchSelectedProject(selectedProject.id, user.id);

      if (res.success) {
        if (res.data) {
          setProfit(res.data.totalProfit ?? "0");
        }
      } else {
        toast.error(res.error as string);
      }
    })();
  }, [selectedProject, user, setProfit]);

  return (
    <div className="w-full flex flex-col gap-2 md:gap-4 background-elevated border background-border rounded-lg p-4 items-center">
      <p className="text-lg primary-slate uppercase font-semibold">Profit:</p>
      <span className="primary-cyan text-2xl font-bold">${profit}</span>
    </div>
  );
}
