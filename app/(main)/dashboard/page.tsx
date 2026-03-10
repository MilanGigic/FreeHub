"use client";

import { useUIStore } from "@/lib/store/useUIStore";
import Link from "next/link";

const tabs = [
  "Finances",
  "Clients",
  "Projects",
  "Tasks",
  "Reports",
  "Messages",
];

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

      <div className="w-full h-full grid grid-cols-3 gap-4">
        {tabs.map((tab) => (
          <div
            key={tab}
            className="background-elevated border background-border rounded-lg p-4 flex flex-col gap-2 shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-black/60 transition-all duration-50 cursor-pointer text-primary"
          >
            <h1>{tab}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}
