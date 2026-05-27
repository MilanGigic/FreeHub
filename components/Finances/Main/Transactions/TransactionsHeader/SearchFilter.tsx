"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import { useTransactionsFiltersStore } from "@/lib/store/useTransactionsFiltersStore";
import { useTranslations } from "next-intl";
import { ChangeEvent, useEffect, useState } from "react";

export type SearchableColumn =
  | "projectName"
  | "merchantName"
  | "category"
  | "note"
  | "title";

const SEARCHABLE_COLUMNS: SearchableColumn[] = [
  "projectName",
  "merchantName",
  "category",
  "note",
  "title",
];

export default function SearchFilter() {
  const { filters, setFilters } = useTransactionsFiltersStore();

  const [search, setSearch] = useState<string>("");

  const tCommon = useTranslations("common");
  const t = useTranslations("transactions");

  const debouncedSearch = useDebounce(search, 150);

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <Input
        value={search}
        onChange={(e) => handleChange(e)}
        disabled={!filters.searchColumn}
        placeholder={
          filters.searchColumn ? "" : `${t("selectSearchableColumn")}`
        }
        className="text-primary border background-border rounded-2xl text-center disabled:border-(--accent-amber) disabled:bg-(--accent-red)/35 transition-all duration-300"
      />
      <div className="flex items-center justify-start gap-4">
        <h1 className="text-primary w-[200px] uppercase tracking-wider text-center">
          Search in:
        </h1>
        <Select
          value={filters.searchColumn ?? undefined}
          onValueChange={(value) =>
            setFilters({
              searchColumn: value as SearchableColumn,
            })
          }
        >
          <SelectTrigger
            className="w-full text-primary h-full border-b-2"
            type="button"
          >
            <SelectValue
              className="text-primary"
              placeholder={
                filters.searchColumn
                  ? t(`${filters.searchColumn}`)
                  : t("selectSearchableColumn")
              }
            />
          </SelectTrigger>
          <SelectContent className="text-primary background-elevated">
            <SelectGroup className="max-h-[300px] overflow-y-scroll p-2 border background-border background-elevated">
              <SelectLabel>{tCommon("categories")}</SelectLabel>
              {SEARCHABLE_COLUMNS.map((header, index) => (
                <SelectItem
                  key={index}
                  value={header}
                  className="p-2 cursor-pointer hover:bg-white/15 transition-all duration-300"
                >
                  {t(header)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
