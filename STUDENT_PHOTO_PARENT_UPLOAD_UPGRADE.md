# Student Photo & Parent Upload Upgrade

Parents can add or change profile photos for their own linked children directly from the Family Dashboard or Student Profile. Admin and Headteacher no longer need to manage routine student photos.

The migration adds a secure parent-only storage insert/update policy and a security-definer RPC that verifies the parent/student relationship before changing `students.photo_url`.

Public admission photo upload remains supported.
