import ClientsHeader from "@/components/Clients/ClientsHeader";
import ClientsMain from "@/components/Clients/ClientsMain";

export default function ClientsPage() {
  return (
    <div className="flex flex-col gap-2 md:gap-4 w-full">
      <header>
        <ClientsHeader />
      </header>

      <main className="w-full">
        <ClientsMain />
      </main>
    </div>
  );
}
