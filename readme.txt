Efficio - Recent Code Changes (Invoice Bugfix)
=============================================

Date: 2026-03-06

Summary
-------
This document describes the code changes made to fix the bug where adding an invoice (especially when deployed on Vercel) could result in the same invoice being counted multiple times and storing incorrect data.

Changes Made
------------

1) Idempotency guard for invoice creation
----------------------------------------
- File: actions/invoices/addInvoice.ts
- Function: addInvoice

What changed:
- Introduced normalized date variables:
  - normalizedIssueDate = new Date(issueDate)
  - normalizedDueDate = new Date(dueDate)
- Added an idempotency guard BEFORE inserting a new invoice:
  - The code now calls db.query.invoices.findFirst(...) with a where clause matching:
    - userId
    - clientId
    - projectId (selectedProjectId)
    - totalAmount (amount)
    - issueDate (normalizedIssueDate)
    - dueDate (normalizedDueDate)
    - note
  - If an existing invoice with the same payload is found:
    - The server calculates:
      - outstandingInvoices via calculateOutstandingInvoices(clientId)
      - overdueInvoices via calculateOverdueInvoices(clientId)
      - paidInvoices via calculatePaidInvoices(clientId)
    - On full success, it returns:
      - success: true
      - data: existingInvoice
      - outstandingInvoices
      - overdueInvoices (data + count)
      - paidInvoices
    - If any of the calculations fail, it still returns:
      - success: true
      - data: existingInvoice
    - Crucially, NO NEW ROW is inserted in this case.

- The actual insert now uses the normalized dates:
  - issueDate: normalizedIssueDate
  - dueDate: normalizedDueDate
  - status: normalizedDueDate < new Date() ? "overdue" : "sent"

- The follow-up query that looks for a drafted invoice to delete now also uses normalizedIssueDate and normalizedDueDate:
  - eq(invoices.issueDate, normalizedIssueDate)
  - eq(invoices.dueDate, normalizedDueDate)

Why:
- On Vercel (and in general with server actions), the same server action can be executed more than once due to retries or double submissions.
- Previously, every call to addInvoice inserted a new row, so duplicate submissions produced duplicate invoices and incorrect totals.
- The new idempotency guard ensures that a second call with identical parameters reuses the already-created invoice instead of inserting another one.


2) Client-side submit guard in the invoice form
----------------------------------------------
- File: components/Clients/ClientPage/Invoices/NewInvoiceForm.tsx
- Component: NewInvoiceForm

What changed:
- React imports:
  - Updated to import useState from "react":
    - import { FormEvent, MouseEvent, useEffect, useState } from "react";

- New local state:
  - const [isSubmitting, setIsSubmitting] = useState(false);

- In handleSubmit:
  - The early guard for missing selectedClient/user/selectedProject stays the same.
  - Added a guard to prevent duplicate submissions while a request is in-flight:
    - if (isSubmitting) {
        console.log("Invoice submission already in progress. Ignoring duplicate submit.");
        return;
      }
  - Before calling addInvoice, the code now sets:
    - setIsSubmitting(true);
  - A finally block was added so that isSubmitting is always reset:
    - } finally {
        setIsSubmitting(false);
      }

- On the "Create Invoice" button:
  - Added disabled={isSubmitting} to prevent the user from clicking multiple times while the request is pending.

Why:
- Even with the server-side idempotency guard, it is good UX and an additional safety net to prevent multiple rapid submissions of the same form.
- This helps avoid confusing UI behavior and reduces unnecessary calls to the server action.


Behavioral Impact
-----------------
- When the user submits a new invoice:
  - The first valid submission still inserts a new invoice and calculates the outstanding/overdue/paid aggregates as before.
  - If the same request is retried (either by Vercel/server actions or the user clicking twice quickly), the server detects the existing invoice and returns it instead of inserting a duplicate row.
  - The UI now disables the "Create Invoice" button during the pending request and ignores duplicate clicks until the first request finishes.

Notes
-----
- No database schema changes were made; this is purely an application-level fix.
- No changes were made to the hooks that calculate invoice aggregates; they continue to work as before.

