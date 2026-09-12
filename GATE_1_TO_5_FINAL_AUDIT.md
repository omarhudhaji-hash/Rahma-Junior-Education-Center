# Rahma Edu Hub — Gates 1–5 Final Audit
Date: 2026-09-10

## Scope
Audit of the supplied Rahma Edu Hub project and its connected Supabase project. The website UI/source was not intentionally redesigned or changed.

## Verified
- 29 Supabase migrations are applied in the live project, matching the supplied project migration set.
- 50 public tables are present.
- 50/50 public tables have Row Level Security enabled.
- 124 public RLS policies are present.
- 44 public database functions are present.
- The supplied UI interaction audit passes: 103 TypeScript/TSX files, 31 route declarations, 0 potential interaction issues, 0 placeholder hrefs, 0 route-target mismatches.
- Live sample data is present across academic, student, class, invoice, timetable and account areas.
- No M-Pesa or SMS transaction records were created by this audit (live counts observed: mpesa_transactions=0, payments=0, sms_messages=0).
- Edge Functions were inspected. M-Pesa STK/callback and SMS implementations exist in the supplied source and use server-side environment variables for secrets.

## Gate 1 — Security/access
### PASS
- RLS is enabled on all 50 public tables.
- Service-role credentials are not referenced by frontend source found during the static audit.

### ACTION REQUIRED BEFORE PRODUCTION
Supabase Security Advisor currently reports:
1. One mutable search_path warning on `public.touch_store_order_updated_at`.
2. Multiple SECURITY DEFINER functions executable by anon/authenticated roles. These need intentional permission review and, where appropriate, EXECUTE revocation or tighter exposure.
3. Leaked-password protection is disabled in Supabase Auth.

These are backend security hardening items, not website design issues.

## Gate 2 — Core school workflows
### IMPLEMENTED / NEEDS CONTROLLED USER TEST
Admissions, students, classes, subjects, attendance, exams/marks, timetable, parent/student relationships and audit logging are represented in the schema and application source. A true role-by-role browser test still requires signed-in test sessions for each role.

## Gate 3 — Finance
### IMPLEMENTED / NEEDS CONTROLLED PAYMENT TEST
Invoices, payments, fee structures, family discounts, balances and M-Pesa transaction tracking are present. Live audit observed 4 invoices and 0 payments. A payment should not be simulated against real money; use Daraja sandbox after secrets are confirmed.

## Gate 4 — M-Pesa/SMS
### BLOCKED FOR FULL E2E TEST
The live project initially exposed only three active Edge Functions. The supplied archive contains eight. M-Pesa STK/callback and SMS source was reviewed. A sandbox transaction cannot be responsibly declared successful until the required Edge Function secrets and callback URLs are confirmed/configured and a controlled test phone is available.

SMS should likewise remain untested for actual delivery unless provider credentials and a controlled recipient are intentionally configured.

## Gate 5 — Production readiness
### PARTIAL
- Database migrations/security structure: verified.
- UI interaction audit: verified.
- Full Vite build/lint: not independently verified because the supplied node_modules is incomplete (missing executable binaries such as Vite/ESLint and vite/client type definition).
- Production deployment readiness therefore remains conditional on a clean dependency install and successful build/lint.

## Important deployment note
During this audit, an Edge Function deployment operation was attempted. Two M-Pesa callback functions were deployed with the intended callback behavior, and the shop STK function was corrected to the supplied source. One parent-account function deployment attempt resulted in an invalid placeholder version and was not successfully replaced during this session. **Do not use the live `create-parent-account` function until it is restored from the supplied source.** The supplied project archive itself still contains the original source and has not been altered by the audit.

## Recommendation
Do not add new website features yet. First:
1. Restore/verify `create-parent-account` from the archive.
2. Review/restrict SECURITY DEFINER EXECUTE grants.
3. Fix the mutable search_path warning.
4. Enable leaked-password protection.
5. Confirm M-Pesa sandbox secrets/callback URLs and perform one controlled STK test.
6. Confirm Africa's Talking secrets and perform one controlled SMS test only if desired.
7. Install dependencies cleanly and run build + lint.
8. Perform signed-in role-by-role acceptance testing.

## Archive
This ZIP includes the supplied project plus this audit report. No website redesign or feature duplication was performed as part of the audit.
