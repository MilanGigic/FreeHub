"use client";

import { fetchAllProjects } from "@/actions/projects/fetchAllProjects";
import { useDataStore } from "@/lib/store/useDataStore";
import { useAuth } from "@/lib/useAuth";
import { useEffect } from "react";

export default function useFetchAllProjects() {
  const { user } = useAuth();
  const { setProjects } = useDataStore();
  useEffect(() => {
    if (!user) return;
    (async () => {
      const res = await fetchAllProjects(user.id);
      if (res.success) {
        if (res.data) {
          setProjects(res.data);
        }
      }
    })();
  }, [user, setProjects]);
}
