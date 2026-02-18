"use client";

import { useEffect, useState } from "react";
import NewProjectModal from "./NewProjectModal";
import { Project } from "@/types/types";
import { useAuth } from "@/lib/useAuth";

export default function ProjectsHeader() {
  const { user } = useAuth();
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] =
    useState<boolean>(false);

  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Project[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) return;
      const res = await fetch(
        `/api/query-project?q=${query}&userId=${user.id}`,
      );
      const data = await res.json();
      setResults(data);
    };
    fetchResults();
  }, [query, user]);
  return (
    <header className="grid grid-cols-1 md:grid-cols-5 gap-2 uppercase w-full">
      <div className="background-elevated border background-border rounded-lg p-4 w-full">
        <h1 className="text-base font-semibold flex flex-col justify-center text-secondary">
          Total Projects: <span className="text-2xl font-bold">10</span>
        </h1>
      </div>
      <div className="background-elevated border background-border rounded-lg p-4 w-full">
        <h1 className="text-base font-semibold flex flex-col justify-center text-secondary">
          Active Projects: <span className="text-2xl font-bold">7</span>
        </h1>
      </div>
      <div className="background-elevated border background-border rounded-lg p-4 w-full">
        <h1 className="text-base font-semibold flex flex-col justify-center text-secondary">
          Revenue From Projects:{" "}
          <span className="text-2xl font-bold">$10,000</span>
        </h1>
      </div>

      <div className="flex items-center justify-between w-full border background-border rounded-lg p-4 background-elevated col-span-2 relative h-full">
        <div className="flex items-center justify-start w-full relative">
          <input
            type="text"
            placeholder="Search projects"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 rounded-lg border background-border outline-none focus:border-[#2dd4bf] transition-all duration-300 ease-out"
          />
          {query.length > 2 && (
            <div className="absolute top-12 left-0 w-full background-elevated border background-border rounded-lg p-4">
              {results.map((result) => (
                <div key={result.id} className="text-secondary">
                  {result.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          className="primary-green p-2 rounded-lg border background-border outline-none focus:border-[#2dd4bf] transition-all duration-300 ease-out"
          onClick={() => setIsNewProjectModalOpen(true)}
        >
          New Project
        </button>
        {isNewProjectModalOpen && (
          <NewProjectModal
            setIsNewProjectModalOpen={setIsNewProjectModalOpen}
          />
        )}
      </div>
    </header>
  );
}
