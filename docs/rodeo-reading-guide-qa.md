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

## Follow-up: customer-facing copy and six-photo gallery

The owner's follow-up supersedes the original instruction to preserve contact/source prose: retain the official website and address, remove hospital telephone/email, and rewrite report-style wording. All eleven chapters remain in six user-controlled groups, with practical booking notes replacing the source-notes group. Internal provenance is preserved in rodeo-clinic-sources.md.

- Saved matching English/Chinese descriptions in the clinic record and build-time defaults. Verified database MD5 values: English `538a46463436db5f4fc9c7137bb60cde`, Chinese `b22d5d8f1f6f690cb870240a58af3deb`.
- Uploaded and assigned six original Shanghai photographs. All six loaded at 1280 px width; selecting the sixth displayed the lounge photograph, and selecting the first restored the reception cover. Original stored montage retained for recovery.
- Preview checked in English and Chinese. Six disclosure groups and eleven chapters remain; expand/collapse works. No brochure wording or hospital telephone/email in the expanded page. Official website, Shanghai address and Sino Aesthetics contact controls retained.
- 390 px mobile screenshot inspected: six usable thumbnails, no document overflow. Temporary viewport reset. Desktop also has no overflow. No preview console errors.
- 145 focused clinic/gallery/storage tests passed. TypeScript and production build passed; 208 pages prerendered. Full-suite run reported 497 passes, 7 skips and 10 failures in other suites; no unrelated assertions were modified for this scoped change.
- Incorporated the latest remote clinic-concierge copy without overwriting it before publishing this update.
