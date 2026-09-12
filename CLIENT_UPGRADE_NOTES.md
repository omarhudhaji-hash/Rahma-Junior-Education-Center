# Rahma Edu Hub – Client Upgrade Notes

This build implements the requested school workflows and role boundaries.

## Apply database upgrade

In Supabase SQL Editor, run the complete migration:

`supabase/migrations/20260829000000_school_workflows.sql`

It is designed to be rerunnable for the policies introduced by this upgrade.

## New portal routes

- `/portal/admissions` – Admin/Headteacher admissions review, approval, class assignment and family records.
- `/portal/exams` – exam creation, timetable, applications/registration, mercy approvals and family report downloads.
- `/portal/staff` – separate staff directory.
- `/portal/parents` – separate parent directory.

## Role rules

- Admin/Director: full administration.
- Headteacher: leadership operations, but no Admin role-management or finance collection totals/invoice/receipt management.
- Teacher: assigned classes/students, attendance and student remarks; no finance and no message composition.
- Parent: linked children only, attendance, teacher remarks, timetable, finance/M-Pesa and exam registration; messages are view-only.
- Student: own record and family-safe academic information.

## M-Pesa

The parent finance page includes an M-Pesa STK Push flow. To make real payments work, deploy the two Edge Functions and set the M-Pesa Daraja secrets listed in `.env.example` as Supabase Edge Function secrets. A successful callback inserts a `payments` record, so the displayed balance updates from the recorded payment.

## CBC

The public site and school class catalogue now run through Grade 9, including Junior Secondary (Grades 7–9).

## Local development

```bash
npm install
npm run dev
```

Use the Supabase publishable key and project URL in the Vite environment variables.

## 30 Aug 2026 client-requested upgrade

- Admissions now supports manual family + learner admission for Admin and Headteacher, class assignment, and optional initial fee invoice creation.
- Staff now has a formal manual teacher/staff record form.
- Inventory is a school shop catalogue for uniforms, books, stationery and other items; Admin and Headteacher can publish items, while Parents can browse and start M-Pesa checkout.
- Added inventory order payment transaction tables and Edge Functions for M-Pesa shop purchases.
- Existing `uniform_items` catalogue is extended with category and stock quantity fields.

### Supabase migration
Run:
`supabase/migrations/20260830000000_client_inventory_admission_staff.sql`

### M-Pesa shop deployment
Deploy the new Edge Functions:
- `mpesa-inventory-stk`
- `mpesa-inventory-callback`

Set `MPESA_INVENTORY_CALLBACK_URL` to the deployed callback function URL (or keep using the existing `MPESA_CALLBACK_URL` if the same endpoint is configured for your deployment). Keep all M-Pesa credentials in Edge Function secrets only.

Manual admission can automatically link a parent portal account when the parent's email already exists in Supabase Auth. If no Auth account exists yet, the family/student record is still admitted; create the parent's portal Auth account later with the same email to link future children.
