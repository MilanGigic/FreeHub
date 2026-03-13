## Freehub

Freehub is a **smart financial command center for freelancers**. It helps you understand what you can safely spend without needing to think like an accountant, by combining client, project, invoicing, and transaction data into a single, focused workspace.

### Key Features

- **Dashboard overview**: High‑level view of finances, clients, projects, reports, and tasks from the `/dashboard` route.
- **Client management**: Create and manage clients, track their status, currency, and engagement over time.
- **Projects & calendar**: Organize work into projects, track revenue/expenses, hours worked, and maintain a project calendar of work logs.
- **Invoices lifecycle**: Draft, send, and track invoices with statuses like `draft`, `sent`, `overdue`, and `paid`, including payment timing and totals.
- **Transactions & expenses**: Log income and expenses, mark deductible items, and link them to projects so project‑level profitability stays up to date.
- **Goals & planning**: Define goals with target amounts, deadlines, and risk profile (`conservative`, `moderate`, `aggressive`) to guide planning.
- **Tax profile**: Capture tax‑relevant profile data (entity type, filing status, home office, mileage, health insurance, etc.) to inform calculations and reports.
- **Authentication & security**: Users, encrypted data encryption keys, and JWT‑based auth are implemented on top of PostgreSQL via Drizzle ORM.
- **Modern UI**: Next.js App Router, Tailwind‑based design, Radix UI primitives, iconography via `lucide-react`, and charts via `recharts`.

### Tech Stack

- **Framework**: Next.js `16` (App Router, `app/` directory)
- **Language**: TypeScript + React `19`
- **Styling**: Tailwind CSS `4`, `tailwind-merge`, `tailwindcss-animate`
- **UI components**: Radix UI (`@radix-ui/react-*`), custom dashboard and client/project components
- **State management**: Zustand for lightweight global UI and domain state
- **Charts & visuals**: `recharts` for financial and reporting charts
- **Database**: PostgreSQL with Drizzle ORM (`drizzle-orm`, `drizzle-kit`)
- **Auth & crypto**: `jose`, `bcrypt`, `cookies-next`

### Project Structure (High Level)

- **`app/`**: Next.js routes and layouts
  - `app/page.tsx` – root route; redirects to `/dashboard` for authenticated users or `/landing` otherwise.
  - `app/(main)/dashboard/page.tsx` – main dashboard UI with finances, clients, projects, reports, tasks, and messages cards.
  - `app/(main)/clients/*` – client‑specific pages (overview, invoices, jobs & projects).
  - `app/(main)/projects/*` – project‑specific pages and revenue/expense views.
  - `app/(main)/reports/*` – reporting views.
  - `app/landing/*` – public marketing/landing experience.
  - `app/api/*` – API routes (e.g. net profit and other computations).
- **`components/`**: Reusable UI and feature components (dashboard cards, clients UI, finances, projects calendar, multi‑step wizards, landing page sections, etc.).
- **`actions/`**: Server actions for domain logic like clients, projects, invoices, finances, and tax profile updates.
- **`db/`**:
  - `db/schema/schema.ts` – Drizzle schema for `users`, `tax_profiles`, `clients`, `projects`, `project_calendar`, `project_finance`, `invoices`, `transactions`, `goals`, and enums.
  - `db/migrations/*` – SQL migrations and Drizzle metadata snapshots.
  - `db/index.ts` – Drizzle/PostgreSQL client wiring.
- **`lib/`**: Utilities and shared logic (auth hooks, JWT handling, session handling, Zustand stores, general utils).
- **`types/`**: Shared TypeScript domain types.

### Requirements

- **Node.js**: >= 20 (recommended to match TypeScript/Next tooling)
- **Package manager**: `pnpm` (project is configured with `pnpm-workspace.yaml`)
- **Database**: PostgreSQL instance accessible from the app

### Getting Started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Configure environment**

   Create a `.env.local` file in the project root and provide the required variables. Typical values include:

   ```bash
   DATABASE_URL=postgres://user:password@localhost:5432/efficio
   JWT_SECRET=your_jwt_secret
   # Add any other keys used in auth/encryption and external services
   ```

3. **Run database migrations**

   Use `drizzle-kit` to push the schema to your database (exact command may vary depending on how you wire it into scripts):

   ```bash
   pnpm drizzle-kit generate
   pnpm drizzle-kit push
   ```

   Check `drizzle.config.ts` and the `db/migrations` directory for the current migration setup.

4. **Start the development server**

   ```bash
   pnpm dev
   ```

   Then open `http://localhost:3000` in your browser. You will be redirected to `/dashboard` (if authenticated) or `/landing` (if not).

5. **Build and run in production**

   ```bash
   pnpm build
   pnpm start
   ```

### Scripts

- **`pnpm dev`**: Run the Next.js development server.
- **`pnpm build`**: Create an optimized production build.
- **`pnpm start`**: Start the production server.
- **`pnpm lint`**: Run ESLint across the project.

### Development Notes

- **State & UI**: Dashboard overlays (e.g. register window prompts) and cross‑page UI state are driven by Zustand stores in `lib/store/*`.
- **Data model**: Financial logic is centered on `project_finance`, `transactions`, and `invoices`, linked back to `projects`, `clients`, and `users`. Enums (currency, client status, project status, invoice status, conservativeness) define the permitted values for key fields.
- **Security**: User records store an encrypted data encryption key (`encryptedDEK`), implying that sensitive financial data is intended to be encrypted at rest beyond simple password hashing.

### Known Issues / TODO

Check `todo.txt` in the project root for current work items. As of this snapshot:

- **Finances page**: “Commit simulate impact” does not update the expenses and transactions state immediately and needs to be fixed.

If you add more TODOs during development, keep `todo.txt` and this section in sync.
