import Income from "./Revenue/Income";
import Expenses from "./Revenue/Expenses";
import HourlyRate from "./Revenue/HourlyRate";
import Profit from "./Revenue/Profit";
import HoursWorked from "./Revenue/HoursWorked";

export default function Revenue() {
  return (
    <div className="w-full flex gap-2 md:gap-4 justify-between h-full">
      <Income />
      <Expenses />
      <div className="w-full flex flex-col gap-2 md:gap-4 h-full">
        <Profit />

        <div className="w-full flex flex-col gap-2 md:gap-4 background-elevated border background-border rounded-lg p-4 items-center">
          <HourlyRate />
          <div className="flex flex-col gap-2 md:gap-4 justify-start w-full">
            <HoursWorked />
          </div>
        </div>
      </div>
    </div>
  );
}
