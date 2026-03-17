import ClientTable from "./ClientTable";

export default function ClientsMain() {
  return (
    <div className="w-full h-full flex flex-col gap-2 md:gap-4 p-4">
      <ClientTable />
    </div>
  );
}
