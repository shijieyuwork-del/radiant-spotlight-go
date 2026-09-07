# Hospital directory detail pages

Implemented 7 September 2026. Each of the 101 existing static directory records now has a `/clinics/:slug` detail page. Additional hospitals found in published doctor profiles use the same route and data model; the current published clinic makes 102 browsable records. Counts refer to directory records, including separately listed departments and one medical tourism zone, not a claim of 102 unique partner hospitals.

## Content and navigation

- Directory photos and hospital names link to the corresponding detail page. Photo attribution remains independently operable, outside navigation links.
- City guides link to their existing hospital entries and the city's filtered directory.
- Detail pages show the institution's existing bilingual names, destination/area, available real photograph with author/license/source, and exact-matched published expert profiles.
- No invented addresses, ratings, accreditations, prices, treatments, or partnerships are added. Missing photos and missing expert profiles have explicit empty states.
- Consultation handoffs include the selected hospital and city. The hospital is not stored as an expert name; the existing optional form saves it in notes without a schema change. No customer submission was made during testing.
- Loading, failed lookup/retry, and noindex not-found states are provided for dynamic direct links. Existing static pages remain available when public doctor data cannot load.

## Identity and publication

`src/data/clinicDirectory.ts` is shared between the directory, detail pages, city links and prerendering. Static identities preserve all existing records. Dynamic association uses complete supplied names within the same exact city, not substring guesses. Ambiguous translations are isolated. Existing name-based alias URLs remain resolvable when translations are added, with the current canonical URL in metadata.

`src/lib/clinic-seo.ts` provides shared page metadata. The build emits 101 static hospital detail bodies and an HTML directory linking to all 101. Every static detail URL is included in the generated sitemap, with its own title, description, canonical and factual structured data. Runtime-only hospital records are not yet build-time snapshots and are not included in the static sitemap.

## Verification

- Production build: 209 total routes, including 101 hospital detail pages.
- Static HTML audit: all 101 detail bodies, canonical URLs and sitemap entries present; directory has 101 unique static detail links.
- Tests cover every static page, bilingual routes, dynamic profiles, unrelated doctors, error/retry/loading, consultation context, attribution link nesting, slug aliases, conflict isolation and factual SEO.
- Browser checks include production-preview directory navigation, genuine image loading, hospital-specific consultation dialog, and 320 / 768 / 1024 / 1440 px layouts.

This document records implementation, not proof of publication. Production remains dependent on the existing Lovable GitHub sync and a verified publish step. Do not disconnect/recreate the repository or change DNS to work around sync failures.
