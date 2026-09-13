# Clinic galleries: twelve-photo limit

Updated 2026-09-14 (UTC).

- Shared parsing limit, admin validation, upload capacity, list counters and editor counters now use `MAX_CLINIC_PHOTOS = 12`.
- The public gallery already renders all resolved photos; twelve thumbnails and selection of photo twelve were verified.
- Migration `20260914031000_expand_clinic_gallery_to_twelve.sql` replaces only the gallery validator and column comment. It preserves the existing check constraint, path validation, NULL inheritance and intentionally empty galleries.
- Applied the migration through the signed-in Lovable Cloud SQL editor. Live checks: twelve accepted; thirteen rejected; NULL and empty array accepted; unsafe path rejected; existing constraint retained.
- The fingerprint of stored clinic gallery data remained `ccc7b4a3148ccb593f277b14237b33a5` before and after. No clinic data or storage objects were changed.
- 127 focused gallery/directory/detail tests passed. TypeScript and the production build passed. The admin test was rerun after updating its list counter.
- A local-only interactive fixture confirmed twelve-photo rendering, the disabled add button at capacity, re-enabling after removal, and public selection of photo twelve. No horizontal overflow at 320, 768, 1024 or 1440 pixels; no browser console errors.
