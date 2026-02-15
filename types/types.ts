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

export interface Transaction {
  id: string;
  userId: string;
  type: "income" | "expense";
  title: string;
  amount: string;
  categoryId: string | null;
  description: string | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
