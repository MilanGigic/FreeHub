export type Tab =
  | "Dashboard"
  | "Finances"
  | "Clients"
  | "Projects"
  | "Tasks"
  | "Reports"
  | "Messages";

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: "income" | "expense";
  color: string | null;
  icon: string | null;
  createdAt: Date;
  updatedAt: Date;
}
