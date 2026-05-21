"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";
import TypeFilter from "./TypeFilter";
import CategoryFilter from "./CategoryFilter";
import DateFilter from "./DateFilter";
import AddTransactionModal from "@/components/Projects/AddTransactionModal";
import { useTranslations } from "next-intl";

export default function TransactionsHeader() {
  const t = useTranslations("transactions");
  const [openFilters, setOpenFilters] = useState<
    "type" | "category" | "date" | null
  >(null);
  const [openTransactionModal, setOpenTransactionModal] =
    useState<boolean>(false);

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      <Input className="text-primary border background-border rounded-2xl" />
      <motion.div
        layout="position"
        className="primary-slate flex gap-4 justify-between w-full items-center"
      >
        <div className="flex items-center gap-4">
          {/* FILTERS */}
          <TypeFilter
            openFilters={openFilters}
            setOpenFilters={setOpenFilters}
          />
          <CategoryFilter
            openFilters={openFilters}
            setOpenFilters={setOpenFilters}
          />
          <DateFilter
            openFilters={openFilters}
            setOpenFilters={setOpenFilters}
          />
        </div>

        <motion.div
          layout="position"
          transition={{
            layout: { type: "spring", stiffness: 300, damping: 25 },
          }}
          className="relative"
        >
          <button
            onClick={() => setOpenTransactionModal(true)}
            className={`text-primary uppercase tracking-wide font-bold p-4 border rounded-2xl 
      ${openTransactionModal ? "bg-(--accent-green)/40" : "bg-(--accent-green)/20 border-(--accent-green) hover:bg-(--accent-green)/40"}
      transition-all duration-300`}
          >
            {t("addTransactionButton")}
          </button>
          <div className="relative w-2xl h-full">
            {openTransactionModal && (
              <AddTransactionModal
                onClose={() => setOpenTransactionModal(false)}
              />
            )}
          </div>
        </motion.div>

        <div>
          <button>More Filters:</button>
        </div>
      </motion.div>
    </div>
  );
}
