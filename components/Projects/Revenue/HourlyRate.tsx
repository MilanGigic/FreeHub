"use client";

import { useProjectStore } from "@/lib/store/useProjectStore";
import { useEffect, useState } from "react";

export default function HourlyRate() {
  const { selectedProject, profit } = useProjectStore();
  const [hourlyRate, setHourlyRate] = useState<string>("0");

  useEffect(() => {
    (async () => {
      if (!selectedProject) return;
      if (selectedProject.totalHoursWorked === null) return;

      const res = Number(profit) / Number(selectedProject.totalHoursWorked);
      setHourlyRate(res.toFixed(2));
    })();
  }, [profit, selectedProject]);

  return (
    <header className="flex flex-col gap-2 md:gap-4 items-center border-b-2 background-border pb-4 w-full">
      <p className="text-lg primary-slate uppercase font-semibold">
        Hourly Rate:
      </p>
      <span className="primary-purple text-2xl font-bold">${hourlyRate}</span>
    </header>
  );
}
