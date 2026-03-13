"use client";

import ClientsCard from "@/components/Dashboard/ClientsCard";
import FinancesCard from "@/components/Dashboard/FinancesCard";
import MessagesCard from "@/components/Dashboard/MessagesCard";
import ProjectsCard from "@/components/Dashboard/ProjectsCard";
import ReportsCard from "@/components/Dashboard/ReportsCard";
import TasksCard from "@/components/Dashboard/TasksCard";
import { useUIStore } from "@/lib/store/useUIStore";
import Link from "next/link";

export default function DashboardPage() {
  const { setIsRegisterWindowOpen, isRegisterWindowOpen } = useUIStore();

  return (
    <div className="w-full h-full relative">
      {isRegisterWindowOpen ? (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-xs w-full h-full p-4">
          <div className="flex flex-col items-center justify-center w-full h-full max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-primary">
              Register Account
            </h1>
            <p className="text-lg font-semibold primary-slate mb-4">
              To get started, please register your account.
            </p>
            <div className="w-full flex flex-col gap-2">
              <Link
                href="/register"
                onClick={() => setIsRegisterWindowOpen(false)}
                className="py-2 px-4 text-(--accent-cyan) text-lg font-bold uppercase border background-border rounded-lg w-full background-elevated hover:scale-105 transition-all duration-300 cursor-pointer text-center"
              >
                Register
              </Link>
              <button
                onClick={() => setIsRegisterWindowOpen(false)}
                className="primary-red py-2 px-4 text-lg font-bold uppercase border background-border rounded-lg w-full background-elevated hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="w-full h-full flex flex-col gap-4 primary-slate">
        <div className="flex flex-col xl:flex-row gap-4 xl:h-[550px]">
          <FinancesCard />
          <ClientsCard />
          <ProjectsCard />
        </div>
        <div className="flex flex-col xl:flex-row gap-4">
          <TasksCard />
          <ReportsCard />
          <MessagesCard />
        </div>
      </div>
    </div>
  );
}
