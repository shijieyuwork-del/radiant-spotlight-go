# GA4 and GTM setup for Cosmetics Asia

The site implements privacy-first measurement. Google tags do not load until a visitor chooses **Allow analytics**. Advertising storage, advertising user data, and advertising personalization remain denied.

## Environment variables

Set both production variables:

- `VITE_GTM_ID=GTM-M8PV34ZC`
- `VITE_GA4_MEASUREMENT_ID=G-KLCMXD4L9Y`

The site loads both only after analytics consent. GA4 receives the sanitized events directly, while GTM receives matching `dataLayer` events for Preview and future integrations. Do not add a second GA4/Google tag inside GTM, a CMS plugin, or the theme; doing so would double-count events.

## GTM container

The production container is intentionally tag-free at launch. Use Preview to inspect the following consent-gated `dataLayer` events:

1. Do not add a GA4/Google tag while direct GA4 collection is enabled in the site.
2. Do not add an All Pages page-view tag. The React app emits privacy-safe SPA page views itself.
3. If GTM is later used for another consented analytics destination, map `page_location`, `page_path`, `page_title`, and `page_group` from data-layer variables with those exact names. Never use the browser's raw Page URL for sensitive routes.
4. Available events are:
   - `page_view`
   - `view_landing_page`
   - `select_cta`
   - `start_quote`
   - `quote_option_selected`
   - `quote_step_completed`
   - `generate_lead`
   - `whatsapp_handoff`
   - `view_pricing`
   - `expand_faq`
5. Mark `generate_lead` as a GA4 key event only after testing.
6. Do not enable Enhanced Conversions, User-ID, Google Signals, remarketing audiences, or form-field variables for this healthcare-related site.

Allowed event parameters are deliberately limited to aggregate labels such as `source`, `position`, `option`, `step`, `section`, and `page_group`. Never add treatment names, provider names, case IDs, form answers, emails, phone numbers, notes, or other health/contact data.

## Verification

Use GTM Preview / Tag Assistant and check both paths:

- Choose **Essential only**: no request should be made to `googletagmanager.com` or `google-analytics.com`.
- Choose **Allow analytics**: GTM should load and a grouped `page_view` should appear. A treatment landing URL must be reported as `/lp/treatment-consultation`, not the treatment slug.

Legal requirements vary by market. The implementation minimizes data and honors choice, but the privacy notice and consent language should still be reviewed by counsel for the countries targeted.
