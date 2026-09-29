# Compact homepage doctor cards

The homepage expert marquee uses roughly half the former card area, without scaling down its text. At a 1280px viewport each card measures about 282 × 410px (previously about 400 × 584px). Four complete cards and a glimpse of the next fit in the rail.

The compact front prioritizes the portrait, name, role and city. Full roles, the patient-facing introduction and biography remain on the flip side. Long introductions scroll within the back, keeping the profile link and return button available. Portrait height is 160px; names remain 22px. Detail and return controls retain 44px targets and accessible labels. Focus transfer uses `preventScroll` to avoid jumping during the flip.

The same six published doctors, their portrait assets, single-row loop, hover pause, manual pause and reduced-motion fallback are unchanged. Loading placeholders match the new compact height.

## Verification

- Targeted doctor card, marquee and published-doctor tests: 31 passed.
- Targeted ESLint, application TypeScript check and production build passed (208 prerendered pages; existing bundle warnings).
- Browser checks at 1280px, 390px and 320px: consistent 410px card height, readable original font sizes, 44px detail controls, working detail toggle and profile links. Long text remains in the scrollable detail face.
- Not verified: browser 200% zoom and RTL/translated-language visual checks.

Scope: homepage cards and their loading state only; the full expert directory is unchanged.
