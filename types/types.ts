export type Currency = "USD" | "EUR" | "GBP" | "JPY" | "RSD" | "CAD";

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

export type TaxParameterValue =
  | { type: "number"; value: number }
  | { type: "percentage"; value: number } // store as 0.10 for 10%
  | { type: "integer"; value: number }
  | { type: "string"; value: string }
  | { type: "boolean"; value: boolean }
  | { type: "object"; value: Record<string, number | string | boolean | null> }
  | { type: "array"; value: Array<number | string | boolean | null> };

export type Regime =
  | "freelancer"
  | "pausal"
  | "knjigas"
  | "d.o.o."
  | "employee"
  | "hybrid";

export type SerbianMunicipality = {
  code: string; // stable internal key (normalized)
  name: string; // display name
  city?: string; // parent city (for Beograd, Niš, Novi Sad...)
};

export type ClientForm = {
  clientName: string;
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
  clientName: string;
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
  projectId: string | null;
  title: string;
  type: "income" | "expense";
  amount: string;
  deductible: boolean;
  category: string;
  currency: Currency;
  isRecurring: boolean;
  merchantName: string | null;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
  transactionDate: Date;
  projectName?: string | null;
  clientName?: string | null;
}

export type Conservativeness = "conservative" | "moderate" | "aggressive";

export type Tabs = "dashboard" | "clients" | "projects" | "finances";

export type Goal = {
  id: string;
  userId: string;
  name: string;
  targetAmount: string;
  deadline: Date | null;
  conservativeness: Conservativeness;
  createdAt: Date;
};

export interface Project {
  id: string;
  userId: string;
  clientId: string;
  clientName: string;
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

// FIX THE ISSUES WITH NEWLY ADDED CLIENTNAME INSTEAD OF FIRSTNAME AND LASTNAME

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
  projectId: string;
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

export interface TaxProfile {
  // Base tax profile fields
  id?: string;
  userId?: string;
  country?: string | null;
  taxResidency?: "resident" | "non_resident" | null;
  primaryHealthInsuredElsewhere?: boolean | null;
  alreadyEmployed?: boolean | null;
  isUnder40?: boolean | null;

  // --- USA Fields ---
  entityType?: string | null;
  filingStatus?: string | null;
  stateResidence?: string | null;
  homeOfficeSqft?: number | null;
  homeOfficeSimplified?: boolean | null;
  mileageTracking?: boolean | null;
  healthInsuranceDeduction?: boolean | null;
  retirementContribution?: boolean | null;

  // --- Serbia Fields ---
  // 1. REGIME
  currentRegime?: "frilenser" | "pausal" | "knjigas" | null;

  // 2. FRILENSER
  preferredModel?: "modelA" | "modelB" | null;

  // 3. PAUSAL
  pausalActivityCode?: string | null;
  pausalMunicipalityId?: string | null;
  officialPausalMonthlyAmount?: string | null;
  pausalResenjeDate?: Date | null;
  pausalResenjeDocumentUrl?: string | null;
  personalSalaryElected?: boolean | null;
  personalSalaryGrossMonthly?: string | null;

  // 4. KNJIGAS
  businessModel?: "services" | "goods" | "mixed" | null;
  paysPersonalSalary?: boolean | null;
  personalSalaryAmount?: string | null;
  vatThresholdWarning?: boolean | null;

  // 5. VAT
  vatRegistered?: boolean | null;
  vatRegistrationDate?: Date | null;

  // 6. INDEPENDENCE TEST
  independenceTestScore?: number | null;
  independenceTestCalculatedAt?: Date | null;

  // 7. SHARED FINANCIALS (amounts in RSD)
  estimatedAnnualGross?: string | null;

  // 8. META
  onboardingCompletedAt?: Date | null;
  notes?: string | null;

  // Common meta
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
