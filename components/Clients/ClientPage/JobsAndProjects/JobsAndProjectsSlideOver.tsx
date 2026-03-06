"use client";

import { useProjectStore } from "@/lib/store/useProjectStore";
import { useUIStore } from "@/lib/store/useUIStore";
import { X } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function JobsAndProjectsSlideOver() {
  const { isJobsAndProjectsSlideOverOpen, jobsAndProjectsSlideOverClose } =
    useUIStore();

  const { selectedProject, setSelectedProject } = useProjectStore();

  const totalProfitPerHour = useMemo(() => {
    if (!selectedProject) return 0;
    return selectedProject.totalProfit &&
      Number(selectedProject.totalProfit) &&
      selectedProject.totalHoursWorked &&
      Number(selectedProject.totalHoursWorked)
      ? Number(selectedProject.totalProfit) /
          Number(selectedProject.totalHoursWorked)
      : 0;
  }, [selectedProject]);

  if (!selectedProject) return null;

  return (
    <div
      className={`fixed top-14 right-0 h-full w-full max-w-sm background-elevated z-100 border-l-2 ${selectedProject.status === "completed" ? "border-(--accent-green)" : selectedProject.status === "in_progress" ? "border-(--accent-amber)" : selectedProject.status === "cancelled" ? "border-(--accent-red)" : selectedProject.status === "on_hold" ? "border-(--accent-slate)" : selectedProject.status === "not_started" ? "border-(--accent-slate)" : selectedProject.status === "active" ? "border-(--accent-purple)" : "border-(--accent-red)"} p-4`}
    >
      {isJobsAndProjectsSlideOverOpen ? (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center">
            <h1 className="text-xl text-primary uppercase font-bold">
              {selectedProject.name}
            </h1>
            <button
              onClick={() => {
                jobsAndProjectsSlideOverClose();
                setSelectedProject(null);
              }}
              className="p-4 flex justify-end"
            >
              <X
                size={40}
                className="text-primary transition-all border background-border rounded-full p-1 hover:cursor-pointer hover:text-(--accent-red) hover:border-(--accent-red)"
              />
            </button>
          </div>
          <Link
            className="primary-cyan text-sm uppercase font-semibold p-2 border background-border rounded-lg hover:border-(--accent-cyan) text-center transition-all duration-300 ease-out"
            href={`/projects/${selectedProject.id}?tab=calendar`}
          >
            Go to project
          </Link>
          <div className="flex flex-col gap-2 border-b-2 background-border pb-2">
            <h1 className="text-lg text-primary uppercase font-semibold border-b-2 background-border pb-2">
              Revenue
            </h1>
            <p className="primary-slate text-sm uppercase font-semibold">
              Revenue:{" "}
              <span className="primary-green">
                ${selectedProject.totalRevenue}
              </span>
            </p>
            <p className="primary-slate text-sm uppercase font-semibold">
              Expenses:{" "}
              <span className="primary-red">
                ${selectedProject.totalExpenses}
              </span>
            </p>
            <p className="primary-slate text-sm uppercase font-semibold">
              Profit:{" "}
              <span className="primary-green">
                ${selectedProject.totalProfit}
              </span>
            </p>
            <p className="primary-slate text-sm uppercase font-semibold">
              Margin:{" "}
              <span
                className={`${selectedProject.totalMargin && Number(selectedProject.totalMargin) >= 40 ? "primary-green" : selectedProject.totalMargin && Number(selectedProject.totalMargin) >= 25 ? "primary-slate" : "primary-red"}`}
              >
                To be added...
                {/* $
                {selectedProject.totalMargin &&
                  Number(selectedProject.totalMargin)}
                % */}
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-2 border-b-2 background-border pb-2">
            <h1 className="text-lg text-primary uppercase font-semibold border-b-2 background-border py-2">
              Worked Hours
            </h1>
            <p className="primary-slate text-sm uppercase font-semibold">
              Hours Worked:{" "}
              <span className="primary-cyan">
                {selectedProject.totalHoursWorked}
              </span>
            </p>
            <p className="primary-slate text-sm uppercase font-semibold">
              Hourly Rate:{" "}
              <span className="primary-cyan">
                <span className="primary-green">
                  ${totalProfitPerHour.toFixed(2)}
                  /hour
                </span>
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-2 border-b-2 background-border pb-2">
            <h1 className="text-lg text-primary uppercase font-semibold border-b-2 background-border py-2">
              Details
            </h1>

            <p className="primary-slate text-sm uppercase font-semibold">
              Planned Hours: <span className="primary-cyan">12 hours</span>
            </p>
            <p className="primary-slate text-sm uppercase font-semibold">
              Hours Left: <span className="primary-cyan">2 hours</span>
            </p>
          </div>
          {selectedProject.status === "completed" ? (
            <div>
              <div className="flex flex-col gap-2 border-b-2 background-border pb-2">
                <h1 className="text-lg text-primary uppercase font-semibold border-b-2 background-border py-2">
                  Client Feedback
                </h1>
                <p className="primary-slate text-sm uppercase font-semibold">
                  Paid on Time: <span className="primary-red">2 days late</span>
                </p>
                <p className="primary-slate text-sm uppercase font-semibold">
                  Message from Client:{" "}
                  <span className="primary-cyan">Great work!</span>
                </p>
              </div>
              <div className="flex flex-col gap-2 border-b-2 background-border pb-2">
                <h1 className="text-lg text-primary uppercase font-semibold border-b-2 background-border py-2">
                  Invoice Details
                </h1>
                <p className="primary-slate text-sm uppercase font-semibold">
                  Invoice Number:{" "}
                  <span className="primary-cyan">1234567890</span>
                </p>
                <p className="primary-slate text-sm uppercase font-semibold">
                  Invoice Date: <span className="primary-cyan">12/12/2025</span>
                </p>
                <p className="primary-slate text-sm uppercase font-semibold">
                  Invoice Amount: <span className="primary-cyan">$1000</span>
                </p>
                <p className="primary-slate text-sm uppercase font-semibold">
                  Invoice Status: <span className="primary-cyan">Paid</span>
                </p>
                <p className="primary-slate text-sm uppercase font-semibold">
                  Invoice Due Date:{" "}
                  <span className="primary-cyan">12/12/2025</span>
                </p>
                <p className="primary-slate text-sm uppercase font-semibold">
                  Invoice Payment Date:{" "}
                  <span className="primary-cyan">12/12/2025</span>
                </p>
                <p className="primary-slate text-sm uppercase font-semibold">
                  Invoice Payment Method:{" "}
                  <span className="primary-cyan">Bank Transfer</span>
                </p>
              </div>
              <h1 className="text-lg primary-green text-center uppercase font-semibold border-b-2 background-border py-2">
                {selectedProject.status}
              </h1>
            </div>
          ) : (
            <div>
              <div className="flex flex-col gap-2 border-b-2 background-border pb-2">
                <h1 className="text-lg text-primary uppercase font-semibold border-b-2 background-border py-2">
                  Project Description
                </h1>
                <p className="primary-slate text-sm uppercase font-semibold">
                  {selectedProject.description}
                </p>
              </div>
              <h1 className="text-lg text-primary uppercase font-semibold border-b-2 background-border py-2">
                {selectedProject.status}
              </h1>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
