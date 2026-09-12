# Finance & Family Discounts Upgrade

This upgrade expands Finance into a proper fee-management workflow.

## Features
- Fee structures by class and term
- Student invoices with base amount, discount amount and net amount
- Automatic sibling/family discount rules based on active linked children
- Manual family or student discounts with reasons and approval audit fields
- Payment recording with cash, M-Pesa, bank, card or other methods
- Automatic receipt numbers using the existing payments table
- Parent/student family finance view with fee statements, discounts, balances and recent receipts
- Admin finance dashboard with billed, collected, outstanding and discount totals
- Headteacher remains read-only for finance administration

## Supabase
Run:
`supabase/migrations/20260830100000_family_finance_discounts.sql`

## Local setup
Copy the working `.env` values into the project, then:
`npm install`
`npm run dev`
