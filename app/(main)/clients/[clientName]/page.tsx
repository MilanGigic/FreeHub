"use client";

import { redirect, usePathname } from "next/navigation";

export default function ClientNamePage() {
  const pathname = usePathname();

  redirect(`${pathname}/overview`);
}
