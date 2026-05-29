"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import TypeFilter from "./TypeFilter";
import CategoryFilter from "./CategoryFilter";
import DateFilter from "./DateFilter";
import AddTransactionModal from "@/components/Projects/AddTransactionModal";
import { useTranslations } from "next-intl";

import MoreFilters from "./MoreFilters";
import { useAuth } from "@/lib/useAuth";
import SearchFilter from "./SearchFilter";

export default function TransactionsHeader() {
  const { user } = useAuth();

  const t = useTranslations("transactions");

  const [openFilters, setOpenFilters] = useState<
    "type" | "category" | "date" | null
  >(null);

  const [openTransactionModal, setOpenTransactionModal] =
    useState<boolean>(false);

  const [showMoreFilters, setShowMoreFilters] = useState<boolean>(false);

  return (
    <div className="flex flex-col w-full gap-4">
      {/* SEARCH */}
      <SearchFilter />

      {/* HEADER CONTROLS */}
      <motion.div
        layout
        className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 w-full"
      >
        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full xl:w-auto text-primary">
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

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto text-primary">
          {/* ADD TRANSACTION */}
          <motion.div
            layout="position"
            transition={{
              layout: {
                type: "spring",
                stiffness: 300,
                damping: 25,
              },
            }}
            className="relative w-full sm:w-auto"
          >
            <button
              onClick={() => setOpenTransactionModal(true)}
              className={`w-full sm:w-auto text-primary uppercase tracking-wide font-bold px-4 py-3 border rounded-2xl whitespace-nowrap ${
                openTransactionModal
                  ? "bg-(--accent-green)/40"
                  : "bg-(--accent-green)/20 border-(--accent-green) hover:bg-(--accent-green)/40"
              } transition-all duration-300`}
            >
              {t("addTransactionButton")}
            </button>

            <motion.div
              layout="position"
              transition={{
                layout: {
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                },
              }}
              className="relative w-full"
            >
              {openTransactionModal && (
                <AddTransactionModal
                  onClose={() => setOpenTransactionModal(false)}
                />
              )}
            </motion.div>
          </motion.div>

          {/* MORE FILTERS */}
          <div className="relative w-full sm:w-auto">
            <button
              className="w-full sm:w-auto h-12 px-4 flex items-center justify-center gap-2 text-base md:text-lg border rounded-2xl background-elevated border-white/10 text-primary hover:border-(--accent-cyan) hover:bg-(--accent-cyan)/10 transition-all duration-300"
              onClick={() => setShowMoreFilters(!showMoreFilters)}
            >
              {t("moreFilters")}
            </button>

            {showMoreFilters && <MoreFilters user={user} />}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
