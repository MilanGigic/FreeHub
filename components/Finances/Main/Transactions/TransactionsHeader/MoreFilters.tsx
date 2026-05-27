"use client";

import { useDataStore } from "@/lib/store/useDataStore";
import { User } from "@/types/types";
import { useState } from "react";
import {
  Select,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useTransactionsFiltersStore } from "@/lib/store/useTransactionsFiltersStore";
import { useClientStore } from "@/lib/store/useClientStore";
import useFetchAllClients from "@/components/Clients/hooks/(clients)/useFetchAllClients";
import useFetchAllProjects from "@/components/Projects/hooks/useFetchAllProjects";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

export default function MoreFilters({ user }: { user: User | null }) {
  const { projects } = useDataStore();
  const { clients } = useClientStore();

  const { filters, setFilters, resetFilters } = useTransactionsFiltersStore();

  const [displayMin, setDisplayMin] = useState<string>("");
  const [displayMax, setDisplayMax] = useState<string>("");

  const formatNumber = (value: string): string => {
    // Strip everything except digits
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";

    // Format using Serbian locale — uses . as thousands separator
    return Number(digits).toLocaleString("sr-RS");
  };

  const handleMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);

    setDisplayMin(formatted);
  };

  const handleMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);

    setDisplayMax(formatted);
  };

  const tCommon = useTranslations("common");
  const t = useTranslations("transactions");
  const p = useTranslations("projects");

  useFetchAllClients();
  useFetchAllProjects();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 90, damping: 15 }}
      className="absolute right-0 top-full z-50 w-xs background-elevated border rounded-2xl border-white/8 p-4 flex flex-col gap-4"
    >
      <div>
        <h1 className="text-primary uppercase tracking-wider">
          {tCommon("project")}
        </h1>
        <Select
          value={filters.projectName!}
          onValueChange={(value) => setFilters({ projectName: value })}
        >
          <SelectTrigger
            className="w-full text-primary h-full border-b-2 pb-2"
            type="button"
          >
            <SelectValue
              className="text-primary"
              placeholder={p("selectProject")}
            />
          </SelectTrigger>
          <SelectContent className="text-primary background-elevated">
            <SelectGroup className="max-h-[300px] overflow-y-scroll p-2 border background-border background-elevated">
              <SelectLabel>{p("projects")}</SelectLabel>
              {projects.map((project) => (
                <SelectItem
                  key={project.id}
                  value={project.name}
                  className="p-2 cursor-pointer hover:bg-white/15 transition-all duration-300"
                >
                  {project.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h1 className="text-primary uppercase tracking-wider">
          {tCommon("client")}
        </h1>
        <Select
          value={filters.clientName!}
          onValueChange={(value) => setFilters({ clientName: value })}
        >
          <SelectTrigger
            className="w-full text-primary h-full border-b-2 pb-2"
            type="button"
          >
            <SelectValue
              className="text-primary"
              placeholder={p("selectProject")}
            />
          </SelectTrigger>
          <SelectContent className="text-primary background-elevated">
            <SelectGroup className="max-h-[300px] overflow-y-scroll p-2 border background-border background-elevated">
              <SelectLabel>{tCommon("clients")}</SelectLabel>
              {clients.map((client) => (
                <SelectItem
                  key={client.id}
                  value={client.clientName}
                  className="p-2 cursor-pointer hover:bg-white/15 transition-all duration-300"
                >
                  {client.clientName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h1 className="text-primary uppercase tracking-wider">
          {tCommon("amountRange")}
        </h1>

        <div className="flex gap-2">
          <Input
            type="text"
            inputMode="numeric"
            value={displayMin}
            onChange={(e) => handleMin(e)}
          />
          <Input
            type="text"
            inputMode="numeric"
            value={displayMax}
            onChange={(e) => handleMax(e)}
          />
        </div>
      </div>

      <div>
        <FieldGroup className="">
          <Field orientation="horizontal">
            <Checkbox
              id="deductibleOnly"
              name="deductible-only"
              checked={filters.deductibleOnly}
              onCheckedChange={(checked) =>
                setFilters({
                  deductibleOnly: !!checked,
                })
              }
            />
            <FieldLabel htmlFor="deductible-only">
              {t("deductibleOnly")}
            </FieldLabel>
          </Field>
        </FieldGroup>
      </div>
      <div>
        <FieldGroup className="">
          <Field orientation="horizontal">
            <Checkbox
              id="recurringOnly"
              name="recurring-only"
              checked={filters.recurringOnly}
              onCheckedChange={(checked) =>
                setFilters({
                  recurringOnly: !!checked,
                })
              }
            />
            <FieldLabel htmlFor="recurring-only">
              {t("recurringOnly")}
            </FieldLabel>
          </Field>
        </FieldGroup>
      </div>
      <div>
        <FieldGroup className="">
          <Field orientation="horizontal">
            <Checkbox
              id="hasNotesOnly"
              name="has-notes-only"
              checked={filters.hasNotesOnly}
              onCheckedChange={(checked) =>
                setFilters({
                  hasNotesOnly: !!checked,
                })
              }
            />
            <FieldLabel htmlFor="has-notes-only">
              {t("hasNotesOnly")}
            </FieldLabel>
          </Field>
        </FieldGroup>
      </div>

      <button className="border p-2 rounded-2xl" onClick={() => resetFilters()}>
        {t("resetFilters")}
      </button>
    </motion.div>
  );
}
