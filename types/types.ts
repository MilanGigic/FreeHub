export type Tab =
  | "Dashboard"
  | "Finances"
  | "Clients"
  | "Projects"
  | "Tasks"
  | "Reports"
  | "Messages";

export type ClientPageTab =
  | "overview"
  | "jobs / projects"
  | "invoices"
  | "insights";

export type ProjectStatus =
  | "active"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "on_hold"
  | "not_started";

export type InvoiceStatus = "draft" | "overdue" | "sent" | "paid";

export type ClientForm = {
  firstName: string;
  lastName: string;
  email: string;
  currency: string;
  status: string;
  startDate: string;
  endDate: string | null;
};

export type ProjectForm = {
  name: string;
  description: string;
  status: ProjectStatus;
};

export interface User {
  id: string;
  email: string;
  userName: string;
}

export interface Client {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  currency: "USD" | "EUR" | "GBP" | "JPY" | "RSD" | "CAD";
  status: "active" | "paused" | "archived";
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

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

export interface Project {
  id: string;
  userId: string;
  clientId: string;
  name: string;
  description: string | null;
  totalRevenue: string | null;
  totalExpenses: string | null;
  totalProfit: string | null;
  totalMargin: string | null;
  totalHoursWorked: number | null;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectCalendar {
  id: string;
  userId: string;
  projectId: string;
  date: Date;
  note: string;
  hoursWorked: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectRevenue {
  id: string;
  userId: string;
  projectId: string;
  type: "income" | "expense";
  amount: string;
  note: string;
  hourlyRate: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  userId: string;
  clientId: string;
  issueDate: Date;
  dueDate: Date;
  paymentDate: Date | null;
  status: InvoiceStatus;
  totalAmount: string;
  paidAmount: string | null;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}
