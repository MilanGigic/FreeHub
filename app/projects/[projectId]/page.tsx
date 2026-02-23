"use client";

import SelectedProject from "@/components/Projects/SelectedProject";
import { ArrowLeftFromLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

export default function SelectedProjectPage() {
  const router = useRouter();

  const handleBack = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.back();
  };
  return (
    <div className="w-full h-full flex flex-col relative">
      <button
        className="flex items-center gap-2 text-primary cursor-pointer uppercase font-semibold hover:text-(--accent-slate) transition-all absolute top-8 left-4"
        onClick={(e) => handleBack(e)}
      >
        <ArrowLeftFromLine />
        Back
      </button>
      <SelectedProject />
    </div>
  );
}
