# China-only coordination and deposit copy

Updated: 2026-09-08

## Confirmed by the business owner

- CeladonChina coordinates cosmetic-care visits and related travel in China only.
- The coordination deposit is USD 200.
- The deposit is returned on the day of surgery.
- Medical payments go directly to the treating institution, as described in the existing support page.

The existing free-support scope is retained: consultation and appointment coordination, airport transfers, interpretation for agreed visits, records organization, hotel booking guidance and follow-up coordination. The written support plan defines the included visits and services. Do not imply that medical care, flights, visas or hotel accommodation are free.

## Not yet supplied by the business owner

- The exact point at which the deposit is collected.
- Cancellation deadlines and refund treatment.
- Rescheduling rules.
- Deposit treatment when surgery cannot proceed.
- Refund method and bank processing time.

Until these are confirmed, public copy asks patients to obtain the applicable terms in writing before payment. This is not a finalized cancellation policy. Do not invent forfeiture rules, promise an unconditional cancellation refund, or restore the old 12-month validity / refund-on-clinic-payment wording.

## Implementation

- `src/data/coordination-policy.ts` is the shared six-language source.
- `/travel-packages#payment-terms` groups free scope, deposit, surgery-day return and the request for written cancellation terms.
- The lower free-support section repeats the surgery-day return and links to the full explanation.
- Institution-provided language support is separate from CeladonChina's agreed interpretation arrangements.
- See `featured-clinic-sources.md` for the three priority institutions. A source review date is not a medical, licensing or partnership verification date.
