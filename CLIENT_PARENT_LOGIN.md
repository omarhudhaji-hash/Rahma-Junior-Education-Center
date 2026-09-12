# Parent portal login workflow

The parent portal account is created securely by the Admin or Headteacher through the Admissions page.

1. Open **Admissions → Parent portal login**.
2. Enter the parent's first name, last name, phone, email and a temporary password (8+ characters).
3. Click **Create / reset parent login**.
4. Use the same email when admitting the student. The admission workflow links the child to the parent account.
5. The parent signs in at `/auth` with that email and the password set by the school.

For a parent who was already admitted before portal credentials were added, use the same **Parent portal login** card. If the email/phone matches the existing family record, the function links all children in that family automatically.

## Supabase Edge Function

Deploy `supabase/functions/create-parent-account` as the `create-parent-account` Edge Function. It uses the caller's JWT to verify Admin/Headteacher access and uses the service-role key only inside the Edge Function.

Do not put `SUPABASE_SERVICE_ROLE_KEY` in the browser `.env` file.
