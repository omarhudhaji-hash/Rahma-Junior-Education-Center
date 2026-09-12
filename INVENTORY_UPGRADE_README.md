# Inventory Management Upgrade

Adds proper school inventory management alongside the existing school-shop catalogue.

## Features
- Admin/Headteacher: create inventory items, opening stock, minimum stock, unit cost, supplier, location and condition.
- Stock actions: add stock, issue stock, record returns and audit transactions.
- Atomic database stock updates through `record_inventory_transaction`.
- Low-stock badges and dashboard totals.
- Teachers can see inventory items and items issued directly to their account.
- Parents can view currently available school inventory items.
- Existing uniform/store and M-Pesa inventory functionality is preserved.

## Supabase
Run migration:
`supabase/migrations/20260830210000_inventory_management_upgrade.sql`

## Run
`npm install`
`npm run dev`
