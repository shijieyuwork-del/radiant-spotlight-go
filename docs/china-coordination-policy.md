# China-only coordination and deposit copy

Updated: 2026-09-08

## Confirmed by the business owner

- CeladonChina coordinates cosmetic-care visits and related travel in China only.
- The coordination deposit is USD 200.
- It is collected before the patient departs for China.
- After cancellation, the deposit can be held for one year.
- The deposit is returned on the day of surgery.
- Medical payments go directly to the treating institution, as described in the existing support page.

The existing free-support scope is retained: consultation and appointment coordination, airport transfers, interpretation for agreed visits, records organization, hotel booking guidance and follow-up coordination. The written support plan defines the included visits and services. Do not imply that medical care, flights, visas or hotel accommodation are free.

## Not yet supplied by the business owner

- Rescheduling rules.
- Deposit treatment when surgery cannot proceed.
- Deposit treatment at the end of the one-year hold, including any cash-refund rules.
- Refund method and bank processing time.

Public copy states the confirmed before-departure collection and one-year hold after cancellation. It asks patients to obtain written terms for the remaining cases. Do not invent forfeiture rules, promise an unconditional cancellation refund, or turn the cancellation hold into a general one-year expiry from payment. The refund-on-clinic-payment wording remains obsolete; the confirmed refund event is surgery day.

## Implementation

- `src/data/coordination-policy.ts` is the shared six-language source.
- `/travel-packages#payment-terms` separates “Free initial conversation” from “$200 coordination deposit” in adjacent cards. The first states “Start with questions at no cost and no obligation.” The second states “Collected before departure for China. Returned on surgery day. If you cancel, it can be held for one year. Other circumstances are confirmed in writing.”
- The actual free coordination scope remains visible alongside these terms. This wording does not turn airport transfers or agreed interpretation into paid coordination services.
- Medical payments and separate travel costs appear after the two cards.
- The lower free-support section repeats both the free initial conversation and the deposit summary, then links to the full explanation.
- Institution-provided language support is separate from CeladonChina's agreed interpretation arrangements.
- See `featured-clinic-sources.md` for the three priority institutions. A source review date is not a medical, licensing or partnership verification date.
