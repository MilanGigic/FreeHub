"use client";

import { useUIStore } from "@/lib/store/useUIStore";
import { List, User } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/lib/useAuth";

export default function Header() {
  const { user } = useAuth();
  const { isSidebarOpen, sidebarOpen } = useUIStore();

  return (
    <div className="w-full flex px-4 py-2 gap-2 border-b background-border sticky top-0 z-30 background backdrop-blur-sm">
      {!isSidebarOpen ? (
        <div className="flex justify-start items-center sm:hidden">
          <button onClick={() => sidebarOpen()} className="p-2">
            <List size={40} className="text-primary transition-all" />
          </button>
        </div>
      ) : null}

      <div className="hidden sm:flex items-center">
        <h1 className="text-sm font-bold uppercase text-primary tracking-wider px-4">
          Freehub
        </h1>
      </div>

      <div className="flex items-center justify-end w-full gap-2">
        <div className="flex items-center gap-2">
          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 hover:primary-cyan transition-all"
            >
              <User
                size={20}
                className="text-primary cursor-pointer hover:primary-cyan transition-all"
              />
              <span className="text-sm text-primary font-semibold hidden sm:inline">
                {user.userName}
              </span>
            </Link>
          ) : (
            <Link
              href="/register"
              className="text-primary underline hover:text-(--accent-cyan) transition-all uppercase font-semibold text-sm"
            >
              Register
            </Link>
          )}
        </div>

        <ThemeToggle />
      </div>
    </div>
  );
}
