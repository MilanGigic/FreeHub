"use client";

import { Client, Project, Tabs } from "@/types/types";
import { useCallback, useMemo, useRef, useState } from "react";

export function useSidebarHover({
  projects,
  clients,
}: {
  projects: Project[];
  clients: Client[];
}) {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [hoveredClient, setHoveredClient] = useState<Client | null>(null);
  const [hoveredTab, setHoveredTab] = useState<{
    name: Tabs;
    y: number;
  } | null>(null);

  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredTab(null);
      setHoveredProject(null);
      setHoveredClient(null);
    }, 200);
  }, [clearCloseTimeout]);

  const clearItemTimeout = useCallback(() => {
    if (itemCloseTimeoutRef.current) {
      clearTimeout(itemCloseTimeoutRef.current);
      itemCloseTimeoutRef.current = null;
    }
  }, []);

  const scheduleItemClose = useCallback(() => {
    clearItemTimeout();
    itemCloseTimeoutRef.current = setTimeout(() => {
      setHoveredProject(null);
      setHoveredClient(null);
    }, 150);
  }, [clearItemTimeout]);

  const projectCountByClient = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of projects) {
      counts[p.clientId] = (counts[p.clientId] || 0) + 1;
    }
    return counts;
  }, [projects]);

  const activeProjectCount = useMemo(
    () =>
      projects.filter(
        (p) => p.status === "active" || p.status === "in_progress",
      ).length,
    [projects],
  );

  const activeClientCount = useMemo(
    () => clients.filter((c) => c.status === "active").length,
    [clients],
  );

  const hoveredClientProjects = useMemo(
    () =>
      hoveredClient
        ? projects.filter((p) => p.clientId === hoveredClient.id)
        : [],
    [hoveredClient, projects],
  );

  const handleFlyoutEnter = useCallback(() => {
    clearCloseTimeout();
    clearItemTimeout();
  }, [clearCloseTimeout, clearItemTimeout]);

  const handleDetailLeave = useCallback(() => {
    scheduleClose();
    scheduleItemClose();
  }, [scheduleClose, scheduleItemClose]);

  return {
    hoveredProject,
    setHoveredProject,
    hoveredClient,
    setHoveredClient,
    hoveredTab,
    setHoveredTab,
    scheduleClose,
    clearItemTimeout,
    scheduleItemClose,
    projectCountByClient,
    activeProjectCount,
    activeClientCount,
    hoveredClientProjects,
    handleFlyoutEnter,
    handleDetailLeave,
    clearCloseTimeout,
  };
}
