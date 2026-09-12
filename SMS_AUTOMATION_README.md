# Rahma Edu Hub — SMS Automation Upgrade

## Included
- Leadership SMS Center with parent, teacher, staff and all-contact audiences.
- Bulk-send confirmation before provider charges can occur.
- SMS enable/disable safety switch.
- Automation switches for fee payments, fee reminders, absence alerts, exam reminders, results and announcements.
- Provider and sender-ID settings (credentials are never stored in the database).
- SMS history with batch IDs and automation labels.
- Reusable SMS templates.
- Supabase Edge Function integration prepared for Africa's Talking.

## Supabase migration
Run:
`supabase/migrations/20260830120000_sms_automation_controls.sql`

## Edge Function secrets
Set these as Supabase Edge Function secrets:
- `AT_USERNAME`
- `AT_API_KEY`
- `AT_SENDER_ID` (optional until a sender ID is registered)

Then deploy:
`npx supabase functions deploy send-sms`

Keep `sms_enabled` OFF until the provider is configured and tested.
