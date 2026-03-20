"use client";

import { fetchAllProjects } from "@/actions/projects/fetchAllProjects";
import { useDataStore } from "@/lib/store/useDataStore";
import { useAuth } from "@/lib/useAuth";
import { useEffect } from "react";

export default function useFetchAllProjects(enabled = true) {
  const { user } = useAuth();
  const { setProjects } = useDataStore();
  useEffect(() => {
    if (!enabled) return;
    if (!user) return;
    (async () => {
      const res = await fetchAllProjects(user.id);
      if (res.success) {
        if (res.data) {
          setProjects(res.data);
        }
      }
    })();
  }, [enabled, user, setProjects]);
}
