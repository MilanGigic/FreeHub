"use client";

import { useProjectStore } from "@/lib/store/useProjectStore";

export default function HoursWorked() {
  const { selectedProject } = useProjectStore();

  return (
    <h1 className="primary-slate uppercase font-semibold flex items-center gap-2">
      Total Hours Worked:
      <span className="primary-cyan text-lg font-bold">
        {" "}
        {selectedProject?.totalHoursWorked}
      </span>
    </h1>
  );
}
