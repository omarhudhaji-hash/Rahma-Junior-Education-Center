# Rahma Edu Hub — Security & Audit Logs

This upgrade adds an administrator-only, read-only audit trail for important school-data changes.

## Supabase

Run once:

`supabase/migrations/20260830240000_audit_logs.sql`

The migration creates `public.audit_logs`, enables RLS, permits SELECT only to administrators, and installs SECURITY DEFINER triggers on high-value school tables when those tables exist. Credential-like JSON fields are stripped from snapshots.

## Portal

Administrators get **Security & Audit Logs** in the portal menu. It supports search and action filtering and shows date/time, action, table, record, description and actor ID prefix.

The audit table itself has no authenticated INSERT/UPDATE/DELETE policy.

## Important

This records database INSERT/UPDATE/DELETE activity. Supabase Auth login/logout events are not written by the database triggers; those can be added later through an auth event/audit pipeline if required.
