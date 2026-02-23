const headerLabels = [
  { label: "Total Active Clients", row: "first", index: 1, value: "8" },
  { label: "Revenue This Month", row: "first", index: 2, value: "$4,500" },
  { label: "Outstanding Invoices", row: "second", index: 3, value: "$1,200" },
  { label: "Average Payment Time", row: "second", index: 4, value: "14 days" },
  { label: "Top Client % of Revenue", row: "third", index: 5, value: "30%" },
  {
    label: "Revenue Concentration Warning",
    row: "third",
    index: 6,
    value: "47%",
  },
];

const getLabelColor = (row: string, index: number) => {
  if (row === "first" && index === 1)
    return "from-(--accent-green) to-[--background-main]";
  if (row === "first" && index === 2)
    return "from-(--background-main) to-(--accent-green)";
  if (row === "second" && index === 3)
    return "from-(--accent-amber) to-(--background-main)";
  if (row === "second" && index === 4)
    return "from-(--background-main) to-(--accent-amber)";
  if (row === "third" && index === 5)
    return "from-(--accent-red) to-(--background-main)";
  if (row === "third" && index === 6)
    return "from-(--background-main) to-(--accent-red)";
  return "";
};

const getLabelRowColor = (row: string) => {
  if (row === "first") return "primary-green";
  if (row === "second") return "primary-amber";
  if (row === "third") return "primary-red";
  return "";
};

const labelGroups = Object.groupBy(headerLabels, (label) => label.row);
export default function ClientsHeader() {
  return (
    <div className="grid gap-2 md:gap-4 grid-cols-1 md:grid-cols-3">
      {Object.values(labelGroups).map((group, index) => (
        <div key={index} className="flex flex-col gap-2">
          {group!.map((label) => (
            <div
              key={label.index}
              className={`p-px rounded-lg bg-linear-to-b 
                ${getLabelColor(label.row, label.index)}`}
            >
              <div
                className={`background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 ${getLabelRowColor(label.row)} uppercase`}
              >
                <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
                  {label.label}
                </h1>
                <p className={`text-2xl font-bold flex items-center gap-2`}>
                  {label.value}{" "}
                  <span
                    className={`${label.label === "Top Client % of Revenue" ? "text-sm lowercase text-secondary" : "hidden"}`}
                  >
                    - Client 1
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
