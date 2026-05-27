"use client";

import {
  Select,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { FilterProps } from "./TypeFilter";
import { useState } from "react";
import { TransactionCategory, transactionCategories } from "@/config/constants";
import { useTransactionsFiltersStore } from "@/lib/store/useTransactionsFiltersStore";
import { useTranslations } from "next-intl";

export default function CategoryFilter({
  openFilters,
  setOpenFilters,
}: FilterProps) {
  const { filters, setFilters } = useTransactionsFiltersStore();
  const tCategories = useTranslations("transactions.categories");
  const t = useTranslations("transactions");
  const tCommon = useTranslations("common");

  const [selectedCategory, setSelectedCategory] =
    useState<TransactionCategory | null>(null);

  return (
    <motion.div
      layout="position"
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 28,
      }}
      className="flex items-center gap-2"
    >
      <button
        className={`h-10 px-4 flex items-center gap-2 text-xl border-r-2 transition-colors duration-200 ${
          openFilters === "category" ? "border-zinc-500" : "border-transparent"
        }`}
        onClick={() =>
          openFilters === "category"
            ? setOpenFilters(null)
            : setOpenFilters("category")
        }
      >
        {t("category")}{" "}
        {filters.category ? (
          <span className="text-green-300 bg-cyan-500/15 uppercase">
            - {tCategories(filters.category)}
          </span>
        ) : null}
      </button>
      <AnimatePresence mode="popLayout">
        {openFilters === "category" && (
          <motion.div
            key="category-content"
            layout="position"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 90,
              damping: 15,
              mass: 1,
              delay: 0.04,
            }}
            className="flex items-center gap-2"
          >
            <Select
              value={selectedCategory ? selectedCategory : "All "}
              onValueChange={(value) => {
                setSelectedCategory(value as TransactionCategory);
                setFilters({ category: value });
              }}
            >
              <SelectTrigger
                className="w-full text-primary h-full border-b-2"
                type="button"
              >
                <SelectValue
                  className="text-primary"
                  placeholder={tCommon("selectCategory")}
                />
              </SelectTrigger>
              <SelectContent className="text-primary background-elevated">
                <SelectGroup className="max-h-[300px] overflow-y-scroll p-2 border background-border background-elevated">
                  <SelectLabel>{tCommon("categories")}</SelectLabel>
                  {transactionCategories.map((category, index) => (
                    <SelectItem
                      key={index}
                      value={category}
                      className="p-2 cursor-pointer hover:bg-white/15 transition-all duration-300"
                    >
                      {tCategories(category)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setFilters({ category: null });
              }}
            >
              All
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
