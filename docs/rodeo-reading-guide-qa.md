# RODEO reading guide

## Scope

Replace the continuous introduction with a short overview and six user-controlled topics. Preserve the original introduction and all eleven bilingual chapters, the Shanghai-only listing, images, contact details and source links. Do not edit clinic database text or alter hosting, DNS or permissions.

## Layout and typography review

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| Medium | src/components/clinics/ClinicDescription.tsx | Eleven consecutive chapters | Six collapsed topic groups and an expand-all control | Progressive disclosure reduces the initial reading load without losing content. |
| Medium | src/lib/clinic-reading-guide.ts | Brand history before patient-facing information | Treatments, team, care and booking first | Order by importance helps visitors find useful information. |
| Medium | src/components/clinics/ClinicReadingGuide.tsx | Every paragraph presented at the same priority | One-sentence overview, three labeled facts, short topic hints | Clear grouping and a descending heading hierarchy support scanning. |

## Verified

- English and Chinese; 320, 768, 1024 and 1440 px. No horizontal document overflow or escaping text in collapsed or expanded layouts.
- Body copy remains 16 px with relaxed line spacing and a capped reading measure. Desktop and 320 px screenshots inspected.
- Native summary elements expose expanded/collapsed states. Tab reaches the first topic; Enter opens it and Space closes it while retaining focus.
- Expand all and Collapse all work by keyboard and pointer. No automatic animation or forced single-topic closing.
- All eleven original chapters retained once; the full original introduction remains inside the brand topic. All content and source links are present in server-rendered HTML, including closed disclosures.
- Arbitrary admin edits use their own chapter headings without stale reviewed summaries. Plain-text descriptions continue to render normally.
- 130 focused tests passed; the final toggle-state adjustment also passed all nine description tests. TypeScript and production build passed; 208 pages prerendered.
- No browser console errors during preview verification.

## Not verified

- 200% browser zoom, RTL visual mirroring, full assistive-technology sessions and a formal axe/WCAG audit. This is a scoped readability improvement, not an ADHD accessibility certification.

Approve for the verified scope; no remaining high-severity findings in the inspected section.
