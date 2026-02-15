import ClientPageHeader from "@/components/Clients/ClientPage/ClientPageHeader";
import Overview from "@/components/Clients/ClientPage/Overview/Overview";

export default async function ClientPage({
  params,
}: {
  params: { clientName: string };
}) {
  const { clientName } = await params;

  return (
    <div className="flex flex-col gap-2 md:gap-4 w-full">
      <h1 className="text-2xl font-bold text-secondary uppercase text-center">
        {clientName.replace("-", " ")}
      </h1>
      <header>
        <ClientPageHeader />
      </header>

      <main className="w-full">
        <Overview />
      </main>
    </div>
  );
}

{
  /* 
  TODO:
- Add jobs / projects tab
- Add invoices tab
- Add insights tab

----
- WORK ON SEARCH QUERY FOR CLIENTS PAGE TABS
----

- Add Projects page

----
- AFTER ALL THAT, WORK ON BACKEND
- Rewrite database schema.
- Migrate to neon.
- Publish to vercel.
----
 */
}
