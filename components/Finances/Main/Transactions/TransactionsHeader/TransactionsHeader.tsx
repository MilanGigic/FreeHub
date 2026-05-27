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
    <div className="flex flex-col items-center justify-center w-full gap-4">
      <SearchFilter />
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
          <motion.div
            layout="position"
            transition={{
              layout: { type: "spring", stiffness: 300, damping: 25 },
            }}
            style={{ backgroundColor: "transparent" }}
            className="relative w-2xl"
          >
            {openTransactionModal && (
              <AddTransactionModal
                onClose={() => setOpenTransactionModal(false)}
              />
            )}
          </motion.div>
        </motion.div>

        <div className="relative">
          <button
            className="h-10 px-4 flex items-center gap-2 text-xl transition-colors duration-200"
            onClick={() => setShowMoreFilters(!showMoreFilters)}
          >
            {t("moreFilters")}:
          </button>
          {showMoreFilters && <MoreFilters user={user} />}
        </div>
      </motion.div>
    </div>
  );
}
