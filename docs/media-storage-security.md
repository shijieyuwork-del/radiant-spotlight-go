# Media storage hardening — 2026-09-29

## Finding and scope

Lovable flagged 12 `storage.objects` policies as not tying access to a caller.
Live inspection found five public read policies and seven administrator policies
across `doctor-photos`, `short-videos`, `video-covers`, `before-after` and
`clinic-photos`. All five buckets were already private, RLS was enabled, and
write policies already required the existing administrator's email. The finding
therefore did **not** establish that arbitrary users could modify files.

The clinic read policy nevertheless allowed every clinic object, without checking
publication or visibility. Other direct read policies bypassed the application's
audited signed-URL endpoint.

## Changes

Migration `20260929064000_harden_media_storage_access.sql` replaces those policies
with one authenticated administrator policy per bucket. Both `USING` and
`WITH CHECK` require the existing admin email **and** an `admin` role whose
`user_id` matches `auth.uid()`. No new role or permission recipient is created.
The migration fails safely if the existing administrator role is missing.

Media is organizational CMS content, including legacy/service-role uploads, so
restricting by object `owner_id` would incorrectly prevent administrators from
managing existing files. End users receive only published/visible media through
`request-file-access`, which checks record associations before signing URLs and
records access attempts. Server-side upload authentication remains unchanged.

No file contents, object ownership, patient records or user roles were modified.
All 129 existing objects remained after the change. Direct listing/signing is
now denied to non-administrators; already-issued signed URLs remain valid until
their expiry. This change does not retroactively revoke those URLs.

## Verification

- Applied the migration to the live project through its SQL editor and read back
  all five new policies, including matching read/write predicates.
- `node scripts/audit-media-storage-access.mjs`: passed for all five buckets.
  Anonymous listings are empty, direct signing is denied, an unknown/unapproved
  path is not signed, and one published sample per bucket returns a usable URL
  with a successful HTTP HEAD response.
- `supabase/tests/media_storage_access_readonly.sql`: passed in a read-only
  transaction. Anonymous and ordinary authenticated callers see zero objects;
  the admin email without its caller-bound role sees zero; the existing admin
  retains access to all 129 objects. No real user credentials are used.
- Actual uploads/deletions were deliberately not performed against production.
  The administrator's `ALL` policy uses the same tested authorization predicate
  for access and write checks; the upload endpoint itself was not changed.
- The live homepage's six Before & After images loaded successfully after the
  change. TypeScript checking and the five selected read-only storage-list
  integration tests passed (36 other integration tests were intentionally skipped).
- Lovable's Security screen no longer listed this storage finding and briefly
  showed the quick scan as “Up to date”. A manual quick-scan retry after source
  synchronization returned to “We couldn’t finish the security scan”, without
  advancing its last-scan time. Neither that retry nor the separate incomplete
  deep scan is counted as a completed clean scan. The access checks above are the
  verification evidence; dependency findings were not part of this fix.

The older `src/test/rls.test.ts` suite includes mutation probes and must only run
against an isolated test database. Use the dedicated read-only script in
production. Its storage-list expectations have been updated to the new policy.

This is a targeted access-control fix, not a complete application security audit
or evidence that historical unauthorized access did or did not occur.
