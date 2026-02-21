"use client";

import { useUIStore } from "@/lib/store/useUIStore";
import { X } from "lucide-react";

export default function JobsAndProjectsSlideOver() {
  const {
    isJobsAndProjectsSlideOverOpen,
    jobsAndProjectsSlideOverClose,
    setSelectedProject,
    selectedProject,
  } = useUIStore();

  if (!selectedProject) return null;
  return (
    <div
      className={`fixed top-14 right-0 h-full w-full max-w-sm background-elevated z-100 border-l-2 ${selectedProject.status === "Done" ? "border-[var(--accent-green)]" : selectedProject.status === "In Progress" ? "border-[var(--accent-amber)]" : "border-[var(--accent-red)]"} p-4`}
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
                className="text-primary transition-all border background-border rounded-full p-1 hover:cursor-pointer hover:primary-red"
              />
            </button>
          </div>
          <div className="flex flex-col gap-2 border-b-2 background-border pb-2">
            <h1 className="text-lg text-primary uppercase font-semibold border-b-2 background-border pb-2">
              Revenue
            </h1>
            <p className="text-secondary text-sm uppercase font-semibold">
              Revenue:{" "}
              <span className="primary-green">${selectedProject.revenue}</span>
            </p>
            <p className="text-secondary text-sm uppercase font-semibold">
              Expenses:{" "}
              <span className="primary-red">${selectedProject.expenses}</span>
            </p>
            <p className="text-secondary text-sm uppercase font-semibold">
              Profit:{" "}
              <span className="primary-green">${selectedProject.profit}</span>
            </p>
            <p className="text-secondary text-sm uppercase font-semibold">
              Margin:{" "}
              <span
                className={`${selectedProject.margin >= 40 ? "primary-green" : selectedProject.margin >= 25 ? "primary-slate" : "primary-red"}`}
              >
                ${selectedProject.margin}%
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-2 border-b-2 background-border pb-2">
            <h1 className="text-lg text-primary uppercase font-semibold border-b-2 background-border py-2">
              Worked Hours
            </h1>
            <p className="text-secondary text-sm uppercase font-semibold">
              Hours Worked:{" "}
              <span className="primary-cyan">
                {selectedProject.hoursWorked}
              </span>
            </p>
            <p className="text-secondary text-sm uppercase font-semibold">
              Hourly Rate:{" "}
              <span className="primary-cyan">
                ${selectedProject.hourlyRate}/hour
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-2 border-b-2 background-border pb-2">
            <h1 className="text-lg text-primary uppercase font-semibold border-b-2 background-border py-2">
              Details
            </h1>

            <p className="text-secondary text-sm uppercase font-semibold">
              Planned Hours: <span className="primary-cyan">12 hours</span>
            </p>
            <p className="text-secondary text-sm uppercase font-semibold">
              Hours Left: <span className="primary-cyan">2 hours</span>
            </p>
            <p className="text-secondary text-sm uppercase font-semibold">
              Profit per Hour{" "}
              <span className="primary-green">
                ${selectedProject.profit / selectedProject.hoursWorked}/hour
              </span>
            </p>
          </div>
          {selectedProject.status === "Done" ? (
            <div>
              <div className="flex flex-col gap-2 border-b-2 background-border pb-2">
                <h1 className="text-lg text-primary uppercase font-semibold border-b-2 background-border py-2">
                  Client Feedback
                </h1>
                <p className="text-secondary text-sm uppercase font-semibold">
                  Paid on Time: <span className="primary-red">2 days late</span>
                </p>
                <p className="text-secondary text-sm uppercase font-semibold">
                  Message from Client:{" "}
                  <span className="primary-cyan">Great work!</span>
                </p>
              </div>
              <div className="flex flex-col gap-2 border-b-2 background-border pb-2">
                <h1 className="text-lg text-primary uppercase font-semibold border-b-2 background-border py-2">
                  Invoice Details
                </h1>
                <p className="text-secondary text-sm uppercase font-semibold">
                  Invoice Number:{" "}
                  <span className="primary-cyan">1234567890</span>
                </p>
                <p className="text-secondary text-sm uppercase font-semibold">
                  Invoice Date: <span className="primary-cyan">12/12/2025</span>
                </p>
                <p className="text-secondary text-sm uppercase font-semibold">
                  Invoice Amount: <span className="primary-cyan">$1000</span>
                </p>
                <p className="text-secondary text-sm uppercase font-semibold">
                  Invoice Status: <span className="primary-cyan">Paid</span>
                </p>
                <p className="text-secondary text-sm uppercase font-semibold">
                  Invoice Due Date:{" "}
                  <span className="primary-cyan">12/12/2025</span>
                </p>
                <p className="text-secondary text-sm uppercase font-semibold">
                  Invoice Payment Date:{" "}
                  <span className="primary-cyan">12/12/2025</span>
                </p>
                <p className="text-secondary text-sm uppercase font-semibold">
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
                <p className="text-secondary text-sm uppercase font-semibold">
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
