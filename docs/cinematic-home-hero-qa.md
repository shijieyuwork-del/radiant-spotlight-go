# Celadon homepage: cinematic hero

## Scope

- Reference: https://www.framer.com/marketplace/templates/clipcut/ and its public preview.
- Adapt the floating navigation, generous centred title and curved, perspective video composition to the existing Celadon palette.
- User explicitly requested retaining the current colours. No black/orange theme, copied template assets, or platform migration.
- All existing text, case destinations, contact/account/language controls and lower-page content remain available.
- Home only: other pages keep the existing navigation presentation. Existing gallery layouts remain available to other sections.

## Checks (2026-09-17)

- 35 targeted tests passed: gallery localisation and arc presentation, visitor-controlled video, consultation CTA localisation, doctor flip cards.
- TypeScript check and production build passed (208 prerendered pages).
- Browser widths 320, 768, 1024 and 1440: no document or navigation overflow; mobile/tablet use a horizontal rail, desktop uses the arc.
- Mobile menu retains all 11 navigation destinations plus language, currency, saved cases and account controls.
- Next-item control scrolls the gallery; a card opens its video; closing stops playback and restores focus to the initiating card.
- Hero consultation CTA opens the existing contact flow; no enquiry submitted during verification.
- No browser console errors in the production preview.
- Decorative card transforms are static. Hover is pointer-gated and reduced-motion disables card movement/transitions. The arc adds no autoplay or continuous animation.

## Implementation notes

- Gallery cards reuse supplied case posters and the existing accessible player.
- Colours reference existing site tokens; cinematic styles are scoped to the home hero and optional floating navigation.
- No backend, DNS, domain or medical-profile changes.
