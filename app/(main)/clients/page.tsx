import ClientsHeader from "@/components/Clients/ClientsHeader";
import ClientsMain from "@/components/Clients/ClientsMain";
import NewClientModal from "@/components/Clients/NewClientModal";

export default function ClientsPage() {
  return (
    <div className="flex flex-col gap-2 md:gap-4 w-full min-h-screen h-full">
      <header>
        <ClientsHeader />
      </header>

      <main className="w-full flex justify-center items-center">
        <NewClientModal />
      </main>

      <footer className="w-full">
        <ClientsMain />
      </footer>
    </div>
  );
}
