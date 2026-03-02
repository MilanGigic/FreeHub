/*
  TODO:
  - Add jobs / projects tab
  - Add invoices tab
  - Add insights tab
  - WORK ON SEARCH QUERY FOR CLIENTS PAGE TABS
  - Add Projects page
  - AFTER ALL THAT, WORK ON BACKEND
  - Rewrite database schema.
  - Migrate to neon.
  - Publish to vercel.
*/

import { redirect, usePathname } from "next/navigation";

export default function ClientNamePage() {
  const pathname = usePathname();

  redirect(`${pathname}/overview`);
}
