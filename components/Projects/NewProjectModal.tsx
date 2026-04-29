"use client";

import { fetchAllClients } from "@/actions/clients/fetchAllClients";
import { addNewProject } from "@/actions/projects/addNewProject";
import { Client, ProjectForm, ProjectStatus } from "@/types/types";
import { X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/lib/useAuth";
import { useUIStore } from "@/lib/store/useUIStore";
import { useDataStore } from "@/lib/store/useDataStore";
import { useTranslations } from "next-intl";
import { useClientStore } from "@/lib/store/useClientStore";
import { Spinner } from "../ui/spinner";

export default function NewProjectModal() {
  const t = useTranslations("projects");
  const { user } = useAuth();
  const {
    setIsNewProjectModalLoading,
    setIsNewProjectModalOpen,
    isNewProjectModalLoading,
  } = useUIStore();
  const { setProjects } = useDataStore();
  const { setClientProjects } = useClientStore();
  const [error, setError] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<ProjectForm>({
    name: "",
    description: "",
    status: "not_started",
  });
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      setIsNewProjectModalLoading(true);
      setError(null);

      if (!user) return;
      try {
        const res = await fetchAllClients(user.id);
        if (res.success) {
          if (res.data) {
            setClients(res.data);
          }
        }
      } catch (error) {
        setError(error as string);
      } finally {
        setIsNewProjectModalLoading(false);
      }
    };
    fetchClients();
  }, [user, setIsNewProjectModalLoading]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsNewProjectModalLoading(true);
    setError(null);
    if (!selectedClient) {
      toast.error(t("pleaseSelectClient"));
      setIsNewProjectModalLoading(false);
      return;
    }

    if (!user) {
      toast.error(t("pleaseLoginToAdd"));
      setIsNewProjectModalLoading(false);
      return null;
    }

    const res = await addNewProject(projectForm, selectedClient, user);
    if (res.data) {
      if (res.success) {
        setProjects(res.data);
        toast.success(t("projectAddedSuccess"));
        setIsNewProjectModalLoading(false);
        setProjectForm({
          name: "",
          description: "",
          status: "not_started",
        });
        setSelectedClient(null);
        setIsNewProjectModalOpen(false);

        if (res.clientProjects) {
          setClientProjects(res.clientProjects);
        }
      }
      if (!res.success) {
        toast.error(res.error);
        setIsNewProjectModalLoading(false);
      }
    } else {
      toast.error(t("projectAddedError") + res.error);
      setIsNewProjectModalLoading(false);
      setError(t("projectAddedError") + res.error);
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <h1 className="primary-red">{error}</h1>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-2 md:gap-4 w-full background-elevated border background-border rounded-lg p-4 absolute top-12 right-0 primary-slate animate-flip-down animate-duration-1500 animate-ease-out"
      onSubmit={(e) => handleSubmit(e)}
    >
      <button type="button" onClick={() => setIsNewProjectModalOpen(false)}>
        <X
          size={40}
          className="text-primary transition-all border background-border rounded-full p-1 hover:cursor-pointer hover:text-(--accent-red) hover:border-(--accent-red)"
        />
      </button>
      <div className="flex flex-col gap-2 md:gap-4 w-full border-b-2 background-border pb-4 background-elevated">
        <h1>{t("client")}</h1>
        <select
          id="client"
          name="client"
          className="rounded-md background-elevated border background-border p-4 outline-none text-sm text-primary focus-border-accent transition-all"
          value={selectedClient?.id ?? ""}
          onChange={(e) => {
            const client = clients.find((c) => c.id === e.target.value);
            if (client) {
              setSelectedClient(client);
            } else {
              setSelectedClient(null);
            }
          }}
        >
          <option value="">{t("selectClient")}</option>
          {clients.map((client) => (
            <option
              key={client.id}
              value={client.id}
              className="text-primary background-elevated border background-border rounded-lg p-2"
            >
              {client.firstName} {client.lastName}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2 md:gap-4 w-full">
        <label htmlFor="name">{t("nameLabel")}</label>
        <input
          type="text"
          id="name"
          name="name"
          className="w-full p-2 rounded-lg border background-border outline-none text-primary focus-border-accent transition-all duration-300 ease-out"
          value={projectForm.name ? projectForm.name : ""}
          onChange={(e) =>
            setProjectForm({ ...projectForm, name: e.target.value })
          }
        />
      </div>
      <div className="flex flex-col gap-2 md:gap-4 w-full">
        <label htmlFor="description">{t("descriptionLabel")}</label>
        <input
          type="text"
          id="description"
          name="description"
          className="w-full p-2 rounded-lg border background-border outline-none text-primary focus-border-accent transition-all duration-300 ease-out"
          value={projectForm.description ? projectForm.description : ""}
          onChange={(e) =>
            setProjectForm({ ...projectForm, description: e.target.value })
          }
        />
      </div>
      <div className="flex flex-col gap-2 md:gap-4 w-full">
        <label htmlFor="status">{t("statusLabel")}</label>
        <select
          id="status"
          name="status"
          className="rounded-md background-elevated border background-border p-4 outline-none text-sm text-primary focus-border-accent transition-all"
          value={projectForm.status ? projectForm.status : ""}
          onChange={(e) =>
            setProjectForm({
              ...projectForm,
              status: e.target.value as ProjectStatus,
            })
          }
        >
          <option value="">{t("selectStatus")}</option>
          <option value="active">{t("statusActiveOption")}</option>
          <option value="in_progress">{t("statusInProgressOption")}</option>
          <option value="completed">{t("statusCompletedOption")}</option>
          <option value="cancelled">{t("statusCancelledOption")}</option>
          <option value="on_hold">{t("statusOnHoldOption")}</option>
          <option value="not_started">{t("statusNotStartedOption")}</option>
        </select>
      </div>
      <div className="flex flex-col gap-2 md:gap-4 w-full">
        <button
          type="submit"
          className="primary-green p-2 rounded-lg border text-center background-border hover:border-(--accent-green) outline-none focus-border-accent transition-all duration-300 ease-out cursor-pointer"
        >
          {isNewProjectModalLoading ? (
            <p className="w-full text-center flex justify-center items-center">
              <Spinner className="size-6" />
            </p>
          ) : (
            <p>{t("createProject")}</p>
          )}
        </button>
      </div>
    </form>
  );
}
